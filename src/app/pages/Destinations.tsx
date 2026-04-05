import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Info } from "lucide-react";
import { Link } from "react-router";
import { destinationService } from "../services/destination.service";

type DestinationItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  content?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=800";

export function Destinations() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await destinationService.getAll({ page: 1, pageSize: 100, q: query || undefined });
      setItems(Array.isArray(response?.items) ? response.items : []);
    } catch {
      setError("Không tải được danh sách địa danh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((d) =>
      d.title.toLowerCase().includes(q) ||
      d.slug.toLowerCase().includes(q) ||
      (d.excerpt || "").toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="w-full bg-slate-100 min-h-screen pb-20">
      <div className="bg-slate-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Địa danh nổi bật</h1>
        <p className="text-slate-200 max-w-2xl mx-auto px-4">
          Tra cứu các địa danh nổi bật và thông tin tham quan tại địa phương.
        </p>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex gap-3 justify-center mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void loadData();
            }}
            placeholder="Tìm địa danh..."
            className="w-full max-w-xl px-4 py-3 rounded-lg border border-slate-300"
          />
          <button onClick={() => void loadData()} className="px-4 py-3 rounded-lg bg-blue-700 text-white">
            Tìm
          </button>
        </div>

        {error ? <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 mb-6">{error}</div> : null}
        {loading ? <div className="rounded-xl bg-white border border-slate-200 p-4 text-sm text-slate-600 mb-6">Đang tải dữ liệu...</div> : null}

        {!loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-slate-200"
              >
                <div className="relative h-60 overflow-hidden">
                  <img src={dest.imageUrl || FALLBACK_IMAGE} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{dest.title}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">{dest.excerpt || "Đang cập nhật mô tả..."}</p>
                  {dest.videoUrl ? (
                    <div className="mb-4">
                      <video src={dest.videoUrl} controls className="w-full rounded-lg border border-slate-200" preload="metadata" />
                    </div>
                  ) : null}
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {dest.latitude ?? "-"}, {dest.longitude ?? "-"}
                    </span>
                    <a
                      href={typeof dest.latitude === "number" && typeof dest.longitude === "number"
                        ? `https://www.google.com/maps?q=${dest.latitude},${dest.longitude}`
                        : `https://www.google.com/maps?q=${encodeURIComponent(dest.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 font-semibold hover:text-blue-900"
                    >
                      Bản đồ
                    </a>
                    <Link to={`/dia-danh/${dest.slug}`} className="ml-auto text-blue-700 font-semibold hover:text-blue-900 flex items-center gap-1">
                      <Info size={16} /> Chi tiết
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}

        {!loading && filtered.length === 0 ? (
          <div className="rounded-xl bg-white border border-slate-200 p-4 text-sm text-slate-600">Chưa có địa danh nào.</div>
        ) : null}
      </div>
    </div>
  );
}
