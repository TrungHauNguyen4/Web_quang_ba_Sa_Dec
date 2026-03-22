import { useState } from "react";
import { Upload, Search, Filter, Trash2, Eye, Copy, Check, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AdminMedia() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const mediaFiles = [
    { id: 1, url: "https://images.unsplash.com/photo-1708448341128-60d0b6cdbf12?auto=format&fit=crop&q=80&w=600", name: "lang-hoa-sa-dec-2026.jpg", size: "2.4 MB", date: "20/02/2026" },
    { id: 2, url: "https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=600", name: "song-tien-hoang-hon.webp", size: "1.8 MB", date: "19/02/2026" },
    { id: 3, url: "https://images.unsplash.com/photo-1707807562742-bf69e7feaf4e?auto=format&fit=crop&q=80&w=600", name: "chua-kien-an-cung.jpg", size: "3.1 MB", date: "18/02/2026" },
    { id: 4, url: "https://images.unsplash.com/photo-1724935451945-1f1967520d32?auto=format&fit=crop&q=80&w=600", name: "nha-co-huynh-thuy-le.png", size: "4.5 MB", date: "15/02/2026" },
    { id: 5, url: "https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=600", name: "hu-tieu-sa-dec.jpg", size: "1.2 MB", date: "10/02/2026" },
    { id: 6, url: "https://images.unsplash.com/photo-1560091807-fd148c31a728?auto=format&fit=crop&q=80&w=600", name: "nem-lai-vung.jpg", size: "2.0 MB", date: "05/02/2026" },
  ];

  const handleCopy = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Thư Viện Media</h1>
          <p className="text-sm text-stone-500">Quản lý hình ảnh, video dùng trên toàn bộ website</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto">
          <Upload size={18} /> Tải tệp lên
        </button>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-stone-200 rounded-2xl p-10 text-center bg-white hover:bg-stone-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center shadow-sm">
          <Upload size={28} />
        </div>
        <div>
          <h3 className="font-bold text-stone-800 text-lg">Kéo thả tệp vào đây</h3>
          <p className="text-stone-500 text-sm">hoặc click để chọn từ thiết bị (Tối đa 10MB)</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-stone-100">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm tệp..." 
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="flex-1 sm:flex-none border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-teal-500">
            <option>Tất cả định dạng</option>
            <option>Hình ảnh</option>
            <option>Video</option>
            <option>Tài liệu</option>
          </select>
          <select className="flex-1 sm:flex-none border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-teal-500">
            <option>Mới nhất</option>
            <option>Cũ nhất</option>
            <option>Dung lượng lớn nhất</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {mediaFiles.map((file, i) => (
          <motion.div 
            key={file.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all"
          >
            <div className="aspect-square relative overflow-hidden bg-stone-100">
              <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button className="w-10 h-10 bg-white text-stone-700 hover:text-teal-600 rounded-full flex items-center justify-center shadow-lg transition-colors" title="Xem trước">
                  <Eye size={18} />
                </button>
                <button 
                  onClick={() => handleCopy(file.url, file.id)}
                  className="w-10 h-10 bg-white text-stone-700 hover:text-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors" title="Sao chép URL"
                >
                  {copiedId === file.id ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                </button>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-8 h-8 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center shadow-sm transition-colors" title="Xóa">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-stone-800 truncate" title={file.name}>{file.name}</p>
              <div className="flex justify-between items-center mt-1 text-xs text-stone-500">
                <span>{file.size}</span>
                <span>{file.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <button className="px-6 py-2.5 bg-white border border-stone-200 text-stone-600 font-medium rounded-xl hover:bg-stone-50 transition-colors shadow-sm">
          Tải thêm
        </button>
      </div>
    </div>
  );
}
