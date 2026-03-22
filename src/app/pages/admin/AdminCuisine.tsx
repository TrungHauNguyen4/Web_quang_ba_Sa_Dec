import { useState } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Eye, MapPin, X, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AdminCuisine() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const foods = [
    { id: 1, title: "Hủ Tiếu Sa Đéc", category: "Món chính", status: "published", image: "https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=100" },
    { id: 2, title: "Nem Lai Vung", category: "Đặc sản", status: "published", image: "https://images.unsplash.com/photo-1560091807-fd148c31a728?auto=format&fit=crop&q=80&w=100" },
    { id: 3, title: "Bánh Phồng Tôm Sa Giang", category: "Ăn vặt", status: "draft", image: "https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=100" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Quản lý Ẩm Thực</h1>
          <p className="text-sm text-stone-500">Quản lý danh sách các món ăn, đặc sản địa phương</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} /> Thêm món ăn
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm món ăn..." 
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
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
                <th className="p-4 font-semibold">Hình ảnh & Tên món</th>
                <th className="p-4 font-semibold">Phân loại</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {foods.map((food) => (
                <tr key={food.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                        <img src={food.image} alt={food.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-stone-800">{food.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-medium">
                      {food.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center w-fit gap-1.5 ${
                      food.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${food.status === 'published' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                      {food.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
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
                      <button 
                        onClick={() => setIsDeleteOpen(true)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
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
      </div>

      {/* Add/Edit Modal */}
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
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                    <Utensils size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-stone-800">Thêm Món Ăn Mới</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Tên món ăn *</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-orange-500 bg-stone-50 focus:bg-white transition-colors" placeholder="Nhập tên món" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Phân loại *</label>
                    <select className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-orange-500 bg-stone-50 focus:bg-white transition-colors">
                      <option>Món chính</option>
                      <option>Đặc sản</option>
                      <option>Ăn vặt</option>
                      <option>Thức uống</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Mô tả chi tiết</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:border-orange-500 bg-stone-50 focus:bg-white transition-colors resize-none" placeholder="Nhập mô tả về món ăn..."></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Hình ảnh</label>
                  <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-orange-600">
                      <Plus size={24} />
                    </div>
                    <p className="text-sm font-medium text-stone-700 mb-1">Tải ảnh lên</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Gợi ý địa điểm (Nhà hàng/Quán ăn)</label>
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-orange-500 bg-stone-50 focus:bg-white transition-colors" placeholder="Tên quán ăn, địa chỉ..." />
                    <button className="px-4 py-2.5 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 font-medium">Thêm</button>
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
                <button className="px-6 py-2.5 rounded-lg font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors">
                  Lưu món ăn
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <p className="text-stone-500 mb-8">Bạn có chắc chắn muốn xóa món ăn này?</p>
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
