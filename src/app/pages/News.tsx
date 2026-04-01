import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Calendar, ArrowRight } from "lucide-react";
import { newsService } from "../services/news.service";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  content?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
};

const NEWS_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=1200";

function resolveImageUrl(article: NewsItem) {
  return article.imageUrl || NEWS_FALLBACK_IMAGE;
}

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
}

export function News() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await newsService.getAll({ page: 1, pageSize: 12 });
        const items: NewsItem[] = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
            ? response
            : [];

        if (!active) return;
        setArticles(items.filter((x) => Boolean(x.slug)));
      } catch {
        if (!active) return;
        setError("Không tải được danh sách tin tức từ API.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadNews();

    return () => {
      active = false;
    };
  }, []);

  const featuredArticle = useMemo(() => (articles.length > 0 ? articles[0] : null), [articles]);
  const regularArticles = useMemo(() => articles.slice(1), [articles]);

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-emerald-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Tin tức • Thông báo • Văn bản</h1>
        <p className="text-emerald-100 max-w-2xl mx-auto px-4">Cập nhật chỉ đạo điều hành, lịch tiếp dân, tiến độ hồ sơ và các thông báo quan trọng từ UBND.</p>
      </div>

      <div className="container mx-auto px-4 mt-12">
        {isLoading ? (
          <div className="mb-10 rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500">
            Đang tải danh sách tin tức...
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="mb-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {/* Featured Article */}
        {!isLoading && !error && featuredArticle ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-100 flex flex-col lg:flex-row group"
          >
            <div className="lg:w-3/5 h-80 lg:h-auto relative overflow-hidden">
              <img src={resolveImageUrl(featuredArticle)} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm text-stone-500 mb-4">
                <span className="flex items-center gap-1"><Calendar size={16} /> {formatDate(featuredArticle.publishedAt) || formatDate(featuredArticle.createdAt)}</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-6 group-hover:text-emerald-700 transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-stone-600 text-lg mb-8 line-clamp-3">{featuredArticle.excerpt || "Đang cập nhật nội dung tóm tắt..."}</p>
              <Link to={`/tin-tuc/${featuredArticle.slug}`} className="self-start bg-emerald-100 text-emerald-700 hover:bg-emerald-700 hover:text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2">
                Đọc tiếp <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        ) : null}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-stone-100 hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={resolveImageUrl(article)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(article.publishedAt) || formatDate(article.createdAt)}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-stone-600 mb-6 line-clamp-3 text-sm flex-grow">{article.excerpt || "Đang cập nhật nội dung tóm tắt..."}</p>
                <Link to={`/tin-tuc/${article.slug}`} className="text-emerald-700 font-semibold hover:text-emerald-900 transition-colors flex items-center gap-1 mt-auto">
                  Đọc tiếp <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {!isLoading && !error && articles.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500">
            Chưa có tin tức nào từ hệ thống.
          </div>
        ) : null}
      </div>
    </div>
  );
}
