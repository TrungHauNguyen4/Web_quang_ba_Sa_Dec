import { MapPin, FileText, Landmark, Building2, Search } from "lucide-react";
import { useState } from "react";

export function MapPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tất cả", icon: MapPin },
    { id: "public", name: "Trụ sở hành chính", icon: Building2 },
    { id: "service", name: "Điểm một cửa", icon: FileText },
    { id: "culture", name: "Công trình công", icon: Landmark },
  ];

  return (
    <div className="w-full bg-slate-100 min-h-[calc(100vh-80px)] flex flex-col md:flex-row">
      <div className="w-full md:w-80 lg:w-96 bg-white shadow-xl z-10 flex flex-col h-[600px] md:h-auto border-r border-slate-200 shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Bản đồ hành chính</h1>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Tìm địa điểm..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all bg-slate-50"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Danh mục</h2>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeCategory === cat.id
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className={`p-2 rounded-lg ${activeCategory === cat.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                  <cat.icon size={18} />
                </div>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Điểm nổi bật</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200" alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">Bộ phận một cửa</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">Đường Trần Phú, Phường 1, TP Sa Đéc</p>
                  <div className="flex items-center gap-1 text-xs text-blue-700 font-medium mt-2">
                    <FileText size={12} /> Điểm tiếp nhận hồ sơ
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-200 min-h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-500 gap-4">
          <div className="w-24 h-24 rounded-full bg-slate-300/60 flex items-center justify-center animate-pulse">
            <MapPin size={48} className="text-slate-500" />
          </div>
          <p className="text-lg font-medium">Bản đồ tương tác</p>
          <p className="text-sm max-w-sm text-center">Tích hợp Google Maps API hoặc Mapbox để hiển thị vị trí trụ sở và điểm tiếp nhận.</p>
        </div>

        <div className="absolute top-[30%] left-[40%] bg-white p-2 rounded-full shadow-lg border-2 border-blue-500 text-blue-700 animate-bounce cursor-pointer hover:scale-110 transition-transform">
          <Building2 size={24} />
        </div>
        <div className="absolute top-[50%] left-[60%] bg-white p-2 rounded-full shadow-lg border-2 border-emerald-500 text-emerald-700 hover:scale-110 transition-transform cursor-pointer">
          <FileText size={24} />
        </div>
        <div className="absolute top-[20%] left-[70%] bg-white p-2 rounded-full shadow-lg border-2 border-amber-500 text-amber-700 hover:scale-110 transition-transform cursor-pointer">
          <Landmark size={24} />
        </div>

        <div className="absolute bottom-8 right-8 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors border border-slate-200 font-bold text-xl">+</button>
          <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors border border-slate-200 font-bold text-xl">-</button>
        </div>
      </div>
    </div>
  );
}




