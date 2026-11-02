import { useState } from "react";

export default function ModalEditorPdf({
  isOpen,
  onClose,
  onSubmit,
  defaultValue = {},
}) {
  const [title, setTitle] = useState(defaultValue?.title || "");
  const [files, setFiles] = useState([]); // Untuk file baru
  const [existingFiles, setExistingFiles] = useState(
    defaultValue?.existingFiles || [],
  ); // Untuk file lama
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const removeExisting = (id) => {
    setExistingFiles(existingFiles.filter((f) => f.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) return setErrorMsg("Judul tidak boleh kosong!");
    if (files.length === 0 && existingFiles.length === 0)
      return setErrorMsg("Minimal 1 file PDF wajib ada!");

    setErrorMsg("");
    // Kirim data gabungan (opsional ditangkap di backend)
    onSubmit({ title: title.toUpperCase(), files, existingFiles });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-card-text/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-5">
        <h2 className="text-xl font-bold border-b pb-3">Form Dokumen PDF</h2>
        {errorMsg && (
          <div className="p-3 text-sm text-danger bg-danger-light rounded-xl">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Judul Doa/Peraturan
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-xl"
          />
        </div>

        {/* --- TAMPILAN FILE LAMA SAAT EDIT --- */}
        {existingFiles && existingFiles.length > 0 && (
          <div className="p-3 bg-gray-50 border rounded-xl">
            <p className="text-xs font-semibold mb-2 text-card-muted">
              File Tersimpan (Klik X untuk hapus):
            </p>
            <ul className="space-y-1">
              {existingFiles.map((f) => (
                <li
                  key={f.id}
                  className="flex justify-between items-center text-sm bg-white p-2 border rounded"
                >
                  <span className="truncate">
                    📄 {f.file_name || "Dokumen PDF"}
                  </span>
                  <button
                    onClick={() => removeExisting(f.id)}
                    className="text-danger font-bold px-2 hover:bg-danger-light rounded"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Upload Tambahan/Baru
          </label>
          <div className="flex items-center gap-3">
            <label className="px-4 py-2 bg-secondary text-white text-sm font-semibold rounded-lg cursor-pointer hover:opacity-90">
              Choose Files
              <input
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(e) =>
                  setFiles((prev) => [...prev, ...Array.from(e.target.files)])
                }
              />
            </label>
            <span className="text-sm text-gray-600">
              {files.length === 0 && "No file chosen"}
            </span>
          </div>
          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((f, i) => (
                <li key={i} className="text-sm text-card-muted">
                  📄 {f.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-card-muted">
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-secondary text-white rounded-xl"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
