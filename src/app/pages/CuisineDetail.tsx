import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, MapPin, Utensils } from "lucide-react";
import { cuisineService, CuisineItem } from "../services/cuisine.service";

const CUISINE_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=1200";

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

export function CuisineDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<CuisineItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadDetail = async () => {
      if (!slug) {
        setError("Không tìm thấy đường dẫn đặc sản.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await cuisineService.getBySlug(slug);
        if (!active) return;
        setItem(data);
      } catch {
        if (!active) return;
        setError("Không tải được chi tiết đặc sản.");
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
    <div className="w-full bg-orange-50 min-h-screen pb-20">
      <div className="bg-orange-700 text-white py-14 text-center">
        <h1 className="text-3xl md:text-4xl font-bold px-4">Chi tiết đặc sản</h1>
      </div>

      <div className="container mx-auto px-4 mt-10 max-w-4xl">
        <Link
          to="/am-thuc"
          className="inline-flex items-center gap-2 text-orange-700 hover:text-orange-900 font-medium"
        >
          <ChevronLeft size={18} /> Quay lại danh sách ẩm thực
        </Link>

        {isLoading ? (
          <div className="mt-8 bg-white rounded-2xl border border-orange-200 p-6 text-sm text-stone-600">
            Đang tải chi tiết đặc sản...
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="mt-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && item ? (
          <article className="mt-8 bg-white rounded-2xl border border-orange-200 shadow-sm p-6 md:p-10">
            <img
              src={item.imageUrl || item.galleryImageUrls?.[0] || CUISINE_FALLBACK_IMAGE}
              alt={item.title}
              className="w-full h-80 object-cover rounded-xl border border-orange-100"
            />

            {item.galleryImageUrls && item.galleryImageUrls.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {item.galleryImageUrls.map((url) => (
                  <img key={url} src={url} alt={item.title} className="h-28 w-full rounded-lg object-cover border border-orange-100" />
                ))}
              </div>
            ) : null}

            {item.videoUrl ? (
              (() => {
                const media = resolveVideoSource(item.videoUrl);
                if (media.kind === "iframe") {
                  return (
                    <iframe
                      src={media.src}
                      className="mt-4 w-full aspect-video rounded-xl border border-orange-100"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      title={`cuisine-video-${item.id}`}
                    />
                  );
                }

                return <video src={media.src} controls preload="metadata" className="mt-4 w-full rounded-xl border border-orange-100" />;
              })()
            ) : null}

            <h2 className="mt-8 text-3xl font-bold text-stone-800 leading-tight">{item.title}</h2>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-800">
              <Utensils size={14} /> {item.category || "Đặc sản địa phương"}
            </div>

            <div className="mt-4">
              <a
                href={typeof item.latitude === "number" && typeof item.longitude === "number"
                  ? `https://www.google.com/maps?q=${item.latitude},${item.longitude}`
                  : `https://www.google.com/maps?q=${encodeURIComponent(item.title)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
              >
                <MapPin size={14} /> Xem bản đồ
              </a>
            </div>

            <div className="mt-8 leading-8 text-stone-700 whitespace-pre-line text-base">
              {item.description || "Món ăn này chưa có mô tả chi tiết."}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
