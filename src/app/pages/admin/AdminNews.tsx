import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Eye, X, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AdminNews() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const news = [
    { id: 1, title: "Thông báo lịch tiếp công dân quý II/2026", category: "Thông báo", date: "15/12/2025", status: "published", author: "Admin", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=100" },
    { id: 2, title: "Kế hoạch cải cách thủ tục hành chính năm 2026", category: "Chỉ đạo điều hành", date: "10/12/2025", status: "published", author: "Editor", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=100" },
    { id: 3, title: "Thông báo điều chỉnh quy trình tiếp nhận hồ sơ online", category: "Thông báo", date: "01/12/2025", status: "draft", author: "Admin", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý thông tin điều hành</h1>
          <p className="text-sm text-slate-500">Soạn thảo, duyệt và công bố thông báo hành chính</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} /> Tạo bản tin mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm tiêu đề, nội dung..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 bg-white focus:outline-none focus:border-blue-500">
              <option>Tất cả chuyên mục</option>
              <option>Chỉ đạo điều hành</option>
              <option>Thông báo</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold w-1/2">Nội dung</th>
                <th className="p-4 font-semibold">Loại</th>
                <th className="p-4 font-semibold">Ngày cập nhật</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 line-clamp-2">{item.title}</div>
                        <div className="text-xs text-slate-500 mt-1">Người tạo: {item.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{item.category}</span>
                  </td>
                  <td className="p-4 text-slate-600">{item.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center w-fit gap-1.5 ${
                      item.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                      {item.status === "published" ? "Đã công bố" : "Bản nháp"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Eye size={16} /></button>
                      <button onClick={() => setIsModalOpen(true)} className="p-1.5 text-slate-400 hover:text-amber-600 rounded-md hover:bg-amber-50 transition-colors"><Edit2 size={16} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Newspaper size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Soạn thảo thông báo</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500" placeholder="Tiêu đề" />
                <textarea rows={8} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500" placeholder="Nội dung thông báo..." />
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors">Hủy</button>
                <button className="px-6 py-2.5 rounded-lg font-medium bg-slate-800 text-white hover:bg-slate-900 transition-colors">Lưu nháp</button>
                <button className="px-6 py-2.5 rounded-lg font-medium bg-blue-700 text-white hover:bg-blue-800 transition-colors">Công bố</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}




