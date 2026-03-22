import { motion } from "motion/react";
import { FileText, CheckCircle, Clock, Info, Shield, Search } from "lucide-react";
import { useState } from "react";

export function Services() {
  const [activeTab, setActiveTab] = useState("dichvu");

  const servicesList = [
    { title: "Cấp giấy phép kinh doanh du lịch", type: "Doanh nghiệp", time: "5 ngày làm việc" },
    { title: "Đăng ký lưu trú (Khách sạn, Homestay)", type: "Cơ sở lưu trú", time: "3 ngày làm việc" },
    { title: "Cấp phép tổ chức sự kiện văn hóa", type: "Tổ chức", time: "7 ngày làm việc" },
    { title: "Đăng ký hướng dẫn viên du lịch", type: "Cá nhân", time: "10 ngày làm việc" },
    { title: "Khai báo tạm trú cho người nước ngoài", type: "Cơ sở lưu trú", time: "1 ngày làm việc" },
  ];

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-blue-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Dịch Vụ Hành Chính</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4">Cổng thông tin tiếp nhận và giải quyết các thủ tục hành chính trực tuyến trong lĩnh vực du lịch và văn hóa.</p>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-5xl">
        {/* Tabs */}
        <div className="flex bg-white rounded-2xl shadow-sm border border-stone-100 p-2 mb-8 w-fit mx-auto">
          <button 
            onClick={() => setActiveTab("dichvu")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "dichvu" 
                ? "bg-blue-50 text-blue-700 shadow-sm" 
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Danh sách dịch vụ
          </button>
          <button 
            onClick={() => setActiveTab("tracuu")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "tracuu" 
                ? "bg-blue-50 text-blue-700 shadow-sm" 
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Tra cứu hồ sơ
          </button>
        </div>

        {activeTab === "dichvu" ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-800">Thủ tục hiện có</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm thủ tục..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-blue-500 bg-white"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              </div>
            </div>

            {servicesList.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:border-blue-200 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800 mb-2">{service.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                        <Shield size={14} /> {service.type}
                      </span>
                      <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        <Clock size={14} /> Thời gian giải quyết: {service.time}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors whitespace-nowrap self-start md:self-auto">
                  Nộp hồ sơ
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8 md:p-12 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">Tra cứu trạng thái hồ sơ</h2>
              <p className="text-stone-500 mb-8">Nhập mã hồ sơ đã được cấp để kiểm tra tiến độ xử lý.</p>
              
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Nhập mã hồ sơ (VD: HS-12345)" 
                  className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:outline-none focus:border-blue-500 text-lg text-center font-medium tracking-wider"
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-md">
                  Tra cứu ngay
                </button>
              </div>

              <div className="mt-12 text-left bg-stone-50 p-6 rounded-2xl">
                <h3 className="font-semibold text-stone-700 flex items-center gap-2 mb-4">
                  <Info size={18} className="text-blue-500" /> Hướng dẫn
                </h3>
                <ul className="space-y-3 text-sm text-stone-600">
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /> Mã hồ sơ được cấp qua email/SMS sau khi nộp thành công.</li>
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /> Hệ thống cập nhật trạng thái theo thời gian thực.</li>
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /> Vui lòng mang theo CMND/CCCD/Hộ chiếu khi đến nhận kết quả trực tiếp.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
