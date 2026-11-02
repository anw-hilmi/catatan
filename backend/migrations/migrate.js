import pool from "../src/config/database.js";

const migrateUpQuery = `
  CREATE TABLE IF NOT EXISTS peraturan (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tugas_utama (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tugas_harian (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS acara (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS doa (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS doa_files (
    id VARCHAR(50) PRIMARY KEY,
    doa_id VARCHAR(50) REFERENCES doa(id) ON DELETE CASCADE,
    file_name VARCHAR(255),
    file_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`;

const migrateDownQuery = `
  DROP TABLE IF EXISTS doa_files CASCADE;
  DROP TABLE IF EXISTS doa CASCADE;
  DROP TABLE IF EXISTS acara CASCADE;
  DROP TABLE IF EXISTS tugas_harian CASCADE;
  DROP TABLE IF EXISTS tugas_utama CASCADE;
  DROP TABLE IF EXISTS peraturan CASCADE;
  DROP TABLE IF EXISTS admin CASCADE;
`;

const runMigration = async () => {
  const action = process.argv[2]; // Mengambil argumen dari terminal

  try {
    if (action === "up") {
      await pool.query(migrateUpQuery);
      console.log("Migration UP berhasil dijalankan!");
    } else if (action === "down") {
      await pool.query(migrateDownQuery);
      console.log("Migration DOWN berhasil dijalankan!");
    } else {
      console.log(
        "Gunakan argumen 'up' atau 'down'. Contoh: node migration.js up",
      );
    }
  } catch (error) {
    console.error("Migration gagal:", error);
  } finally {
    await pool.end();
  }
};

runMigration();
