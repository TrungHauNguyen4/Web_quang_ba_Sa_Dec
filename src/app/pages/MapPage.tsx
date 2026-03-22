import { MapPin, Utensils, Landmark, Building2, Search } from "lucide-react";
import { useState } from "react";

export function MapPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tất cả", icon: MapPin },
    { id: "attractions", name: "Du lịch", icon: Landmark },
    { id: "food", name: "Ẩm thực", icon: Utensils },
    { id: "public", name: "Hành chính", icon: Building2 },
  ];

  return (
    <div className="w-full bg-stone-50 min-h-[calc(100vh-80px)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-white shadow-xl z-10 flex flex-col h-[600px] md:h-auto border-r border-stone-200 shrink-0">
        <div className="p-6 border-b border-stone-100">
          <h1 className="text-2xl font-bold text-green-800 mb-6">Bản Đồ Sa Đéc</h1>
          
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Tìm kiếm địa điểm..." 
              className="w-full pl-10 pr-4 py-3 rounded-full border border-stone-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-stone-50"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Danh mục</h2>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeCategory === cat.id 
                    ? "bg-green-50 text-green-700 font-semibold" 
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                <div className={`p-2 rounded-lg ${activeCategory === cat.id ? "bg-green-100 text-green-600" : "bg-stone-100 text-stone-500"}`}>
                  <cat.icon size={18} />
                </div>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Kết quả gần đây</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4 p-4 rounded-xl border border-stone-100 hover:border-green-200 hover:bg-green-50/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-lg bg-stone-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1708448341128-60d0b6cdbf12?auto=format&fit=crop&q=80&w=200" alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 group-hover:text-green-700 transition-colors">Làng Hoa Sa Đéc</h3>
                  <p className="text-sm text-stone-500 mt-1 line-clamp-1">Đường Hoa Sa Đéc, Phường Tân Quy Đông</p>
                  <div className="flex items-center gap-1 text-xs text-orange-500 font-medium mt-2">
                    <Landmark size={12} /> Điểm du lịch
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-stone-200 min-h-[400px]">
        {/* Placeholder for actual Google Maps / Mapbox implementation */}
        <div className="absolute inset-0 flex items-center justify-center flex-col text-stone-500 gap-4">
          <div className="w-24 h-24 rounded-full bg-stone-300/50 flex items-center justify-center animate-pulse">
            <MapPin size={48} className="text-stone-400" />
          </div>
          <p className="text-lg font-medium">Bản đồ tương tác sẽ được tải ở đây</p>
          <p className="text-sm max-w-sm text-center">Sử dụng Google Maps API hoặc Mapbox để hiển thị các điểm đánh dấu trên bản đồ.</p>
        </div>

        {/* Dummy Map Markers */}
        <div className="absolute top-[30%] left-[40%] bg-white p-2 rounded-full shadow-lg border-2 border-green-500 text-green-600 animate-bounce cursor-pointer hover:scale-110 transition-transform">
          <Landmark size={24} />
        </div>
        <div className="absolute top-[50%] left-[60%] bg-white p-2 rounded-full shadow-lg border-2 border-orange-500 text-orange-600 hover:scale-110 transition-transform cursor-pointer">
          <Utensils size={24} />
        </div>
        <div className="absolute top-[20%] left-[70%] bg-white p-2 rounded-full shadow-lg border-2 border-blue-500 text-blue-600 hover:scale-110 transition-transform cursor-pointer">
          <Building2 size={24} />
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-stone-600 hover:text-green-600 hover:bg-green-50 transition-colors border border-stone-200 font-bold text-xl">+</button>
          <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-stone-600 hover:text-green-600 hover:bg-green-50 transition-colors border border-stone-200 font-bold text-xl">-</button>
        </div>
      </div>
    </div>
  );
}
