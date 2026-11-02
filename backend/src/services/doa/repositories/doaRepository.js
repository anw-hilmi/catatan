import pool from "../../../config/database.js";

export const doaRepository = {
  getAll: async (search = "") => {
    const query = `
      SELECT d.id, d.title, d.created_at, 
             COALESCE(json_agg(json_build_object('id', f.id, 'file_url', f.file_url, 'file_name', f.file_name)) FILTER (WHERE f.id IS NOT NULL), '[]') as files
      FROM doa d
      LEFT JOIN doa_files f ON d.id = f.doa_id
      WHERE d.title ILIKE $1
      GROUP BY d.id ORDER BY d.created_at DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    return result.rows;
  },

  getById: async (id) => {
    const query = `
      SELECT d.id, d.title, d.username, d.password, d.created_at,
             COALESCE(json_agg(json_build_object('id', f.id, 'file_url', f.file_url, 'file_name', f.file_name)) FILTER (WHERE f.id IS NOT NULL), '[]') as files
      FROM doa d
      LEFT JOIN doa_files f ON d.id = f.doa_id
      WHERE d.id = $1
      GROUP BY d.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  create: async (doaData, filesData) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const doaQuery = `INSERT INTO doa (id, username, password, title) VALUES ($1, $2, $3, $4) RETURNING id, title, created_at`;
      const doaResult = await client.query(doaQuery, [
        doaData.id,
        doaData.username,
        doaData.password,
        doaData.title,
      ]);

      const insertedFiles = [];
      if (filesData.length > 0) {
        const fileQuery = `INSERT INTO doa_files (id, doa_id, file_url, file_name) VALUES ($1, $2, $3, $4) RETURNING id, file_url, file_name`;
        for (const file of filesData) {
          const fResult = await client.query(fileQuery, [
            file.id,
            doaData.id,
            file.file_url,
            file.file_name,
          ]);
          insertedFiles.push(fResult.rows[0]);
        }
      }

      await client.query("COMMIT");
      return { ...doaResult.rows[0], files: insertedFiles };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  delete: async (id) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const getFiles = await client.query(
        `SELECT file_url FROM doa_files WHERE doa_id = $1`,
        [id],
      );
      await client.query(`DELETE FROM doa_files WHERE doa_id = $1`, [id]);
      const doaResult = await client.query(
        `DELETE FROM doa WHERE id = $1 RETURNING id`,
        [id],
      );
      await client.query("COMMIT");
      return { deletedId: doaResult.rows[0]?.id, filesToUnlink: getFiles.rows };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  update: async (id, doaData, filesData) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const doaQuery = `UPDATE doa SET title = $1, created_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, title, created_at`;
      const doaResult = await client.query(doaQuery, [doaData.title, id]);

      let oldFilesToUnlink = [];
      let currentFiles = [];

      if (filesData && filesData.length > 0) {
        const getOldFiles = await client.query(
          `SELECT file_url FROM doa_files WHERE doa_id = $1`,
          [id],
        );
        oldFilesToUnlink = getOldFiles.rows;

        await client.query(`DELETE FROM doa_files WHERE doa_id = $1`, [id]);

        // PERBAIKAN: Tambahkan file_name ke query INSERT
        const fileQuery = `INSERT INTO doa_files (id, doa_id, file_url, file_name) VALUES ($1, $2, $3, $4) RETURNING id, file_url, file_name`;
        for (const file of filesData) {
          const fResult = await client.query(fileQuery, [
            file.id,
            id,
            file.file_url,
            file.file_name, // Parameter $4
          ]);
          currentFiles.push(fResult.rows[0]);
        }
      } else {
        // PERBAIKAN: Tambahkan file_name ke query SELECT
        const getFiles = await client.query(
          `SELECT id, file_url, file_name FROM doa_files WHERE doa_id = $1`,
          [id],
        );
        currentFiles = getFiles.rows;
      }

      await client.query("COMMIT");
      return {
        updatedDoa: { ...doaResult.rows[0], files: currentFiles },
        oldFilesToUnlink,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  getFileById: async (fileId) => {
    const query = `SELECT file_url, file_name FROM doa_files WHERE id = $1`;
    const result = await pool.query(query, [fileId]);
    return result.rows[0];
  },
};
