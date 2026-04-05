import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export function Contact() {
  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-stone-800 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=1920" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Liên Hệ</h1>
          <p className="text-stone-300 max-w-2xl mx-auto px-4">Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn để có một chuyến đi tuyệt vời nhất.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Info */}
          <div className="lg:w-1/3 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100"
            >
              <h2 className="text-2xl font-bold text-stone-800 mb-6">Thông tin liên hệ</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800">Địa chỉ</h3>
                    <p className="text-stone-600 mt-1">UBND Thành phố Sa Đéc,<br/>Đường Trần Phú, Phường 1,<br/>TP. Sa Đéc, Đồng Tháp</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800">Điện thoại</h3>
                    <p className="text-stone-600 mt-1">0277 3861 xxx<br/>0277 3862 xxx</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800">Email</h3>
                    <p className="text-stone-600 mt-1">contact@sadec.gov.vn<br/>dulich@sadec.gov.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800">Giờ làm việc</h3>
                    <p className="text-stone-600 mt-1">Sáng: 07:00 - 11:30<br/>Chiều: 13:30 - 17:00<br/>Từ Thứ 2 đến Thứ 6</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:w-2/3 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100"
            >
              <h2 className="text-2xl font-bold text-stone-800 mb-6">Gửi tin nhắn cho chúng tôi</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Họ và tên *</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-stone-50" placeholder="Nhập họ tên của bạn" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Email *</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-stone-50" placeholder="Nhập địa chỉ email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Chủ đề</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-stone-50" placeholder="Chủ đề tin nhắn" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Nội dung *</label>
                  <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-stone-50 resize-none" placeholder="Nhập nội dung tin nhắn..."></textarea>
                </div>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
                  <Send size={18} /> Gửi tin nhắn
                </button>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-lg border border-stone-100 overflow-hidden h-80 relative"
            >
              {/* Map Placeholder */}
              <div className="absolute inset-0 bg-stone-200 flex flex-col items-center justify-center text-stone-500">
                <MapPin size={48} className="text-stone-400 mb-4 animate-bounce" />
                <p className="font-medium">Google Maps Embed Placeholder</p>
                <p className="text-sm">Vị trí: UBND TP Sa Đéc</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
