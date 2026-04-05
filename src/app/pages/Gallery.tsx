import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Play, Image as ImageIcon } from "lucide-react";
import { isAxiosError } from "axios";
import { MediaItemDto, mediaService } from "../services/media.service";
import { destinationService } from "../services/destination.service";
import { cuisineService } from "../services/cuisine.service";
import { newsService } from "../services/news.service";

type ContentImageItem = {
  id: string;
  title: string;
  imageUrl: string;
  source: string;
};

export function Gallery() {
  const [activeTab, setActiveTab] = useState("images");
  const [mediaItems, setMediaItems] = useState<MediaItemDto[]>([]);
  const [contentImages, setContentImages] = useState<ContentImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadMedia = async () => {
      setLoading(true);
      setError(null);
      try {
        const [mediaResult, newsResult, destinationResult, cuisineResult] = await Promise.allSettled([
          mediaService.getPublic({ page: 1, pageSize: 100 }),
          newsService.getAll({ page: 1, pageSize: 100 }),
          destinationService.getAll({ page: 1, pageSize: 100 }),
          cuisineService.getAll({ page: 1, pageSize: 100 }),
        ]);

        if (!active) return;

        if (mediaResult.status === "fulfilled") {
          setMediaItems(Array.isArray(mediaResult.value?.items) ? mediaResult.value.items : []);
        } else {
          throw mediaResult.reason;
        }

        const extractedFromNews: ContentImageItem[] = newsResult.status === "fulfilled"
          ? (Array.isArray(newsResult.value?.items) ? newsResult.value.items : [])
              .filter((item: { id?: string; title?: string; imageUrl?: string | null; status?: number | string }) => {
                const status = item.status;
                const isPublished = status === undefined || status === 1 || status === "Published";
                return Boolean(item.id && item.title && item.imageUrl && isPublished);
              })
              .map((item: { id: string; title: string; imageUrl: string }) => ({
                id: `news-${item.id}`,
                title: item.title,
                imageUrl: item.imageUrl,
                source: "Tin tức",
              }))
          : [];

        const extractedFromDestinations: ContentImageItem[] = destinationResult.status === "fulfilled"
          ? (Array.isArray(destinationResult.value?.items) ? destinationResult.value.items : [])
              .filter((item: { id?: string; title?: string; imageUrl?: string | null }) => Boolean(item.id && item.title && item.imageUrl))
              .map((item: { id: string; title: string; imageUrl: string }) => ({
                id: `destination-${item.id}`,
                title: item.title,
                imageUrl: item.imageUrl,
                source: "Địa danh",
              }))
          : [];

        const extractedFromCuisine: ContentImageItem[] = cuisineResult.status === "fulfilled"
          ? (Array.isArray(cuisineResult.value?.items) ? cuisineResult.value.items : [])
              .filter((item: { id?: string; title?: string; imageUrl?: string | null }) => Boolean(item.id && item.title && item.imageUrl))
              .map((item: { id: string; title: string; imageUrl: string }) => ({
                id: `cuisine-${item.id}`,
                title: item.title,
                imageUrl: item.imageUrl,
                source: "Ẩm thực",
              }))
          : [];

        setContentImages([...extractedFromNews, ...extractedFromDestinations, ...extractedFromCuisine]);
      } catch (err: unknown) {
        if (!active) return;
        if (isAxiosError(err)) {
          setError(`Không tải được thư viện media (HTTP ${err.response?.status ?? "?"}).`);
        } else {
          setError("Không tải được thư viện media.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadMedia();

    return () => {
      active = false;
    };
  }, []);

  const images = useMemo(
    () => {
      const mediaImages = mediaItems.filter((item) => item.contentType.startsWith("image/"));
      const usedUrls = new Set(mediaImages.map((item) => item.url));
      const contentAsMedia = contentImages
        .filter((item) => !usedUrls.has(item.imageUrl))
        .map((item) => ({
          id: item.id,
          url: item.imageUrl,
          fileName: `${item.source}: ${item.title}`,
          sizeBytes: 0,
          contentType: "image/content",
          createdAt: new Date().toISOString(),
        }));
      return [...mediaImages, ...contentAsMedia];
    },
    [mediaItems, contentImages]
  );

  const videos = useMemo(
    () => mediaItems.filter((item) => item.contentType.startsWith("video/")),
    [mediaItems]
  );

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-teal-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Thư Viện Ảnh & Video</h1>
        <p className="text-teal-100 max-w-2xl mx-auto px-4">Khám phá vẻ đẹp của Sa Đéc qua những góc máy đầy nghệ thuật.</p>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab("images")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
              activeTab === "images" 
                ? "bg-teal-600 text-white shadow-md" 
                : "bg-white text-stone-600 hover:bg-teal-50"
            }`}
          >
            <ImageIcon size={20} /> Hình Ảnh
          </button>
          <button 
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
              activeTab === "videos" 
                ? "bg-teal-600 text-white shadow-md" 
                : "bg-white text-stone-600 hover:bg-teal-50"
            }`}
          >
            <Play size={20} /> Video
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500">
            Đang tải thư viện...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error && activeTab === "images" ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer bg-stone-200"
              >
                <img 
                  src={item.url}
                  alt={item.fileName}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <ImageIcon size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}

        {!loading && !error && activeTab === "videos" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, i) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video mb-4 bg-stone-900">
                  <video className="w-full h-full object-cover" controls preload="metadata" playsInline>
                    <source src={video.url} type={video.contentType} />
                    Trình duyệt không hỗ trợ phát video.
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-teal-600 shadow-xl group-hover:scale-110 transition-transform">
                      <Play size={32} className="ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-stone-800 group-hover:text-teal-600 transition-colors line-clamp-2">{video.fileName}</h3>
              </motion.div>
            ))}
          </div>
        ) : null}

        {!loading && !error && activeTab === "images" && images.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500">
            Chưa có hình ảnh nào trong thư viện.
          </div>
        ) : null}

        {!loading && !error && activeTab === "videos" && videos.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500">
            Chưa có video nào trong thư viện.
          </div>
        ) : null}
      </div>
    </div>
  );
}
