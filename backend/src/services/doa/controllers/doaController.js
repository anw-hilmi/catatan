import { nanoid } from "nanoid";
import { supabase } from "../../../config/supabase.js";
import { doaRepository } from "../repositories/doaRepository.js";
import { doaSchema } from "../validator/schema.js";
import sendSuccessResponse from "../../../utils/response.js";

export const doaController = {
  getAllHandler: async (req, res, next) => {
    try {
      const data = await doaRepository.getAll(req.query.search || "");
      return sendSuccessResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  createHandler: async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0)
        throw new Error("Minimal satu file PDF wajib diunggah");

      const { error, value } = doaSchema.validate(req.body);
      if (error) throw new Error(error.message);

      const doaId = nanoid(16);
      const filesData = [];

      // Loop untuk upload tiap file
      for (const file of req.files) {
        const uniqueId = nanoid(8);

        // 1. Kembalikan encoding huruf Arab yang rusak dari Multer
        const originalName = Buffer.from(file.originalname, "latin1").toString(
          "utf8",
        );

        // 2. Gunakan nama aman (huruf & angka saja) untuk Supabase Storage agar tidak error
        const fileName = `doa/${Date.now()}-${uniqueId}.pdf`;

        const { error: uploadError } = await supabase.storage
          .from("catatan")
          .upload(fileName, file.buffer, { contentType: "application/pdf" });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("catatan")
          .getPublicUrl(fileName);

        filesData.push({
          id: nanoid(16),
          file_url: publicUrlData.publicUrl,
          file_name: originalName, // 3. Simpan nama asli berhuruf Arab ke JSON/Database
        });
      }

      const data = await doaRepository.create(
        { id: doaId, ...value },
        filesData,
      );
      return sendSuccessResponse(
        res,
        data,
        "Doa beserta file berhasil dibuat",
        201,
      );
    } catch (err) {
      next(err);
    }
  },

  deleteHandler: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { username, password } = req.body;

      const existingDoa = await doaRepository.getById(id);
      if (!existingDoa) throw new Error("Doa tidak ditemukan");
      if (
        existingDoa.username !== username ||
        existingDoa.password !== password
      ) {
        throw new Error("Username atau password salah");
      }

      const { filesToUnlink } = await doaRepository.delete(id);

      // Hapus file dari Supabase Storage
      for (const file of filesToUnlink) {
        const filePath = file.file_url.split("/catatan/")[1]; // Ambil nama path setelah nama bucket
        if (filePath) await supabase.storage.from("catatan").remove([filePath]);
      }

      return sendSuccessResponse(
        res,
        null,
        "Doa beserta file berhasil dihapus",
      );
    } catch (err) {
      next(err);
    }
  },

  updateHandler: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { username, password } = req.body;

      const { error, value } = doaSchema.validate(req.body);
      if (error) throw new Error(error.message);

      const existingDoa = await doaRepository.getById(id);
      if (!existingDoa) throw new Error("Doa tidak ditemukan");
      if (
        existingDoa.username !== username ||
        existingDoa.password !== password
      ) {
        throw new Error("Username atau password salah");
      }

      const filesData = [];

      // PERBAIKAN: Bungkus dengan if (req.files) agar tidak error saat edit tanpa ganti file
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const uniqueId = nanoid(8);

          const originalName = Buffer.from(
            file.originalname,
            "latin1",
          ).toString("utf8");
          const fileName = `doa/${Date.now()}-${uniqueId}.pdf`;

          const { error: uploadError } = await supabase.storage
            .from("catatan")
            .upload(fileName, file.buffer, { contentType: "application/pdf" });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from("catatan")
            .getPublicUrl(fileName);

          filesData.push({
            id: nanoid(16),
            file_url: publicUrlData.publicUrl,
            file_name: originalName,
          });
        }
      }

      const { updatedDoa, oldFilesToUnlink } = await doaRepository.update(
        id,
        value,
        filesData,
      );

      if (oldFilesToUnlink && oldFilesToUnlink.length > 0) {
        for (const file of oldFilesToUnlink) {
          const filePath = file.file_url.split("/catatan/")[1];
          if (filePath)
            await supabase.storage.from("catatan").remove([filePath]);
        }
      }

      return sendSuccessResponse(res, updatedDoa, "Doa berhasil diperbarui");
    } catch (err) {
      next(err);
    }
  },

  streamPdf: async (req, res) => {
    try {
      const { fileId } = req.params;
      const fileData = await doaRepository.getFileById(fileId); // Pastikan doaRepository sudah di-import

      if (!fileData)
        return res.status(404).json({ message: "File tidak ditemukan" });

      const response = await fetch(fileData.file_url);
      if (!response.ok) throw new Error("Gagal mengambil file dari storage");

      const buffer = await response.arrayBuffer();

      res.setHeader("Content-Type", "application/pdf");
      // Header inline membuat PDF terbuka di tab baru dengan nama asli
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(fileData.file_name)}"`,
      );

      res.send(Buffer.from(buffer));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
