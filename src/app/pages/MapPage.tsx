import { useEffect, useMemo, useState } from "react";
import { Building2, FileText, Landmark, MapPin, Search } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSearchParams } from "react-router";
import { destinationService } from "../services/destination.service";

type DestinationMapItem = {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

function resolveVideoSource(videoUrl: string): { kind: "iframe" | "video"; src: string } {
  try {
    const parsed = new URL(videoUrl);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      let videoId = "";

      if (host.includes("youtu.be")) {
        videoId = parsed.pathname.split("/").filter(Boolean)[0] || "";
      } else if (parsed.pathname.startsWith("/watch")) {
        videoId = parsed.searchParams.get("v") || "";
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/")[2] || "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/")[2] || "";
      }

      if (videoId) {
        return { kind: "iframe", src: `https://www.youtube.com/embed/${videoId}` };
      }
    }
  } catch {
    // Fallback to native video URL.
  }

  return { kind: "video", src: videoUrl };
}

const FALLBACK_CENTER: [number, number] = [10.29085, 105.75635];

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function MapPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [items, setItems] = useState<DestinationMapItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "Tất cả", icon: MapPin },
    { id: "public", name: "Trụ sở hành chính", icon: Building2 },
    { id: "service", name: "Điểm một cửa", icon: FileText },
    { id: "culture", name: "Công trình công", icon: Landmark },
  ];

  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q) {
      setQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await destinationService.getAll({ page: 1, pageSize: 100, q: query || undefined });
        setItems(Array.isArray(response?.items) ? response.items : []);
      } catch {
        setError("Không tải được dữ liệu bản đồ.");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [query]);

  const mappedItems = useMemo(
    () =>
      items.filter(
        (x): x is DestinationMapItem & { latitude: number; longitude: number } =>
          typeof x.latitude === "number" && typeof x.longitude === "number"
      ),
    [items]
  );

  const resolveCategory = (item: DestinationMapItem) => {
    const text = `${item.title} ${item.excerpt || ""}`.toLowerCase();
    if (text.includes("ubnd") || text.includes("trụ sở") || text.includes("hành chính")) return "public";
    if (text.includes("một cửa") || text.includes("dịch vụ") || text.includes("hồ sơ")) return "service";
    return "culture";
  };

  const visibleItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => resolveCategory(item) === activeCategory);
  }, [activeCategory, items]);

  const visibleMappedItems = useMemo(() => {
    if (activeCategory === "all") return mappedItems;
    return mappedItems.filter((item) => resolveCategory(item) === activeCategory);
  }, [activeCategory, mappedItems]);

  const center: [number, number] = visibleMappedItems.length > 0
    ? [visibleMappedItems[0].latitude, visibleMappedItems[0].longitude]
    : FALLBACK_CENTER;

  const selectedItem = visibleItems.find((item) => item.id === selectedId) ?? null;
  const selectedMappedItem = visibleMappedItems.find((item) => item.id === selectedId) ?? null;

  return (
    <div className="w-full bg-slate-100 min-h-[calc(100vh-80px)] flex flex-col md:flex-row">
      <div className="w-full md:w-80 lg:w-96 bg-white shadow-xl z-10 flex flex-col h-[600px] md:h-auto border-r border-slate-200 shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Bản đồ hành chính</h1>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Tìm địa điểm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
          {error ? <div className="mb-4 text-sm text-red-600">{error}</div> : null}
          {loading ? <div className="mb-4 text-sm text-slate-500">Đang tải địa danh...</div> : null}
          <div className="space-y-4">
            {visibleItems.slice(0, 10).map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left flex gap-4 p-4 rounded-xl border transition-colors cursor-pointer group ${
                  selectedId === item.id
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 hover:border-blue-200 hover:bg-blue-50/40"
                }`}
              >
                <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                  <img src={item.imageUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200"} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.excerpt || "Địa danh đang cập nhật mô tả."}</p>
                  <div className="flex items-center gap-1 text-xs text-blue-700 font-medium mt-2">
                    <FileText size={12} /> Điểm hành chính
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedItem ? (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-bold text-slate-800">{selectedItem.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{selectedItem.excerpt || "Địa danh đang cập nhật mô tả."}</p>
              {selectedItem.imageUrl ? <img src={selectedItem.imageUrl} alt={selectedItem.title} className="mt-3 h-40 w-full rounded-lg object-cover" /> : null}
              {selectedItem.videoUrl ? (
                (() => {
                  const media = resolveVideoSource(selectedItem.videoUrl || "");
                  if (media.kind === "iframe") {
                    return (
                      <iframe
                        src={media.src}
                        className="mt-3 w-full aspect-video rounded-lg border border-slate-200"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        title={`map-video-${selectedItem.id}`}
                      />
                    );
                  }

                  return <video src={media.src} controls preload="metadata" className="mt-3 w-full rounded-lg border border-slate-200" />;
                })()
              ) : null}
              {selectedMappedItem ? (
                <p className="mt-2 text-xs text-slate-500">
                  Tọa độ: {selectedMappedItem.latitude.toFixed(6)}, {selectedMappedItem.longitude.toFixed(6)}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex-1 relative bg-slate-200 min-h-[400px]">
        <MapContainer center={center} zoom={13} className="h-full w-full min-h-[400px]">
          <FlyToSelection item={selectedMappedItem} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {visibleMappedItems.map((item) => (
            <Marker key={item.id} position={[item.latitude, item.longitude]} icon={markerIcon} eventHandlers={{ click: () => setSelectedId(item.id) }}>
              <Popup>
                <div className="w-52">
                  <div className="font-semibold text-slate-800">{item.title}</div>
                  <div className="text-xs text-slate-600 mt-1">{item.excerpt || "Địa danh chưa có mô tả."}</div>
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="mt-2 h-24 w-full rounded-md object-cover" /> : null}
                  {item.videoUrl ? (
                    (() => {
                      const media = resolveVideoSource(item.videoUrl || "");
                      if (media.kind === "iframe") {
                        return (
                          <iframe
                            src={media.src}
                            className="mt-2 w-full aspect-video rounded-md border border-slate-200"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            title={`map-popup-video-${item.id}`}
                          />
                        );
                      }

                      return <video src={media.src} controls preload="metadata" className="mt-2 w-full rounded-md border border-slate-200" />;
                    })()
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

function FlyToSelection({ item }: { item: (DestinationMapItem & { latitude: number; longitude: number }) | null }) {
  const map = useMap();

  useEffect(() => {
    if (!item) return;
    map.flyTo([item.latitude, item.longitude], 15, { duration: 0.8 });
  }, [item, map]);

  return null;
}




