import { FaPlus } from "react-icons/fa";

export default function AddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-btn-add text-white rounded-full shadow-lg hover:bg-btn-add-dark active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-btn-add-light"
      title="Tambah Card"
      aria-label="Tambah Card"
    >
      {/* Neon ring - aktif saat diklik saja */}
      <span className="absolute -inset-1 rounded-full bg-btn-add/60 blur-sm opacity-0 group-active:opacity-100 group-active:animate-pulse pointer-events-none transition-opacity duration-150" />

      {/* Pulse wave light effect - aktif saat diklik saja */}
      <span className="absolute inset-0 rounded-full bg-btn-add opacity-0 group-active:opacity-75 group-active:animate-ping pointer-events-none" />

      {/* Icon */}
      <FaPlus className="w-6 h-6 z-10 transition-transform duration-200 group-active:rotate-90" />
    </button>
  );
}
