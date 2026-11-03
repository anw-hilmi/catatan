import { FaDownload } from "react-icons/fa";

export default function DownloadButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group  fixed bottom-4 right-[4.5rem] sm:bottom-6 sm:right-24 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-btn-download text-white rounded-full shadow-lg hover:bg-btn-download-dark active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-btn-download-light"
      title="Download Semua Catatan"
      aria-label="Download Semua Catatan"
    >
      {/* Neon ring - aktif saat diklik saja */}
      <span className="absolute -inset-1 rounded-full bg-btn-download/60 blur-sm opacity-0 group-active:opacity-100 group-active:animate-pulse pointer-events-none transition-opacity duration-150" />

      {/* Pulse wave light effect - aktif saat diklik saja */}
      <span className="absolute inset-0 rounded-full bg-btn-download opacity-0 group-active:opacity-75 group-active:animate-ping pointer-events-none" />

      {/* Icon */}
      <FaDownload className="w-6 h-6  z-10 transition-transform duration-200 group-active:translate-y-0.5" />
    </button>
  );
}
