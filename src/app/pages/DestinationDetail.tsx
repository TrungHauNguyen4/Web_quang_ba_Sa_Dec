import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, MapPin } from "lucide-react";
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

const DESTINATION_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=1200";

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

export function DestinationDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<DestinationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadDetail = async () => {
      if (!slug) {
        setError("Không tìm thấy đường dẫn địa danh.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await destinationService.getBySlug(slug);
        if (!active) return;
        setItem(data);
      } catch {
        if (!active) return;
        setError("Không tải được chi tiết địa danh.");
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
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      <div className="bg-slate-900 text-white py-14 text-center">
        <h1 className="text-3xl md:text-4xl font-bold px-4">Chi tiết địa danh</h1>
      </div>

      <div className="container mx-auto px-4 mt-10 max-w-4xl">
        <Link
          to="/dia-danh"
          className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
        >
          <ChevronLeft size={18} /> Quay lại danh sách địa danh
        </Link>

        {isLoading ? (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 text-sm text-slate-600">Đang tải chi tiết địa danh...</div>
        ) : null}

        {!isLoading && error ? (
          <div className="mt-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && item ? (
          <article className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
            <img
              src={item.imageUrl || DESTINATION_FALLBACK_IMAGE}
              alt={item.title}
              className="w-full h-80 object-cover rounded-xl border border-slate-100"
            />

            {item.videoUrl ? (
              (() => {
                const media = resolveVideoSource(item.videoUrl);
                if (media.kind === "iframe") {
                  return (
                    <iframe
                      src={media.src}
                      className="mt-4 w-full aspect-video rounded-xl border border-slate-100"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      title={`destination-video-${item.id}`}
                    />
                  );
                }

                return <video src={media.src} controls preload="metadata" className="mt-4 w-full rounded-xl border border-slate-100" />;
              })()
            ) : null}

            <h2 className="mt-8 text-3xl font-bold text-slate-800 leading-tight">{item.title}</h2>

            {item.excerpt ? (
              <p className="mt-6 text-lg text-slate-600 border-l-4 border-blue-200 pl-4">
                {item.excerpt}
              </p>
            ) : null}

            <div className="mt-8 prose prose-slate max-w-none leading-8 text-slate-700 whitespace-pre-line">
              {item.content || "Địa danh này chưa có nội dung chi tiết."}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                <MapPin size={14} /> {item.latitude ?? "-"}, {item.longitude ?? "-"}
              </span>
              <a
                href={typeof item.latitude === "number" && typeof item.longitude === "number"
                  ? `https://www.google.com/maps?q=${item.latitude},${item.longitude}`
                  : `https://www.google.com/maps?q=${encodeURIComponent(item.title)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-100"
              >
                Xem bản đồ
              </a>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
