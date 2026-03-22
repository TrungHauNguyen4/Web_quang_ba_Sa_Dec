import { motion } from "motion/react";
import { useState } from "react";
import { Play, Image as ImageIcon } from "lucide-react";

export function Gallery() {
  const [activeTab, setActiveTab] = useState("images");

  const images = [
    "https://images.unsplash.com/photo-1708448341128-60d0b6cdbf12?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1707807562742-bf69e7feaf4e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1724935451945-1f1967520d32?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1560091807-fd148c31a728?auto=format&fit=crop&q=80&w=800",
  ];

  const videos = [
    { title: "Toàn cảnh Làng Hoa Sa Đéc nhìn từ trên cao", thumb: "https://images.unsplash.com/photo-1708448341128-60d0b6cdbf12?auto=format&fit=crop&q=80&w=800" },
    { title: "Khám phá Nhà Cổ Huỳnh Thủy Lê", thumb: "https://images.unsplash.com/photo-1724935451945-1f1967520d32?auto=format&fit=crop&q=80&w=800" },
    { title: "Cách làm Hủ Tiếu truyền thống", thumb: "https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-teal-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Thư Viện Ảnh & Video</h1>
        <p className="text-teal-100 max-w-2xl mx-auto px-4">Khám phá vẻ đẹp của Sa Đéc qua những góc máy đầy nghệ thuật.</p>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab("images")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
              activeTab === "images" 
                ? "bg-teal-600 text-white shadow-md" 
                : "bg-white text-stone-600 hover:bg-teal-50"
            }`}
          >
            <ImageIcon size={20} /> Hình Ảnh
          </button>
          <button 
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
              activeTab === "videos" 
                ? "bg-teal-600 text-white shadow-md" 
                : "bg-white text-stone-600 hover:bg-teal-50"
            }`}
          >
            <Play size={20} /> Video
          </button>
        </div>

        {activeTab === "images" ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((src, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer bg-stone-200"
              >
                <img 
                  src={src} 
                  alt={`Gallery image ${i + 1}`} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <ImageIcon size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video mb-4 bg-stone-900">
                  <img src={video.thumb} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-teal-600 shadow-xl group-hover:scale-110 transition-transform">
                      <Play size={32} className="ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold">
                    03:45
                  </div>
                </div>
                <h3 className="text-xl font-bold text-stone-800 group-hover:text-teal-600 transition-colors line-clamp-2">{video.title}</h3>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
