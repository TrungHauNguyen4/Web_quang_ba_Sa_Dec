import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, Search, Trash2, Eye, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import { isAxiosError } from "axios";
import { MediaItemDto, mediaService } from "../../services/media.service";

export function AdminMedia() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaItemDto[]>([]);
  const [query, setQuery] = useState("");
  const [fileType, setFileType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await mediaService.getAll({ page: 1, pageSize: 100, q: query || undefined });
      setMediaFiles(Array.isArray(response?.items) ? response.items : []);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Ban can dang nhap bang tai khoan Admin/Editor de xem media.");
        } else {
          setError(`Khong tai duoc danh sach media (HTTP ${err.response?.status ?? "?"}).`);
        }
      } else {
        setError("Khong tai duoc danh sach media.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMediaFiles = useMemo(() => {
    if (fileType === "all") {
      return mediaFiles;
    }

    return mediaFiles.filter((file) => {
      if (fileType === "image") return file.contentType.startsWith("image/");
      if (fileType === "video") return file.contentType.startsWith("video/");
      if (fileType === "document") return file.contentType === "application/pdf";
      return true;
    });
  }, [fileType, mediaFiles]);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
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
        setError(`Tai tep that bai (HTTP ${err.response?.status ?? "?"}).`);
      } else {
        setError("Tai tep that bai.");
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
          <Upload size={18} /> {uploading ? "Dang tai len..." : "Tải tệp lên"}
        </button>
      </div>

      <input
        ref={uploadInputRef}
        type="file"
        className="hidden"
        onChange={handleUploadChange}
      />

      {/* Upload Zone */}
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

      {/* Toolbar */}
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
          <select className="flex-1 sm:flex-none border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-teal-500">
            <option>Mới nhất</option>
            <option>Cũ nhất</option>
            <option>Dung lượng lớn nhất</option>
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
          Dang tai danh sach media...
        </div>
      ) : null}

      {/* Media Grid */}
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
              
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button className="w-10 h-10 bg-white text-stone-700 hover:text-teal-600 rounded-full flex items-center justify-center shadow-lg transition-colors" title="Xem trước">
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
                <button className="w-8 h-8 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center shadow-sm transition-colors" title="Xóa">
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
          Chua co media nao trong he thong.
        </div>
      ) : null}
      
      <div className="flex justify-center mt-8">
        <button onClick={() => void loadMedia()} className="px-6 py-2.5 bg-white border border-stone-200 text-stone-600 font-medium rounded-xl hover:bg-stone-50 transition-colors shadow-sm">
          Tải lại
        </button>
      </div>
    </div>
  );
}
