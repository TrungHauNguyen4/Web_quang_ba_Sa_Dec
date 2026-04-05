import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Shield, User, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AdminUsers() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const users = [
    { id: 1, name: "Admin System", email: "admin@sadec.gov.vn", role: "Admin", lastActive: "Vừa xong", avatar: "A" },
    { id: 2, name: "Trần Văn Editor", email: "editor@sadec.gov.vn", role: "Editor", lastActive: "2 giờ trước", avatar: "T" },
    { id: 3, name: "Nguyễn Thị Content", email: "content@sadec.gov.vn", role: "Editor", lastActive: "1 ngày trước", avatar: "N" },
    { id: 4, name: "Lê Văn Viewer", email: "viewer@sadec.gov.vn", role: "Viewer", lastActive: "1 tuần trước", avatar: "L" },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin': return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center w-fit gap-1.5"><Shield size={12} /> Admin</span>;
      case 'Editor': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center w-fit gap-1.5"><Edit2 size={12} /> Editor</span>;
      case 'Viewer': return <span className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md text-xs font-bold flex items-center w-fit gap-1.5"><User size={12} /> Viewer</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Người Dùng & Phân Quyền</h1>
          <p className="text-sm text-stone-500">Quản lý tài khoản và quyền truy cập hệ thống</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} /> Thêm người dùng
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm tài khoản..." 
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all text-sm"
            />
          </div>
          <select className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-stone-500 w-full sm:w-auto">
            <option>Tất cả vai trò</option>
            <option>Admin</option>
            <option>Editor</option>
            <option>Viewer</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Tài khoản</th>
                <th className="p-4 font-semibold">Vai trò</th>
                <th className="p-4 font-semibold">Hoạt động gần nhất</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-600 shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-stone-800">{user.name}</div>
                        <div className="text-xs text-stone-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="p-4 text-stone-500">{user.lastActive}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-stone-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" disabled={user.role === 'Admin'}>
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

      {/* Add User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-stone-800">Thêm Người Dùng Mới</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Họ và tên *</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-500" placeholder="VD: Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Email *</label>
                  <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-500" placeholder="VD: email@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Mật khẩu *</label>
                  <input type="password" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-500" placeholder="Nhập mật khẩu tạm thời" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Vai trò *</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-500">
                    <option value="Viewer">Viewer (Chỉ xem)</option>
                    <option value="Editor">Editor (Quản lý nội dung)</option>
                    <option value="Admin">Admin (Toàn quyền)</option>
                  </select>
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
                  Tạo tài khoản
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
