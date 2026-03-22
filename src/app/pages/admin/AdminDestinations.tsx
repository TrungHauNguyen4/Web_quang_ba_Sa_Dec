import { useState } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Eye, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AdminDestinations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const destinations = [
    { id: 1, title: "Làng Hoa Sa Đéc", category: "Du lịch", status: "published", views: 1240, image: "https://images.unsplash.com/photo-1708448341128-60d0b6cdbf12?auto=format&fit=crop&q=80&w=100" },
    { id: 2, title: "Nhà Cổ Huỳnh Thủy Lê", category: "Văn hóa", status: "published", views: 890, image: "https://images.unsplash.com/photo-1724935451945-1f1967520d32?auto=format&fit=crop&q=80&w=100" },
    { id: 3, title: "Chùa Kiến An Cung", category: "Tâm linh", status: "draft", views: 450, image: "https://images.unsplash.com/photo-1707807562742-bf69e7feaf4e?auto=format&fit=crop&q=80&w=100" },
    { id: 4, title: "Phố đi bộ Sa Đéc", category: "Du lịch", status: "published", views: 670, image: "https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=100" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Quản lý Địa Danh</h1>
          <p className="text-sm text-stone-500">Thêm, sửa, xóa và quản lý các điểm đến du lịch</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} /> Thêm địa danh mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm địa danh..." 
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium">
            <Filter size={16} /> Lọc kết quả
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Hình ảnh & Tên</th>
                <th className="p-4 font-semibold">Danh mục</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold">Lượt xem</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {destinations.map((dest) => (
                <tr key={dest.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                        <img src={dest.image} alt={dest.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-stone-800">{dest.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-medium">
                      {dest.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center w-fit gap-1.5 ${
                      dest.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dest.status === 'published' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                      {dest.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="p-4 text-stone-600">{dest.views}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-stone-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title="Xem trước">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="p-1.5 text-stone-400 hover:text-orange-600 rounded-md hover:bg-orange-50 transition-colors" title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setIsDeleteOpen(true)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-stone-100 flex items-center justify-between text-sm text-stone-500">
          <div>Hiển thị 1-4 của 4 kết quả</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-stone-200 rounded-md hover:bg-stone-50 disabled:opacity-50">Trước</button>
            <button className="px-3 py-1 border border-stone-200 rounded-md hover:bg-stone-50 bg-stone-50">1</button>
            <button className="px-3 py-1 border border-stone-200 rounded-md hover:bg-stone-50 disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-stone-800">Thêm Địa Danh Mới</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Tên địa danh *</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-green-500 bg-stone-50 focus:bg-white transition-colors" placeholder="Nhập tên địa danh" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Danh mục *</label>
                    <select className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-green-500 bg-stone-50 focus:bg-white transition-colors">
                      <option>Du lịch</option>
                      <option>Văn hóa</option>
                      <option>Tâm linh</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Mô tả ngắn (Rich Text Placeholder)</label>
                  <div className="border border-stone-200 rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-stone-50 border-b border-stone-200 p-2 flex gap-2">
                      <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 font-bold">B</button>
                      <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 italic">I</button>
                      <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 underline">U</button>
                      <div className="w-px bg-stone-300 mx-1"></div>
                      <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 text-xs">Link</button>
                    </div>
                    <textarea rows={4} className="w-full p-4 focus:outline-none resize-none" placeholder="Nhập mô tả chi tiết..."></textarea>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Hình ảnh</label>
                  <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-green-600">
                      <Plus size={24} />
                    </div>
                    <p className="text-sm font-medium text-stone-700 mb-1">Click để tải ảnh lên hoặc kéo thả vào đây</p>
                    <p className="text-xs text-stone-500">PNG, JPG, WEBP (Tối đa 5MB)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Vị trí (Bản đồ)</label>
                  <div className="relative h-48 bg-stone-200 rounded-xl overflow-hidden flex items-center justify-center border border-stone-200 group cursor-pointer">
                    <MapPin size={32} className="text-stone-400 group-hover:text-green-600 transition-colors group-hover:-translate-y-1 duration-300" />
                    <span className="absolute bottom-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-medium text-stone-600">Click để chọn vị trí</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50 rounded-b-2xl">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg font-medium text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button className="px-6 py-2.5 rounded-lg font-medium bg-stone-800 text-white hover:bg-stone-900 transition-colors">
                  Lưu nháp
                </button>
                <button className="px-6 py-2.5 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">
                  Xuất bản
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsDeleteOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Xác nhận xóa?</h3>
              <p className="text-stone-500 mb-8">Bạn có chắc chắn muốn xóa địa danh này? Hành động này không thể hoàn tác.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteOpen(false)}
                  className="flex-1 py-2.5 rounded-lg font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => setIsDeleteOpen(false)}
                  className="flex-1 py-2.5 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
