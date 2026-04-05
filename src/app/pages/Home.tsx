import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Search, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { newsService } from "../services/news.service";
import { settingsService, SystemSettingsDto } from "../services/settings.service";

type HomeNewsItem = {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  excerpt?: string | null;
};

const FALLBACK_NEWS_IMAGE = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000";

export function Home() {
  const [news, setNews] = useState<HomeNewsItem[]>([]);
  const [settings, setSettings] = useState<SystemSettingsDto | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    let active = true;

    const loadNews = async () => {
      try {
        const response = await newsService.getAll({ page: 1, pageSize: 8 });
        const items: HomeNewsItem[] = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
            ? response
            : [];

        if (!active) return;
        setNews(items.filter((item) => Boolean(item.slug && item.title)));
      } catch {
        if (!active) return;
        setNews([]);
      }
    };

    void loadNews();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const data = await settingsService.getPublic();
        if (!active) return;
        setSettings(data);
      } catch {
        if (!active) return;
        setSettings(null);
      }
    };

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const headlines = useMemo(
    () => news.slice(0, 6).map((item) => item.title),
    [news],
  );

  useEffect(() => {
    if (news.length === 0) {
      setFeaturedIndex(0);
      return;
    }

    setFeaturedIndex((prev) => (prev >= news.length ? 0 : prev));
  }, [news]);

  useEffect(() => {
    if (news.length <= 1) return;

    const timer = window.setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % news.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, [news]);

  const handleNextFeatured = () => {
    if (news.length <= 1) return;
    setFeaturedIndex((prev) => (prev + 1) % news.length);
  };

  const featuredNews = news.length > 0 ? news[featuredIndex] : null;
  const rightColumnNews = useMemo(
    () => news.filter((_, idx) => idx !== featuredIndex).slice(0, 5),
    [news, featuredIndex],
  );

  return (
    <div className="w-full bg-[#efefef] pb-12">
      <section className="relative overflow-hidden bg-[#0f4ea3]">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1472552944129-b035e9ea3744?auto=format&fit=crop&q=80&w=1920"
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute -left-24 top-0 h-[280px] w-[280px] rounded-full border border-cyan-300/70" />
        <div className="absolute -left-14 top-10 h-[220px] w-[220px] rounded-full border border-cyan-300/40" />
        <div className="absolute right-6 top-8 h-[180px] w-[180px] rounded-full border border-cyan-300/60" />
        <div className="absolute right-14 top-14 h-[130px] w-[130px] rounded-full border border-cyan-300/40" />

        <div className="relative mx-auto flex h-[280px] max-w-[1240px] items-center justify-center px-4">
          <div className="text-center text-white">
            <p className="text-2xl font-light tracking-[0.24em]">CỔNG THÔNG TIN ĐIỆN TỬ</p>
            <h1 className="mt-2 text-5xl font-extrabold tracking-wide text-cyan-100 drop-shadow">{(settings?.siteName || "PHƯỜNG SA ĐÉC").toUpperCase()}</h1>
            <p className="mt-2 text-2xl tracking-[0.2em] text-cyan-50">www.sadec.gov.vn</p>
          </div>

          <div className="absolute right-4 top-8 hidden w-[280px] items-center bg-white pl-3 pr-2 py-1.5 shadow lg:flex">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full border-none text-sm text-slate-700 outline-none"
            />
            <button className="text-slate-600" aria-label="Tìm kiếm">
              <Search size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-300 bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center gap-4 overflow-hidden px-2 py-2 text-sm">
          <span className="shrink-0 bg-[#d9006c] px-2 py-0.5 font-bold text-white">TIN MỚI</span>
          <div className="min-w-0 overflow-hidden">
            <motion.div
              className="flex gap-8 whitespace-nowrap text-slate-800"
              animate={{ x: [0, -900] }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            >
              {[...(headlines.length > 0 ? headlines : ["Đang cập nhật tin mới từ hệ thống..."]), ...(headlines.length > 0 ? headlines : ["Đang cập nhật tin mới từ hệ thống..."])].map((item, idx) => (
                <span key={`${idx}-${item}`}>• {item}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-4 grid max-w-[1240px] grid-cols-1 gap-4 px-2 lg:grid-cols-[2.2fr_1.2fr_1fr]">
        <article className="border border-slate-300 bg-white">
          <div className="relative">
            <img
              src={featuredNews?.imageUrl || FALLBACK_NEWS_IMAGE}
              alt="Tin nổi bật"
              className="h-[360px] w-full object-cover"
            />
            <button
              type="button"
              onClick={handleNextFeatured}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 text-slate-700"
              aria-label="Chuyển tin nổi bật tiếp theo"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="border-t border-slate-300 p-3">
            <Link
              to={featuredNews?.slug ? `/tin-tuc/${featuredNews.slug}` : "/tin-tuc"}
              className="text-2xl md:text-3xl leading-tight font-bold text-slate-800 hover:text-sky-700"
            >
              {featuredNews?.title || "Đang cập nhật tin nổi bật"}
            </Link>
          </div>
        </article>

        <aside className="border border-slate-300 bg-white">
          <ul className="divide-y divide-slate-300">
            {(rightColumnNews.length > 0 ? rightColumnNews : [{ id: "placeholder", title: "Đang cập nhật tin mới", slug: "" }]).map((item) => (
              <li key={item.id} className="px-3 py-3">
                <Link to={item.slug ? `/tin-tuc/${item.slug}` : "/tin-tuc"} className="group flex gap-3">
                  <img
                    src={item.imageUrl || FALLBACK_NEWS_IMAGE}
                    alt={item.title}
                    className="h-16 w-24 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-lg leading-tight text-slate-800 group-hover:text-sky-700">{item.title}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">{item.excerpt || "Tin tức cập nhật từ hệ thống"}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <aside className="border border-slate-300 bg-white">
          <div className="bg-[#1f6dc0] px-3 py-2 text-center text-xl md:text-2xl font-bold text-white">BẢN ĐỒ HÀNH CHÍNH</div>
          <div className="p-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/BlankMap-Vietnam-provinces.svg/640px-BlankMap-Vietnam-provinces.svg.png"
              alt="Bản đồ"
              className="w-full border border-slate-300"
            />
            <div className="mt-3 space-y-2 text-base md:text-lg text-slate-800">
              <p><span className="font-bold">* Đơn vị hành chính:</span> Phường Sa Đéc</p>
              <p><span className="font-bold">* Diện tích:</span> 8,4 km2</p>
              <p><span className="font-bold">* Dân số:</span> 36.000 người</p>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-3 space-y-2 text-sm text-slate-700">
              <h3 className="text-base font-bold text-slate-900">Giới thiệu nhanh</h3>
              <p><span className="font-semibold">Lịch sử:</span> Sa Đéc là đô thị có bề dày lịch sử, hình thành từ khu vực chợ - bến sông và làng nghề truyền thống.</p>
              <p><span className="font-semibold">Vị trí:</span> Phường Sa Đéc nằm ở trung tâm thành phố Sa Đéc, thuận lợi kết nối giao thông nội vùng và liên vùng.</p>
              <p><span className="font-semibold">Tự nhiên:</span> Khu vực mang đặc trưng sông nước Đồng bằng sông Cửu Long, khí hậu phù hợp sản xuất và dịch vụ.</p>
              <p><span className="font-semibold">Dân cư:</span> Dân cư tập trung theo các khu đô thị, lao động dịch vụ - thương mại tăng theo định hướng phát triển.</p>
              <p><span className="font-semibold">Hạ tầng:</span> Giao thông, điện nước, y tế, giáo dục và hạ tầng số đang được đầu tư đồng bộ.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-4 max-w-[1240px] px-2">
        <div className="border border-slate-300 bg-white p-4 text-base md:text-lg leading-relaxed text-slate-700">
          {settings?.seoDescription || "Trang chủ được điều chỉnh theo bố cục cổng thông tin điện tử cấp phường: thanh menu ngang, hero xanh có tìm kiếm, thanh tin chạy, cụm tin nổi bật 3 cột và khối bản đồ hành chính."}
        </div>
      </section>

    </div>
  );
}



