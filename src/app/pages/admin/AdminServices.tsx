import { useState } from "react";
import { Search, Filter, Eye, CheckCircle, Clock, XCircle, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AdminServices() {
  const [activeTab, setActiveTab] = useState("applications");
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const applications = [
    { id: "HS-12345", service: "Cấp giấy phép kinh doanh du lịch", applicant: "Công ty TNHH Du lịch ABC", date: "20/02/2026", status: "pending" },
    { id: "HS-12346", service: "Đăng ký lưu trú (Homestay)", applicant: "Nguyễn Văn D", date: "19/02/2026", status: "processing" },
    { id: "HS-12347", service: "Cấp phép tổ chức sự kiện văn hóa", applicant: "Ban Tổ Chức Lễ Hội", date: "18/02/2026", status: "completed" },
    { id: "HS-12348", service: "Đăng ký hướng dẫn viên du lịch", applicant: "Trần Thị E", date: "15/02/2026", status: "rejected" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium w-fit"><Clock size={14} /> Chờ tiếp nhận</span>;
      case 'processing': return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium w-fit"><FileText size={14} /> Đang xử lý</span>;
      case 'completed': return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium w-fit"><CheckCircle size={14} /> Hoàn thành</span>;
      case 'rejected': return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium w-fit"><XCircle size={14} /> Từ chối</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Quản lý Dịch Vụ Hành Chính</h1>
        <p className="text-sm text-stone-500">Tiếp nhận và xử lý hồ sơ dịch vụ công trực tuyến</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button 
          onClick={() => setActiveTab("applications")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "applications" ? "border-blue-600 text-blue-600" : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          Hồ sơ nộp vào
        </button>
        <button 
          onClick={() => setActiveTab("services")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "services" ? "border-blue-600 text-blue-600" : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          Danh mục thủ tục
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm mã hồ sơ, tên người nộp..." 
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-blue-500">
              <option>Tất cả trạng thái</option>
              <option>Chờ tiếp nhận</option>
              <option>Đang xử lý</option>
              <option>Hoàn thành</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Mã hồ sơ</th>
                <th className="p-4 font-semibold">Tên thủ tục</th>
                <th className="p-4 font-semibold">Người/Tổ chức nộp</th>
                <th className="p-4 font-semibold">Ngày nộp</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="p-4 font-semibold text-blue-600">{app.id}</td>
                  <td className="p-4 font-medium text-stone-800">{app.service}</td>
                  <td className="p-4 text-stone-600">{app.applicant}</td>
                  <td className="p-4 text-stone-600">{app.date}</td>
                  <td className="p-4">{getStatusBadge(app.status)}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Xử lý
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setSelectedApp(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-stone-800">Chi tiết hồ sơ: {selectedApp.id}</h2>
                  <p className="text-sm text-stone-500 mt-1">{selectedApp.service}</p>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-8 flex-1">
                {/* Current Status */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-stone-500 mb-1">Trạng thái hiện tại</div>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-stone-500 mb-1">Ngày cập nhật cuối</div>
                    <div className="text-sm font-medium text-stone-800">{selectedApp.date}</div>
                  </div>
                </div>

                {/* Applicant Info */}
                <div>
                  <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Thông tin người nộp</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <div className="text-stone-500 mb-1">Tên Tổ chức/Cá nhân</div>
                      <div className="font-medium text-stone-800">{selectedApp.applicant}</div>
                    </div>
                    <div>
                      <div className="text-stone-500 mb-1">Số điện thoại</div>
                      <div className="font-medium text-stone-800">0909 123 456</div>
                    </div>
                    <div>
                      <div className="text-stone-500 mb-1">Email</div>
                      <div className="font-medium text-stone-800">contact@example.com</div>
                    </div>
                    <div>
                      <div className="text-stone-500 mb-1">Địa chỉ</div>
                      <div className="font-medium text-stone-800">Phường 1, TP Sa Đéc</div>
                    </div>
                  </div>
                </div>

                {/* Attached Files */}
                <div>
                  <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Tệp đính kèm</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-blue-500" />
                        <span className="text-sm font-medium text-stone-700">Don_dang_ky.pdf</span>
                      </div>
                      <button className="text-blue-600 text-sm font-medium hover:underline">Tải xuống</button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-blue-500" />
                        <span className="text-sm font-medium text-stone-700">CCCD_BanSao.pdf</span>
                      </div>
                      <button className="text-blue-600 text-sm font-medium hover:underline">Tải xuống</button>
                    </div>
                  </div>
                </div>

                {/* Update Status Action */}
                <div>
                  <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Cập nhật trạng thái</h3>
                  <div className="space-y-4">
                    <select className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-blue-500 bg-white">
                      <option value="pending">Chờ tiếp nhận</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="rejected">Từ chối (Cần bổ sung/Không hợp lệ)</option>
                    </select>
                    <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:border-blue-500 bg-white resize-none" placeholder="Ghi chú/Lý do (nếu có)..."></textarea>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50 rounded-b-2xl">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="px-6 py-2.5 rounded-lg font-medium text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  Đóng
                </button>
                <button className="px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Lưu thay đổi & Gửi thông báo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
