import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Calendar, ChevronLeft } from "lucide-react";
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

function NewsDetailSkeleton() {
  return (
    <div className="mt-8 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-80 bg-stone-200" />
      <div className="p-6 md:p-10 space-y-4">
        <div className="h-10 w-11/12 bg-stone-200 rounded" />
        <div className="h-4 w-1/3 bg-stone-200 rounded" />
        <div className="h-6 w-full bg-stone-200 rounded" />
        <div className="h-4 w-full bg-stone-200 rounded" />
        <div className="h-4 w-10/12 bg-stone-200 rounded" />
        <div className="h-4 w-full bg-stone-200 rounded" />
        <div className="h-4 w-9/12 bg-stone-200 rounded" />
      </div>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
}

export function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadDetail = async () => {
      if (!slug) {
        setError("Không tìm thấy đường dẫn bài viết.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await newsService.getBySlug(slug);
        if (!active) return;
        setArticle(data);
      } catch {
        if (!active) return;
        setError("Không tải được chi tiết bài viết.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-emerald-900 text-white py-14 text-center">
        <h1 className="text-3xl md:text-4xl font-bold px-4">Chi tiết tin tức</h1>
      </div>

      <div className="container mx-auto px-4 mt-10 max-w-4xl">
        <Link
          to="/tin-tuc"
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium"
        >
          <ChevronLeft size={18} /> Quay lại danh sách tin
        </Link>

        {isLoading ? (
          <NewsDetailSkeleton />
        ) : null}

        {!isLoading && error ? (
          <div className="mt-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && article ? (
          <article className="mt-8 bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-10">
            <img
              src={article.imageUrl || NEWS_FALLBACK_IMAGE}
              alt={article.title}
              className="w-full h-80 object-cover rounded-xl border border-stone-100"
            />

            <h2 className="mt-8 text-3xl font-bold text-stone-800 leading-tight">{article.title}</h2>

            <div className="mt-4 flex items-center gap-2 text-stone-500 text-sm">
              <Calendar size={16} />
              <span>{formatDate(article.publishedAt) || formatDate(article.createdAt)}</span>
            </div>

            {article.excerpt ? (
              <p className="mt-6 text-lg text-stone-600 border-l-4 border-emerald-200 pl-4">
                {article.excerpt}
              </p>
            ) : null}

            <div className="mt-8 prose prose-stone max-w-none leading-8 text-stone-700 whitespace-pre-line">
              {article.content || "Bài viết này chưa có nội dung chi tiết."}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}




