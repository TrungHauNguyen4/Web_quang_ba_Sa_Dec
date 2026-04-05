import { Search, CheckCircle, XCircle, Trash2, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export function AdminComments() {
  const comments = [
    { id: 1, user: "Nguyễn Văn A", email: "nva@gmail.com", content: "Bài viết rất hữu ích. Tôi sẽ ghé thăm Làng Hoa vào dịp Tết này!", target: "Lễ hội Hoa Xuân Sa Đéc 2026", date: "22/02/2026 10:30", status: "pending" },
    { id: 2, user: "Trần Thị B", email: "ttb@yahoo.com", content: "Hủ tiếu Sa Đéc ở quán nào ngon nhất ạ? Mong admin gợi ý thêm.", target: "Hủ Tiếu Sa Đéc", date: "21/02/2026 15:45", status: "approved" },
    { id: 3, user: "Spam User", email: "spam@fake.com", content: "Click vào link này để nhận thưởng: http://spam-link.com", target: "Nhà Cổ Huỳnh Thủy Lê", date: "20/02/2026 09:12", status: "rejected" },
    { id: 4, user: "Lê Văn C", email: "lvc@gmail.com", content: "Mình đã đến đây, kiến trúc rất đẹp và cổ kính.", target: "Chùa Kiến An Cung", date: "19/02/2026 14:20", status: "approved" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Quản lý Bình Luận</h1>
        <p className="text-sm text-stone-500">Duyệt và quản lý phản hồi từ người dùng</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo nội dung, email..." 
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none">
              <option>Tất cả trạng thái</option>
              <option>Chờ duyệt</option>
              <option>Đã duyệt</option>
              <option>Bị từ chối</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {comments.map((comment, i) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 flex flex-col lg:flex-row gap-6 hover:bg-stone-50/50 transition-colors ${comment.status === 'pending' ? 'bg-yellow-50/30' : ''}`}
            >
              <div className="lg:w-1/4 shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center font-bold text-stone-600">
                    {comment.user.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-stone-800">{comment.user}</div>
                    <div className="text-xs text-stone-500">{comment.email}</div>
                  </div>
                </div>
                <div className="text-xs text-stone-400 ml-13">{comment.date}</div>
              </div>
              
              <div className="lg:w-2/4">
                <p className="text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-100 mb-3">{comment.content}</p>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>Bài viết:</span>
                  <a href="#" className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                    {comment.target} <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="lg:w-1/4 flex items-start lg:justify-end gap-2 shrink-0">
                {comment.status === 'pending' && (
                  <>
                    <button className="flex-1 lg:flex-none px-4 py-2 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                      <CheckCircle size={16} /> Duyệt
                    </button>
                    <button className="flex-1 lg:flex-none px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                      <XCircle size={16} /> Từ chối
                    </button>
                  </>
                )}
                {comment.status === 'approved' && (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1.5">
                    <CheckCircle size={16} /> Đã duyệt
                  </span>
                )}
                {comment.status === 'rejected' && (
                  <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center gap-1.5">
                    <XCircle size={16} /> Đã từ chối
                  </span>
                )}
                <button className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto lg:ml-2" title="Xóa">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="p-4 border-t border-stone-100 flex items-center justify-center">
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-stone-200 rounded-md hover:bg-stone-50 disabled:opacity-50 text-sm">Trước</button>
            <button className="px-3 py-1 border border-stone-200 rounded-md hover:bg-stone-50 bg-stone-50 text-sm">1</button>
            <button className="px-3 py-1 border border-stone-200 rounded-md hover:bg-stone-50 text-sm">2</button>
            <button className="px-3 py-1 border border-stone-200 rounded-md hover:bg-stone-50 disabled:opacity-50 text-sm">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
