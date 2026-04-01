import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Building2, Landmark, Info } from "lucide-react";

export function Destinations() {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const filters = ["Tất cả", "Hành chính", "Cộng đồng", "Văn hóa"];

  const locations = [
    {
      title: "Trụ sở UBND phường",
      category: "Hành chính",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      description: "Điểm tiếp nhận và tra kết quả hồ sơ hành chính một cửa cho người dân.",
      icon: Building2,
    },
    {
      title: "Nhà văn hóa khu phố 1",
      category: "Cộng đồng",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
      description: "Không gian tổ chức sinh hoạt cộng đồng, tuyên truyền và tiếp nhận ý kiến nhân dân.",
      icon: Landmark,
    },
    {
      title: "Điểm tiếp nhận phản ánh",
      category: "Hành chính",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
      description: "Bộ phận hướng dẫn phản ánh kiến nghị và hỗ trợ thủ tục cho công dân.",
      icon: MapPin,
    },
    {
      title: "Khu di tích địa phương",
      category: "Văn hóa",
      image: "https://images.unsplash.com/photo-1462899006636-339e08d1844e?auto=format&fit=crop&q=80&w=800",
      description: "Công trình văn hóa tiêu biểu phục vụ giáo dục lịch sử và tổ chức sự kiện địa phương.",
      icon: Landmark,
    },
  ];

  const filtered = activeFilter === "Tất cả" ? locations : locations.filter((d) => d.category === activeFilter);

  return (
    <div className="w-full bg-slate-100 min-h-screen pb-20">
      <div className="bg-slate-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Bản đồ địa điểm công</h1>
        <p className="text-slate-200 max-w-2xl mx-auto px-4">
          Tra cứu các điểm hành chính, cơ sở cộng đồng và công trình văn hóa trên địa bàn.
        </p>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-blue-700 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dest, i) => (
            <motion.div
              key={dest.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-slate-200"
            >
              <div className="relative h-60 overflow-hidden">
                <img src={dest.image} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {dest.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{dest.title}</h3>
                <p className="text-slate-600 mb-4">{dest.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={16} /> Sa Đéc</span>
                  <button className="ml-auto text-blue-700 font-semibold hover:text-blue-900 flex items-center gap-1">
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




