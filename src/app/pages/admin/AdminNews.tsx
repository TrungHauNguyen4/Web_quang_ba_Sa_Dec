import { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Search, Send, Trash2, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { newsService } from "../../services/news.service";
import { mediaService } from "../../services/media.service";
import { PaginationControls } from "../../components/ui/PaginationControls";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  content?: string | null;
  status: number | string;
  publishedAt?: string | null;
  createdAt?: string | null;
};

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

export function AdminNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);
  const [uploadingField, setUploadingField] = useState<"imageUrl" | "videoUrl" | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    imageUrl: "",
    videoUrl: "",
    content: "",
    status: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await newsService.getAllAdmin({
        page,
        pageSize,
        q: query || undefined,
        status: statusFilter === "all" ? undefined : Number(statusFilter),
      });
      setItems(Array.isArray(response?.items) ? response.items : []);
      setTotal(Number(response?.total) || 0);
      setTotalPages(Number(response?.totalPages) || 0);
    } catch {
      setError("Không tải được danh sách tin tức.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [statusFilter, page, pageSize]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ title: "", slug: "", excerpt: "", category: "", imageUrl: "", videoUrl: "", content: "", status: 0 });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      category: item.category || "",
      imageUrl: item.imageUrl || "",
      videoUrl: item.videoUrl || "",
      content: item.content || "",
      status: typeof item.status === "number" ? item.status : item.status === "Published" ? 1 : item.status === "Archived" ? 2 : 0,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      setError("Tiêu đề và slug là bắt buộc.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt || null,
        category: form.category.trim() || null,
        imageUrl: form.imageUrl || null,
        videoUrl: form.videoUrl || null,
        content: form.content || null,
        status: form.status,
        publishedAt: form.status === 1 ? new Date().toISOString() : null,
      };

      if (editingId) {
        await newsService.update(editingId, payload);
      } else {
        await newsService.create(payload);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setForm({ title: "", slug: "", excerpt: "", category: "", imageUrl: "", videoUrl: "", content: "", status: 0 });
      await loadData();
    } catch {
      setError("Tạo tin tức thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (item: NewsItem) => {
    try {
      await newsService.update(item.id, {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || null,
        category: item.category || null,
        imageUrl: item.imageUrl || null,
        videoUrl: item.videoUrl || null,
        content: item.content || null,
        status: 1,
        publishedAt: new Date().toISOString(),
      });
      await loadData();
    } catch {
      setError("Xuất bản bài viết thất bại.");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Bạn chắc chắn muốn xóa tin này?");
    if (!ok) return;

    try {
      await newsService.delete(id);
      await loadData();
    } catch {
      setError("Xóa tin tức thất bại.");
    }
  };

  const handleUploadMedia = async (event: React.ChangeEvent<HTMLInputElement>, field: "imageUrl" | "videoUrl") => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    try {
      const uploaded = await mediaService.upload(file);
      setForm((prev) => ({ ...prev, [field]: uploaded?.url || prev[field] }));
    } catch {
      setError("Tải tệp lên thư viện thất bại.");
    } finally {
      setUploadingField(null);
      event.target.value = "";
    }
  };

  const toDate = (value?: string | null) => {
    if (!value) return "";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("vi-VN");
  };

  const statusLabel = (status: number | string) => {
    if (status === 1 || status === "Published") return "Đã công bố";
    if (status === 2 || status === "Archived") return "Đã lưu trữ";
    return "Bản nháp";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý tin tức</h1>
          <p className="text-sm text-slate-500">Tạo, xem trước, chỉnh sửa và xuất bản nội dung tin tức phục vụ người dân.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2"
        >
          <Plus size={18} /> Tạo bản tin mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  void loadData();
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="0">Bản nháp</option>
              <option value="1">Đã công bố</option>
              <option value="2">Đã lưu trữ</option>
            </select>
            <button
              onClick={() => {
                setPage(1);
                void loadData();
              }}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
            >
              Tải lại
            </button>
          </div>
        </div>

        {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}
        {loading ? <div className="p-4 text-sm text-slate-500">Đang tải dữ liệu...</div> : null}

        {!loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Tiêu đề</th>
                  <th className="p-4 font-semibold">Slug</th>
                  <th className="p-4 font-semibold">Ngày</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                  <th className="p-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">{item.excerpt || "-"}</div>
                    </td>
                    <td className="p-4 text-slate-600">{item.slug}</td>
                    <td className="p-4 text-slate-600">{toDate(item.publishedAt) || toDate(item.createdAt)}</td>
                    <td className="p-4 text-slate-700">{statusLabel(item.status)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
                          title="Xem trước"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-amber-700 rounded-md hover:bg-amber-50 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        {(item.status === 0 || item.status === "Draft") ? (
                          <button
                            onClick={() => void handlePublish(item)}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-md hover:bg-emerald-50 transition-colors"
                            title="Xuất bản"
                          >
                            <Send size={16} />
                          </button>
                        ) : null}
                        <button
                          onClick={() => void handleDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {!loading && items.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">Không có bài viết nào phù hợp.</div>
        ) : null}

        {!loading ? (
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
          />
        ) : null}
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">{editingId ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Tiêu đề" className="w-full px-3 py-2 border rounded" />
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug-kebab-case" className="w-full px-3 py-2 border rounded" />
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="URL hình đại diện" className="w-full px-3 py-2 border rounded" />
              <input type="file" accept="image/*" onChange={(e) => void handleUploadMedia(e, "imageUrl")} className="w-full px-3 py-2 border rounded" />
              <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="Link YouTube/Google Drive hoặc URL video" className="w-full px-3 py-2 border rounded" />
              <input type="file" accept="video/*" onChange={(e) => void handleUploadMedia(e, "videoUrl")} className="w-full px-3 py-2 border rounded" />
              <div className="text-xs text-slate-500">Video hỗ trợ dán link YouTube, Google Drive hoặc tải tệp trực tiếp.</div>
              {uploadingField ? <div className="text-xs text-slate-500">Đang tải {uploadingField === "imageUrl" ? "ảnh" : "video"} lên thư viện tệp...</div> : null}
              <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Tóm tắt" className="w-full px-3 py-2 border rounded" rows={2} />
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Danh mục (ví dụ: Thông báo)" className="w-full px-3 py-2 border rounded" maxLength={120} />
              <div>
                <div className="mb-2 text-sm font-medium text-slate-700">Nội dung (WYSIWYG)</div>
                <ReactQuill theme="snow" value={form.content} onChange={(value) => setForm({ ...form, content: value })} />
              </div>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })} className="w-full px-3 py-2 border rounded">
                <option value={0}>Bản nháp</option>
                <option value={1}>Xuất bản</option>
                <option value={2}>Lưu trữ</option>
              </select>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded border">Hủy</button>
              <button disabled={saving} onClick={() => void handleSave()} className="px-5 py-2 rounded bg-blue-700 text-white disabled:opacity-60">
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {previewItem ? (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setPreviewItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-slate-800">Xem trước bài viết</h2>
              <button onClick={() => setPreviewItem(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">{previewItem.title}</h3>
              <div className="text-sm text-slate-500">Slug: {previewItem.slug}</div>
              {previewItem.category ? <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">{previewItem.category}</div> : null}
              {previewItem.imageUrl ? (
                <img src={previewItem.imageUrl} alt={previewItem.title} className="w-full h-72 object-cover rounded-xl border" />
              ) : null}
              {previewItem.videoUrl ? (
                (() => {
                  const media = resolveVideoSource(previewItem.videoUrl || "");
                  if (media.kind === "iframe") {
                    return (
                      <iframe
                        src={media.src}
                        className="w-full aspect-video rounded-xl border"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        title={`preview-video-${previewItem.id}`}
                      />
                    );
                  }

                  return <video src={media.src} controls preload="metadata" className="w-full rounded-xl border" />;
                })()
              ) : null}
              {previewItem.excerpt ? <p className="text-slate-700 border-l-4 border-blue-200 pl-3">{previewItem.excerpt}</p> : null}
              {previewItem.content ? (
                <div className="text-slate-700 leading-7" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewItem.content) }} />
              ) : (
                <div className="whitespace-pre-line text-slate-700 leading-7">Bài viết chưa có nội dung.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
