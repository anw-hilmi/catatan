import { FaEdit, FaTrash } from "react-icons/fa";

export default function CardItemPdf({ title, files, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-card-border rounded-xl overflow-hidden flex flex-col h-full">
      {/* Bagian Header Card */}
      <div className="bg-card-header px-4 py-3 border-b border-card-border">
        <h3 className="font-bold text-sm uppercase text-card-text">{title}</h3>
      </div>

      {/* Bagian Body Card (File & Tombol) */}
      <div className="p-4 flex flex-col h-full">
        <div className="flex flex-col gap-2 mb-6">
          {files && files.length > 0 ? (
            files.map((file, index) => (
              <a
                key={file.id}
                href={`http://localhost:5000/api/doa/pdf/${file.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-btn-add underline hover:text-btn-add-dark line-clamp-1"
              >
                📄 {file.file_name || `Dokumen PDF ${index + 1}`}
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-400">Tidak ada file lampiran.</p>
          )}
        </div>

        {/* Tombol aksi di pojok kanan bawah */}
        <div className="flex justify-end gap-4 mt-auto text-card-muted">
          <button
            onClick={onEdit}
            className="hover:text-secondary transition-colors"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="hover:text-danger transition-colors"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
