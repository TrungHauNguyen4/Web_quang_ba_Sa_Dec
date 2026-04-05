import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Utensils, MapPin } from "lucide-react";
import { cuisineService } from "../services/cuisine.service";

type CuisineItem = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  galleryImageUrls?: string[];
  videoUrl?: string | null;
  category?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=800";

export function Cuisine() {
  const [items, setItems] = useState<CuisineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await cuisineService.getAll({ page: 1, pageSize: 100 });
        setItems(Array.isArray(response?.items) ? response.items : []);
      } catch {
        setError("Không tải được dữ liệu ẩm thực.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-orange-600 text-white py-16 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Ẩm thực đặc sắc</h1>
          <p className="text-orange-100 max-w-2xl mx-auto px-4">Khám phá những món ngon đặc trưng và câu chuyện ẩm thực địa phương.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">{error}</div> : null}
        {loading ? <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-600 mb-6">Đang tải dữ liệu...</div> : null}

        {!loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((dish, i) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={dish.imageUrl || dish.galleryImageUrls?.[0] || FALLBACK_IMAGE}
                    alt={dish.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                    <h3 className="text-2xl font-bold text-white mb-1">{dish.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-stone-600 mb-6 line-clamp-3">{dish.description || "Đang cập nhật mô tả..."}</p>
                  {dish.videoUrl ? <video src={dish.videoUrl} controls preload="metadata" className="mb-4 w-full rounded-lg border border-orange-100" /> : null}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Utensils size={18} className="text-orange-500" />
                    <span className="text-sm font-semibold text-stone-700">{dish.category || "Đặc sản địa phương"}</span>
                    <a
                      href={typeof dish.latitude === "number" && typeof dish.longitude === "number"
                        ? `https://www.google.com/maps?q=${dish.latitude},${dish.longitude}`
                        : `https://www.google.com/maps?q=${encodeURIComponent(dish.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-orange-700 hover:text-orange-900"
                    >
                      Bản đồ
                    </a>
                    <Link
                      to={`/am-thuc/${dish.slug}`}
                      className="ml-auto text-sm font-semibold text-orange-700 hover:text-orange-900"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}

        {!loading && items.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-600">Chưa có món ăn nào được xuất bản.</div>
        ) : null}

        <div className="mt-16 bg-orange-50 rounded-3xl p-8 md:p-12 text-center">
          <MapPin size={48} className="text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Gợi ý địa điểm ăn uống</h2>
          <p className="text-stone-600 max-w-2xl mx-auto mb-8">Bạn có thể kết hợp dữ liệu món ăn với module địa danh để tạo bản đồ ẩm thực ở sprint tiếp theo.</p>
        </div>
      </div>
    </div>
  );
}
