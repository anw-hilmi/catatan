import { FaInfoCircle, FaVideo } from "react-icons/fa";

export default function Informasi() {
  const tutorials = [
    {
      id: 1,
      title: "Cara Membuat, Mengedit, dan Menghapus Catatan",
      videoUrl: "https://www.youtube.com/embed/VaCqmyw87wI",
    },
    {
      id: 2,
      title: "Cara Mengedit dan Melihat Username dan Password",
      videoUrl: "https://www.youtube.com/embed/GDyOX060YJg",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6">
      <div className="bg-white rounded-2xl border border-card-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-card-border bg-card-header">
          <h2 className="text-xl sm:text-2xl font-bold text-card-text flex items-center gap-2">
            <FaInfoCircle className="text-secondary" />
            Pusat Informasi & Bantuan
          </h2>
          <p className="text-sm sm:text-base text-card-muted mt-1.5">
            Panduan penggunaan website dan bantuan teknis.
          </p>
        </div>

        <div className="p-5 sm:p-6 lg:p-8">
          {/* Bagian Video Tutorial */}
          <h3 className="text-lg sm:text-xl font-bold text-card-text mb-5 flex items-center gap-2 border-l-4 border-secondary pl-3">
            <FaVideo className="text-secondary" />
            Video Tutorial Penggunaan
          </h3>

          <div className="flex flex-col gap-6">
            {tutorials.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl overflow-hidden border border-card-border shadow-sm hover:shadow-md transition-shadow group w-full"
              >
                <div className="aspect-video bg-card-header relative">
                  <iframe
                    className="w-full h-full absolute top-0 left-0"
                    src={video.videoUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4 bg-white">
                  <h4 className="font-semibold text-card-text text-sm sm:text-base group-hover:text-secondary transition-colors">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
