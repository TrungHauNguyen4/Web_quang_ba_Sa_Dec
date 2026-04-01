import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export function Contact() {
  return (
    <div className="w-full bg-slate-100 min-h-screen pb-20">
      <div className="bg-slate-900 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1920" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Liên hệ và hỗ trợ</h1>
          <p className="text-slate-300 max-w-2xl mx-auto px-4">Tiếp nhận phản ánh, kiến nghị và hướng dẫn thủ tục hành chính cho người dân.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Thông tin cơ quan</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Địa chỉ</h3>
                    <p className="text-slate-600 mt-1">UBND Phường Sa Đéc,<br />Đường Trần Phú, khu vực trung tâm,<br />TP Sa Đéc</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-50 text-cyan-700 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Tổng đài</h3>
                    <p className="text-slate-600 mt-1">0277 3861 xxx<br />0277 3862 xxx</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Email</h3>
                    <p className="text-slate-600 mt-1">contact@sadec.gov.vn<br />motcua@sadec.gov.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Giờ làm việc</h3>
                    <p className="text-slate-600 mt-1">Sáng: 07:30 - 11:30<br />Chiều: 13:30 - 17:00<br />Từ thứ 2 đến thứ 6</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-2/3 space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Gửi phản ánh kiến nghị</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Họ và tên *</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50" placeholder="Nhập họ tên" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email *</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50" placeholder="Nhập email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50" placeholder="Nhập số điện thoại" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nội dung *</label>
                  <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 resize-none" placeholder="Nhập nội dung phản ánh/kiến nghị..."></textarea>
                </div>
                <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
                  <Send size={18} /> Gửi phản ánh
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden h-80 relative">
              <div className="absolute inset-0 bg-slate-200 flex flex-col items-center justify-center text-slate-500">
                <MapPin size={48} className="text-slate-400 mb-4 animate-bounce" />
                <p className="font-medium">Google Maps Placeholder</p>
                <p className="text-sm">Vị trí: UBND TP Sa Đéc</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}



