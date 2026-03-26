import { Link } from "react-router";
import { FileText, ClipboardCheck, Newspaper, Bell, MapPin, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  const quickLinks = [
    { name: "Dịch vụ trực tuyến", icon: FileText, path: "/dich-vu", color: "bg-green-100 text-green-700" },
    { name: "Tra cứu hồ sơ", icon: ClipboardCheck, path: "/dich-vu", color: "bg-sky-100 text-sky-700" },
    { name: "Tin tức & thông báo", icon: Newspaper, path: "/tin-tuc", color: "bg-amber-100 text-amber-700" },
    { name: "Phản ánh kiến nghị", icon: Bell, path: "/lien-he", color: "bg-emerald-100 text-emerald-700" },
  ];

  const spotlightCards = [
    {
      title: "Thông báo lịch tiếp công dân",
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=600",
      description: "UBND phường tiếp nhận hồ sơ và phản ánh từ 07:30-11:30, 13:30-17:00 (T2-T6).",
    },
    {
      title: "Nộp hồ sơ trực tuyến",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600",
      description: "Ưu tiên sử dụng dịch vụ công trực tuyến để rút ngắn thời gian xử lý, nhận kết quả tại nhà.",
    },
    {
      title: "Cập nhật tiến độ hồ sơ",
      image: "https://images.unsplash.com/photo-1520607162513-0ff2155c7b5f?auto=format&fit=crop&q=80&w=600",
      description: "Tra cứu trạng thái xử lý, nhận thông báo SMS/email khi hồ sơ chuyển bước.",
    },
  ];

  return (
    <div className="w-full bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1920"
            alt="Cổng thông tin hành chính"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-black/45 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
          >
            Cổng thông tin phường/xã Sa Đéc
            <span className="block text-3xl md:text-5xl text-emerald-200 mt-2">Dịch vụ công • Tin tức • Phản ánh</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-green-50 mb-10 max-w-2xl mx-auto drop-shadow"
          >
            Nộp hồ sơ trực tuyến, tra cứu tiến độ, xem thông báo mới nhất và gửi phản ánh nhanh đến chính quyền địa phương.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/dich-vu" 
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-green-700/30 flex items-center justify-center gap-2"
            >
              Nộp hồ sơ trực tuyến <ArrowRight size={20} />
            </Link>
            <Link 
              to="/tin-tuc" 
              className="bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/50 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2"
            >
              Xem thông báo mới
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white relative -mt-10 rounded-t-[3rem] shadow-xl z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {quickLinks.map((link, i) => (
              <motion.div 
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={link.path} className="flex flex-col items-center gap-3 group">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${link.color} transition-transform group-hover:scale-110 shadow-sm`}>
                    <link.icon size={32} />
                  </div>
                  <span className="font-semibold text-stone-700 group-hover:text-green-600 transition-colors">{link.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-stone-800 mb-2">Thông báo & Dịch vụ nổi bật</h2>
              <div className="w-20 h-1 bg-emerald-600 rounded-full"></div>
            </div>
            <Link to="/tin-tuc" className="hidden sm:flex text-emerald-700 font-semibold items-center gap-1 hover:text-emerald-900 transition-colors">
              Xem tin tức <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {spotlightCards.map((card, i) => (
              <motion.div 
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-700 flex items-center gap-1 shadow-sm">
                    <Bell size={14} /> Cập nhật
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-emerald-700 transition-colors">{card.title}</h3>
                  <p className="text-stone-600 line-clamp-2">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/tin-tuc" className="inline-flex text-emerald-700 font-semibold items-center gap-1 hover:text-emerald-900 transition-colors">
              Xem tin tức <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* One-stop service */}
      <section className="py-20 bg-emerald-900 text-white overflow-hidden relative">
        <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-green-600 rounded-full blur-3xl opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-bold">
                Một cửa <span className="text-emerald-200">trực tuyến</span>
              </h2>
              <div className="w-20 h-1 bg-emerald-200 rounded-full"></div>
              <p className="text-emerald-50 text-lg">
                Thực hiện hồ sơ, theo dõi tiến độ và nhận thông báo ngay trên cổng thông tin. Ưu tiên dịch vụ online để rút ngắn thời gian, giảm chờ đợi.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Nộp hồ sơ 24/7, xác thực qua email/SMS",
                  "Theo dõi trạng thái từng bước xử lý",
                  "Nhận kết quả tại nhà hoặc tại bộ phận một cửa"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-emerald-50">
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center shrink-0 text-white">
                      ✓
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Link to="/dich-vu" className="inline-block bg-white text-emerald-900 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                  Bắt đầu nộp hồ sơ
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-3xl overflow-hidden aspect-4/3 shadow-2xl ring-4 ring-emerald-800">
                <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800" alt="Nộp hồ sơ trực tuyến" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <div className="text-stone-800 font-bold">Một cửa điện tử</div>
                    <div className="text-sm text-stone-500">Xử lý minh bạch</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
