import { motion } from "motion/react";
import { Utensils, MapPin } from "lucide-react";

export function Cuisine() {
  const dishes = [
    { title: "Hủ Tiếu Sa Đéc", image: "https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=800", description: "Sợi hủ tiếu dai ngon đặc trưng, nước lèo ngọt thanh từ xương, ăn kèm với tôm, thịt băm, gan heo và các loại rau sống." },
    { title: "Nem Lai Vung", image: "https://images.unsplash.com/photo-1560091807-fd148c31a728?auto=format&fit=crop&q=80&w=800", description: "Đặc sản nổi tiếng với hương vị chua ngọt vừa vặn, màu đỏ hồng hấp dẫn, gói trong lá chuối xanh. Thích hợp làm quà biếu." },
    { title: "Bánh Phồng Tôm Sa Giang", image: "https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=800", description: "Bánh phồng tôm nổi tiếng khắp nơi với vị giòn rụm, thơm lừng vị tôm tự nhiên, một món ăn nhẹ truyền thống." },
  ];

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-orange-600 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1560091807-fd148c31a728?auto=format&fit=crop&q=80&w=1920" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Ẩm Thực Đặc Sắc</h1>
          <p className="text-orange-100 max-w-2xl mx-auto px-4">Hương vị dân dã, đậm đà miền Tây Nam Bộ luôn làm say lòng du khách.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish, i) => (
            <motion.div 
              key={dish.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={dish.image} alt={dish.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                  <h3 className="text-2xl font-bold text-white mb-1">{dish.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-stone-600 mb-6 line-clamp-3">{dish.description}</p>
                <div className="flex items-center gap-2">
                  <Utensils size={18} className="text-orange-500" />
                  <span className="text-sm font-semibold text-stone-700">Đặc sản địa phương</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-orange-50 rounded-3xl p-8 md:p-12 text-center">
          <MapPin size={48} className="text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Gợi ý địa điểm ăn uống</h2>
          <p className="text-stone-600 max-w-2xl mx-auto mb-8">Dọc theo các tuyến phố chính và bờ sông Sa Đéc, bạn sẽ dễ dàng tìm thấy những quán ăn ngon, từ các món đường phố đến nhà hàng sang trọng mang đậm hương vị địa phương.</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg">
            Xem bản đồ ẩm thực
          </button>
        </div>
      </div>
    </div>
  );
}
