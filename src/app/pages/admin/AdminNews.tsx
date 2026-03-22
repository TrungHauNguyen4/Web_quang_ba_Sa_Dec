import { useState } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Eye, X, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AdminNews() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const news = [
    { id: 1, title: "Lễ hội Hoa Xuân Sa Đéc 2026: Rực rỡ ngàn hoa khoe sắc", category: "Sự kiện", date: "15/12/2025", status: "published", author: "Admin", image: "https://images.unsplash.com/photo-1708448341128-60d0b6cdbf12?auto=format&fit=crop&q=80&w=100" },
    { id: 2, title: "Phát triển du lịch sinh thái gắn liền với bảo tồn di sản", category: "Tin mới", date: "10/12/2025", status: "published", author: "Editor", image: "https://images.unsplash.com/photo-1707807562742-bf69e7feaf4e?auto=format&fit=crop&q=80&w=100" },
    { id: 3, title: "Thông báo điều chỉnh luồng giao thông dịp Tết", category: "Thông báo", date: "01/12/2025", status: "draft", author: "Admin", image: "https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=100" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Quản lý Tin Tức</h1>
          <p className="text-sm text-stone-500">Viết bài, đăng tin tức và sự kiện địa phương</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} /> Viết bài mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm bài viết..." 
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-purple-500">
              <option>Tất cả chuyên mục</option>
              <option>Tin mới</option>
              <option>Sự kiện</option>
              <option>Thông báo</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold w-1/2">Bài viết</th>
                <th className="p-4 font-semibold">Chuyên mục</th>
                <th className="p-4 font-semibold">Ngày đăng</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-stone-800 line-clamp-2">{item.title}</div>
                        <div className="text-xs text-stone-500 mt-1">Bởi: {item.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 text-stone-600">{item.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center w-fit gap-1.5 ${
                      item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'published' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                      {item.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-stone-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="p-1.5 text-stone-400 hover:text-orange-600 rounded-md hover:bg-orange-50 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                    <Newspaper size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-800">Viết Bài Mới</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 flex-1 flex flex-col lg:flex-row gap-8">
                {/* Main Content Area */}
                <div className="lg:w-2/3 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Tiêu đề bài viết *</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-purple-500 text-lg font-medium bg-stone-50 focus:bg-white transition-colors" placeholder="Nhập tiêu đề..." />
                  </div>
                  
                  <div className="space-y-2 flex-1 flex flex-col">
                    <label className="text-sm font-semibold text-stone-700">Nội dung (WYSIWYG Editor)</label>
                    <div className="border border-stone-200 rounded-lg overflow-hidden flex flex-col flex-1 min-h-[300px]">
                      <div className="bg-stone-50 border-b border-stone-200 p-2 flex flex-wrap gap-2">
                        <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 font-bold w-8">B</button>
                        <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 italic w-8">I</button>
                        <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 underline w-8">U</button>
                        <div className="w-px bg-stone-300 mx-1"></div>
                        <select className="bg-transparent text-sm text-stone-600 border-none outline-none">
                          <option>Paragraph</option>
                          <option>Heading 1</option>
                          <option>Heading 2</option>
                        </select>
                        <div className="w-px bg-stone-300 mx-1"></div>
                        <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 text-xs px-2">Link</button>
                        <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 text-xs px-2">Image</button>
                      </div>
                      <textarea className="w-full flex-1 p-4 focus:outline-none resize-none bg-white" placeholder="Nội dung bài viết..."></textarea>
                    </div>
                  </div>
                </div>

                {/* Sidebar Config Area */}
                <div className="lg:w-1/3 space-y-6">
                  <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-4">
                    <h3 className="font-semibold text-stone-800 border-b border-stone-200 pb-2">Xuất bản</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-600">Trạng thái:</span>
                        <span className="font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Bản nháp</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-600">Ngày đăng:</span>
                        <span className="font-medium">Ngay lập tức</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Chuyên mục</label>
                    <div className="border border-stone-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-stone-50">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-stone-700">Tin mới</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-stone-700">Sự kiện</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-stone-700">Thông báo</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Ảnh đại diện (Thumbnail)</label>
                    <div className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer aspect-video flex flex-col items-center justify-center">
                      <Plus size={24} className="text-stone-400 mb-2" />
                      <span className="text-sm text-stone-500">Chọn ảnh thumbnail</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50 rounded-b-2xl">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg font-medium text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  Hủy
                </button>
                <button className="px-6 py-2.5 rounded-lg font-medium bg-stone-800 text-white hover:bg-stone-900 transition-colors">
                  Lưu nháp
                </button>
                <button className="px-6 py-2.5 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                  Xuất bản
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
