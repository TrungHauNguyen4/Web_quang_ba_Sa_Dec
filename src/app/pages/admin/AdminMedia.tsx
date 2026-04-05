import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, Search, Trash2, Eye, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import { isAxiosError } from "axios";
import { MediaItemDto, mediaService } from "../../services/media.service";
import { newsService } from "../../services/news.service";
import { destinationService } from "../../services/destination.service";
import { cuisineService } from "../../services/cuisine.service";
import { PaginationControls } from "../../components/ui/PaginationControls";

type LinkedContentImageItem = {
  id: string;
  title: string;
  imageUrl: string;
  source: "news" | "destination" | "cuisine";
};

export function AdminMedia() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaItemDto[]>([]);
  const [query, setQuery] = useState("");
  const [fileType, setFileType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [previewFile, setPreviewFile] = useState<MediaItemDto | null>(null);
  const [linkedContentImages, setLinkedContentImages] = useState<LinkedContentImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await mediaService.getAll({ page, pageSize, q: query || undefined });
      setMediaFiles(Array.isArray(response?.items) ? response.items : []);
      setTotal(Number(response?.total) || 0);
      setTotalPages(Number(response?.totalPages) || 0);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Bạn cần đăng nhập bằng tài khoản Admin/Editor để xem media.");
        } else {
          setError(`Không tải được danh sách media (HTTP ${err.response?.status ?? "?"}).`);
        }
      } else {
        setError("Không tải được danh sách media.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMedia();
  }, [page, pageSize]);

  useEffect(() => {
    let active = true;

    const loadLinkedContentImages = async () => {
      try {
        const [newsResponse, destinationsResponse, cuisineResponse] = await Promise.all([
          newsService.getAllAdmin({ page: 1, pageSize: 200 }),
          destinationService.getAllAdmin({ page: 1, pageSize: 200 }),
          cuisineService.getAllAdmin({ page: 1, pageSize: 200 }),
        ]);

        const newsItems = Array.isArray(newsResponse?.items) ? newsResponse.items : [];
        const destinationItems = Array.isArray(destinationsResponse?.items) ? destinationsResponse.items : [];
        const cuisineItems = Array.isArray(cuisineResponse?.items) ? cuisineResponse.items : [];
        if (!active) return;

        const fromNews: LinkedContentImageItem[] = newsItems
          .filter((item: { id?: string; title?: string; slug?: string; imageUrl?: string | null; createdAt?: string; status?: number | string }) => {
            const status = item.status;
            const isPublished = status === 1 || status === "Published";
            return Boolean(item.id && item.title && item.imageUrl && isPublished);
          })
          .map((item: { id: string; title: string; imageUrl: string }) => ({
            id: `news-${item.id}`,
            title: item.title,
            imageUrl: item.imageUrl,
            source: "news" as const,
          }));

        const fromDestinations: LinkedContentImageItem[] = destinationItems
          .filter((item: { id?: string; title?: string; imageUrl?: string | null; status?: number | string }) => {
            const status = item.status;
            const isPublished = status === 1 || status === "Published";
            return Boolean(item.id && item.title && item.imageUrl && isPublished);
          })
          .map((item: { id: string; title: string; imageUrl: string }) => ({
            id: `destination-${item.id}`,
            title: item.title,
            imageUrl: item.imageUrl,
            source: "destination" as const,
          }));

        const fromCuisine: LinkedContentImageItem[] = cuisineItems
          .filter((item: { id?: string; title?: string; imageUrl?: string | null; status?: number | string }) => {
            const status = item.status;
            const isPublished = status === 1 || status === "Published";
            return Boolean(item.id && item.title && item.imageUrl && isPublished);
          })
          .map((item: { id: string; title: string; imageUrl: string }) => ({
            id: `cuisine-${item.id}`,
            title: item.title,
            imageUrl: item.imageUrl,
            source: "cuisine" as const,
          }));

        setLinkedContentImages([...fromNews, ...fromDestinations, ...fromCuisine]);
      } catch {
        if (!active) return;
        setLinkedContentImages([]);
      }
    };

    void loadLinkedContentImages();

    return () => {
      active = false;
    };
  }, []);

  const filteredMediaFiles = useMemo(() => {
    const typed = fileType === "all"
      ? mediaFiles
      : mediaFiles.filter((file) => {
      if (fileType === "image") return file.contentType.startsWith("image/");
      if (fileType === "video") return file.contentType.startsWith("video/");
      if (fileType === "document") return file.contentType === "application/pdf";
      return true;
    });

    const sorted = [...typed];
    sorted.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "largest") {
        return b.sizeBytes - a.sizeBytes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [fileType, mediaFiles, sortBy]);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Bạn chắc chắn muốn xóa tệp này?");
    if (!ok) return;

    try {
      await mediaService.remove(id);
      await loadMedia();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(typeof message === "string" ? message : `Xóa tệp thất bại (HTTP ${err.response?.status ?? "?"}).`);
      } else {
        setError("Xóa tệp thất bại.");
      }
    }
  };

  const handleUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    setUploading(true);
    setError(null);

    try {
      await mediaService.upload(selected);
      await loadMedia();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(`Tải tệp thất bại (HTTP ${err.response?.status ?? "?"}).`);
      } else {
        setError("Tải tệp thất bại.");
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const formatDate = (dateIso: string) => {
    const date = new Date(dateIso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("vi-VN");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Thư Viện Media</h1>
          <p className="text-sm text-stone-500">Quản lý hình ảnh, video dùng trên toàn bộ website</p>
        </div>
        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Upload size={18} /> {uploading ? "Đang tải lên..." : "Tải tệp lên"}
        </button>
      </div>

      <input
        ref={uploadInputRef}
        type="file"
        className="hidden"
        onChange={handleUploadChange}
      />

      <div
        onClick={handleUploadClick}
        className="border-2 border-dashed border-stone-200 rounded-2xl p-10 text-center bg-white hover:bg-stone-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3"
      >
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center shadow-sm">
          <Upload size={28} />
        </div>
        <div>
          <h3 className="font-bold text-stone-800 text-lg">Kéo thả tệp vào đây</h3>
          <p className="text-stone-500 text-sm">hoặc click để chọn từ thiết bị (Tối đa 10MB)</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-stone-100">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm tệp..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                void loadMedia();
              }
            }}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="flex-1 sm:flex-none border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-teal-500"
          >
            <option value="all">Tất cả định dạng</option>
            <option value="image">Hình ảnh</option>
            <option value="video">Video</option>
            <option value="document">Tài liệu</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 sm:flex-none border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-teal-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="largest">Dung lượng lớn nhất</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="bg-white rounded-xl border border-stone-100 p-6 text-stone-500 text-sm">
          Đang tải danh sách media...
        </div>
      ) : null}

      {linkedContentImages.length > 0 ? (
        <section className="bg-white rounded-xl border border-stone-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-stone-800">Ảnh từ nội dung đã xuất bản toàn website</h2>
            <span className="text-xs sm:text-sm text-stone-500">{linkedContentImages.length} ảnh</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {linkedContentImages.map((item) => (
              <a
                key={item.id}
                href={item.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-xl overflow-hidden border border-stone-100 hover:border-teal-300 transition-colors"
                title={item.title}
              >
                <div className="aspect-square bg-stone-100 overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2">
                  <div className="text-xs font-medium text-stone-700 line-clamp-2">{item.title}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wide text-stone-500">
                    {item.source === "news" ? "Tin tức" : item.source === "destination" ? "Địa danh" : "Ẩm thực"}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {!loading ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredMediaFiles.map((file, i) => (
          <motion.div 
            key={file.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all"
          >
            <div className="aspect-square relative overflow-hidden bg-stone-100">
              {file.contentType.startsWith("image/") ? (
                <img src={file.url} alt={file.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : null}
              {file.contentType.startsWith("video/") ? (
                <video src={file.url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
              ) : null}
              {file.contentType === "application/pdf" ? (
                <div className="w-full h-full flex items-center justify-center text-stone-600 font-semibold bg-stone-200">
                  PDF
                </div>
              ) : null}
              
              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPreviewFile(file)}
                  className="w-10 h-10 bg-white text-stone-700 hover:text-teal-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                  title="Xem trước"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={() => handleCopy(file.url, file.id)}
                  className="w-10 h-10 bg-white text-stone-700 hover:text-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors" title="Sao chép URL"
                >
                  {copiedId === file.id ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                </button>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => void handleDelete(file.id)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center shadow-sm transition-colors"
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-stone-800 truncate" title={file.fileName}>{file.fileName}</p>
              <div className="flex justify-between items-center mt-1 text-xs text-stone-500">
                <span>{formatSize(file.sizeBytes)}</span>
                <span>{formatDate(file.createdAt)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      ) : null}

      {!loading && filteredMediaFiles.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-100 p-6 text-stone-500 text-sm">
          Chưa có media nào trong hệ thống.
        </div>
      ) : null}
      
      <div className="flex justify-center mt-8">
        <PaginationControls
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          className="w-full max-w-4xl rounded-xl border border-stone-100 bg-white"
        />
      </div>

      {previewFile ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60" onClick={() => setPreviewFile(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-stone-800 truncate">{previewFile.fileName}</h3>
              <button onClick={() => setPreviewFile(null)} className="px-3 py-1.5 rounded border text-sm">Đóng</button>
            </div>

            {previewFile.contentType.startsWith("image/") ? (
              <img src={previewFile.url} alt={previewFile.fileName} className="w-full max-h-[70vh] object-contain rounded-xl bg-stone-100" />
            ) : null}
            {previewFile.contentType.startsWith("video/") ? (
              <video src={previewFile.url} controls className="w-full max-h-[70vh] rounded-xl bg-black" />
            ) : null}
            {previewFile.contentType === "application/pdf" ? (
              <iframe src={previewFile.url} title={previewFile.fileName} className="w-full h-[70vh] rounded-xl border" />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
