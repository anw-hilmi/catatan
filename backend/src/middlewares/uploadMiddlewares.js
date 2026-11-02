import multer from "multer";

export const uploadPdf = multer({
  storage: multer.memoryStorage(), // Simpan di RAM sebelum dikirim ke Supabase
  limits: { fileSize: 30 * 1024 * 1024 }, // 5 MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Hanya file PDF yang diperbolehkan"), false);
  },
});
