import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Camera, Info } from "lucide-react";

export function Destinations() {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const filters = ["Tất cả", "Văn hóa", "Du lịch", "Tâm linh"];

  const destinations = [
    { title: "Làng Hoa Sa Đéc", category: "Du lịch", image: "https://images.unsplash.com/photo-1708448341128-60d0b6cdbf12?auto=format&fit=crop&q=80&w=800", description: "Hơn 100 năm tuổi, cung cấp hoa kiểng lớn nhất miền Tây. Đặc biệt nhộn nhịp vào dịp cận Tết." },
    { title: "Nhà Cổ Huỳnh Thủy Lê", category: "Văn hóa", image: "https://images.unsplash.com/photo-1724935451945-1f1967520d32?auto=format&fit=crop&q=80&w=800", description: "Di tích lịch sử văn hóa cấp quốc gia, nổi tiếng qua cuốn tiểu thuyết 'Người Tình' (L'Amant)." },
    { title: "Chùa Kiến An Cung", category: "Tâm linh", image: "https://images.unsplash.com/photo-1707807562742-bf69e7feaf4e?auto=format&fit=crop&q=80&w=800", description: "Ngôi chùa cổ với nghệ thuật kiến trúc tinh xảo của người Hoa, được công nhận là Di tích Lịch sử Văn hóa cấp Quốc gia." },
    { title: "Phố đi bộ Sa Đéc", category: "Du lịch", image: "https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=800", description: "Khu vực sầm uất ven sông, nơi lý tưởng để đi dạo, ngắm cảnh và thưởng thức các món ăn vặt." },
  ];

  const filteredDestinations = activeFilter === "Tất cả" ? destinations : destinations.filter(d => d.category === activeFilter);

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-green-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Địa Danh Nổi Bật</h1>
        <p className="text-green-100 max-w-2xl mx-auto px-4">Khám phá những điểm đến không thể bỏ qua khi đến với Sa Đéc, từ làng hoa rực rỡ đến những di tích lịch sử cổ kính.</p>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeFilter === filter 
                  ? "bg-orange-500 text-white shadow-md" 
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest, i) => (
            <motion.div 
              key={dest.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-stone-100"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={dest.image} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {dest.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-green-600 transition-colors">{dest.title}</h3>
                <p className="text-stone-600 mb-4">{dest.description}</p>
                <div className="flex items-center gap-4 text-sm text-stone-500">
                  <span className="flex items-center gap-1"><MapPin size={16} /> Sa Đéc</span>
                  <button className="ml-auto text-green-600 font-semibold hover:text-orange-500 flex items-center gap-1">
                    <Info size={16} /> Chi tiết
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
