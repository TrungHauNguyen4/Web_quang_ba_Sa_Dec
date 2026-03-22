import { Link } from "react-router";
import { Map, Coffee, Newspaper, Camera, MapPin, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  const quickLinks = [
    { name: "Địa danh", icon: MapPin, path: "/dia-danh", color: "bg-blue-100 text-blue-600" },
    { name: "Ẩm thực", icon: Coffee, path: "/am-thuc", color: "bg-orange-100 text-orange-600" },
    { name: "Bản đồ", icon: Map, path: "/ban-do", color: "bg-green-100 text-green-600" },
    { name: "Tin tức", icon: Newspaper, path: "/tin-tuc", color: "bg-purple-100 text-purple-600" },
  ];

  const popularDestinations = [
    { title: "Làng Hoa Sa Đéc", image: "https://images.unsplash.com/photo-1708448341128-60d0b6cdbf12?auto=format&fit=crop&q=80&w=600", description: "Hơn 100 năm tuổi, cung cấp hoa kiểng lớn nhất miền Tây." },
    { title: "Nhà Cổ Huỳnh Thủy Lê", image: "https://images.unsplash.com/photo-1724935451945-1f1967520d32?auto=format&fit=crop&q=80&w=600", description: "Di tích lịch sử văn hóa cấp quốc gia với kiến trúc độc đáo." },
    { title: "Chùa Kiến An Cung", image: "https://images.unsplash.com/photo-1707807562742-bf69e7feaf4e?auto=format&fit=crop&q=80&w=600", description: "Ngôi chùa cổ với nghệ thuật kiến trúc tinh xảo của người Hoa." },
  ];

  return (
    <div className="w-full bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=1920" 
            alt="Sa Dec River View" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
          >
            Khám phá Sa Đéc
            <span className="block text-3xl md:text-5xl text-orange-400 mt-2">Thành phố hoa của Đồng Tháp</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-green-50 mb-10 max-w-2xl mx-auto drop-shadow"
          >
            Hòa mình vào vẻ đẹp của ngàn hoa, thưởng thức văn hóa ẩm thực độc đáo và nét cổ kính của vùng đất phương Nam.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/dia-danh" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2"
            >
              Khám phá ngay <ArrowRight size={20} />
            </Link>
            <Link 
              to="/ban-do" 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/50 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2"
            >
              Lên lịch trình
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

      {/* Popular Destinations */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-stone-800 mb-2">Điểm Đến Nổi Bật</h2>
              <div className="w-20 h-1 bg-green-500 rounded-full"></div>
            </div>
            <Link to="/dia-danh" className="hidden sm:flex text-green-600 font-semibold items-center gap-1 hover:text-orange-500 transition-colors">
              Xem tất cả <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularDestinations.map((dest, i) => (
              <motion.div 
                key={dest.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={dest.image} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-700 flex items-center gap-1 shadow-sm">
                    <Camera size={14} /> Điểm check-in
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-green-600 transition-colors">{dest.title}</h3>
                  <p className="text-stone-600 line-clamp-2">{dest.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/dia-danh" className="inline-flex text-green-600 font-semibold items-center gap-1 hover:text-orange-500 transition-colors">
              Xem tất cả <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Cuisine Highlight */}
      <section className="py-20 bg-green-900 text-white overflow-hidden relative">
        <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-green-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-orange-600 rounded-full blur-3xl opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-bold">
                Tinh Hoa <span className="text-orange-400">Ẩm Thực</span>
              </h2>
              <div className="w-20 h-1 bg-orange-500 rounded-full"></div>
              <p className="text-green-100 text-lg">
                Sa Đéc không chỉ nổi tiếng với muôn hoa đua sắc mà còn níu chân du khách bởi những món ăn đậm chất miền Tây Nam Bộ, nổi bật nhất là Hủ Tiếu Sa Đéc vang danh.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Hủ tiếu Sa Đéc với sợi hủ tiếu dai ngon đặc trưng",
                  "Bánh phồng tôm Sa Giang giòn rụm",
                  "Nem Lai Vung chua ngọt vừa vặn"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-green-50">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shrink-0 text-white">
                      ✓
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Link to="/am-thuc" className="inline-block bg-white text-green-900 px-8 py-3 rounded-full font-bold hover:bg-orange-100 transition-colors shadow-lg">
                  Khám phá món ngon
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-3xl overflow-hidden aspect-4/3 shadow-2xl ring-4 ring-green-800">
                <img src="https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=800" alt="Hủ tiếu" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <Coffee size={24} />
                  </div>
                  <div>
                    <div className="text-stone-800 font-bold">Đặc sản vùng miền</div>
                    <div className="text-sm text-stone-500">Được đánh giá cao</div>
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
