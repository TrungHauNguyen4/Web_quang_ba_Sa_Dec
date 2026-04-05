import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Calendar, ChevronLeft, Link2, Share2 } from "lucide-react";
import DOMPurify from "dompurify";
import { newsService } from "../services/news.service";
import { commentService, CommentItem } from "../services/comment.service";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  content?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
};

const NEWS_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=1200";

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

    if (host.includes("drive.google.com")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      const fileIndex = segments.findIndex((x) => x === "d");
      const fileId = fileIndex >= 0 ? segments[fileIndex + 1] : parsed.searchParams.get("id");
      if (fileId) {
        return { kind: "iframe", src: `https://drive.google.com/file/d/${fileId}/preview` };
      }
    }
  } catch {
    // Use native video playback fallback for invalid/relative URLs.
  }

  return { kind: "video", src: videoUrl };
}

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
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentMessage, setCommentMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    content: "",
  });

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    const title = article?.title || "Tin tức";
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // Fall through to clipboard copy.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCommentMessage("Đã sao chép liên kết bài viết.");
    } catch {
      setCommentError("Không thể chia sẻ liên kết lúc này.");
    }
  };

  const loadComments = async (newsId: string) => {
    setCommentLoading(true);
    setCommentError(null);

    try {
      const response = await commentService.getApprovedByTarget({
        targetType: "news",
        targetId: newsId,
        page: 1,
        pageSize: 20,
      });
      setComments(Array.isArray(response?.items) ? response.items : []);
    } catch {
      setCommentError("Không tải được bình luận.");
    } finally {
      setCommentLoading(false);
    }
  };

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
        if (data?.id) {
          await loadComments(data.id);
        }
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

  const handleSubmitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!article?.id) return;

    if (!form.content.trim()) {
      setCommentError("Vui lòng nhập nội dung bình luận.");
      return;
    }

    setCommentSubmitting(true);
    setCommentError(null);
    setCommentMessage(null);

    try {
      const created = await commentService.submit({
        targetType: "news",
        targetId: article.id,
        content: form.content.trim(),
      });

      const status = String(created?.status ?? "").toLowerCase();
      const isApproved = status === "1" || status === "approved";

      setForm({ content: "" });
      if (isApproved) {
        setCommentMessage("Đã gửi bình luận và hiển thị ngay.");
      } else {
        setCommentMessage("Đã gửi bình luận. Bình luận sẽ hiển thị sau khi được duyệt.");
      }

      await loadComments(article.id);
    } catch {
      setCommentError("Gửi bình luận thất bại.");
    } finally {
      setCommentSubmitting(false);
    }
  };

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
          <>
            <article className="mt-8 bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-10">
              <img
                src={article.imageUrl || NEWS_FALLBACK_IMAGE}
                alt={article.title}
                className="w-full h-80 object-cover rounded-xl border border-stone-100"
              />

              {article.videoUrl ? (
                (() => {
                  const media = resolveVideoSource(article.videoUrl);
                  if (media.kind === "iframe") {
                    return (
                      <iframe
                        src={media.src}
                        className="mt-4 w-full aspect-video rounded-xl border border-stone-100"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        title={`video-${article.id}`}
                      />
                    );
                  }

                  return <video src={media.src} controls preload="metadata" className="mt-4 w-full rounded-xl border border-stone-100" />;
                })()
              ) : null}

              <h2 className="mt-8 text-3xl font-bold text-stone-800 leading-tight">{article.title}</h2>

              <div className="mt-4 flex items-center gap-2 text-stone-500 text-sm">
                <Calendar size={16} />
                <span>{formatDate(article.publishedAt) || formatDate(article.createdAt)}</span>
                {article.category ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">{article.category}</span> : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleShare()}
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                >
                  <Share2 size={16} /> Chia sẻ
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                >
                  <Link2 size={16} /> Facebook
                </a>
              </div>

              {article.excerpt ? (
                <p className="mt-6 text-lg text-stone-600 border-l-4 border-emerald-200 pl-4">
                  {article.excerpt}
                </p>
              ) : null}

              {article.content ? (
                <div
                  className="mt-8 prose prose-stone max-w-none leading-8 text-stone-700"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />
              ) : (
                <div className="mt-8 prose prose-stone max-w-none leading-8 text-stone-700 whitespace-pre-line">
                  Bài viết này chưa có nội dung chi tiết.
                </div>
              )}
            </article>

            <section className="mt-8 bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-8">
              <h3 className="text-2xl font-bold text-stone-800">Bình luận</h3>

              <form onSubmit={handleSubmitComment} className="mt-5 grid grid-cols-1 gap-3">
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Nhập bình luận..."
                  rows={4}
                  className="px-4 py-3 rounded-lg border border-stone-200 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={commentSubmitting}
                    className="px-5 py-2.5 rounded-lg bg-emerald-700 text-white disabled:opacity-60"
                  >
                    {commentSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                  </button>
                </div>
              </form>

              {commentError ? <div className="mt-4 text-sm text-red-600">{commentError}</div> : null}
              {commentMessage ? <div className="mt-4 text-sm text-emerald-700">{commentMessage}</div> : null}

              <div className="mt-6 space-y-4">
                {commentLoading ? <div className="text-sm text-stone-500">Đang tải bình luận...</div> : null}
                {!commentLoading && comments.length === 0 ? <div className="text-sm text-stone-500">Chưa có bình luận nào.</div> : null}

                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-xl border border-stone-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-stone-800">{comment.userName}</div>
                      <div className="text-xs text-stone-500">{new Date(comment.createdAt).toLocaleString("vi-VN")}</div>
                    </div>
                    <p className="mt-2 text-stone-700 whitespace-pre-line">{comment.content}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}




