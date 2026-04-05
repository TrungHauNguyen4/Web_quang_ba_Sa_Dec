import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { destinationService } from "../../services/destination.service";
import { mediaService } from "../../services/media.service";
import { PaginationControls } from "../../components/ui/PaginationControls";

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
  status: number | string;
  createdAt: string;
};

export function AdminDestinations() {
  const [items, setItems] = useState<DestinationItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<"imageUrl" | "videoUrl" | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    imageUrl: "",
    videoUrl: "",
    content: "",
    latitude: "",
    longitude: "",
    status: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await destinationService.getAllAdmin({ page, pageSize, q: query || undefined });
      setItems(Array.isArray(response?.items) ? response.items : []);
      setTotal(Number(response?.total) || 0);
      setTotalPages(Number(response?.totalPages) || 0);
    } catch {
      setError("Không tải được danh sách địa danh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [page, pageSize]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ title: "", slug: "", excerpt: "", imageUrl: "", videoUrl: "", content: "", latitude: "", longitude: "", status: 0 });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DestinationItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      imageUrl: item.imageUrl || "",
      videoUrl: item.videoUrl || "",
      content: item.content || "",
      latitude: item.latitude != null ? String(item.latitude) : "",
      longitude: item.longitude != null ? String(item.longitude) : "",
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
        excerpt: form.excerpt || undefined,
        imageUrl: form.imageUrl || undefined,
        videoUrl: form.videoUrl || undefined,
        content: form.content || undefined,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        status: form.status,
      };

      if (editingId) {
        await destinationService.update(editingId, payload);
      } else {
        await destinationService.create(payload);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setForm({ title: "", slug: "", excerpt: "", imageUrl: "", videoUrl: "", content: "", latitude: "", longitude: "", status: 0 });
      await loadData();
    } catch {
      setError(editingId ? "Cập nhật địa danh thất bại." : "Tạo địa danh thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Bạn chắc chắn muốn xóa địa danh này?");
    if (!ok) return;

    try {
      await destinationService.remove(id);
      await loadData();
    } catch {
      setError("Xóa địa danh thất bại.");
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
    if (status === 1 || status === "Published") return "Đã xuất bản";
    if (status === 2 || status === "Archived") return "Đã lưu trữ";
    return "Bản nháp";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Quản lý địa danh</h1>
          <p className="text-sm text-stone-500">Quản lý nội dung địa danh và thông tin hướng dẫn cho người dùng.</p>
        </div>
        <button onClick={handleOpenCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> Thêm địa danh mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm địa danh..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  void loadData();
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              setPage(1);
              void loadData();
            }}
            className="px-4 py-2 border border-stone-200 rounded-lg text-sm"
          >
            Tải lại
          </button>
        </div>

        {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}
        {loading ? <div className="p-4 text-sm text-stone-500">Đang tải dữ liệu...</div> : null}

        {!loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Tiêu đề</th>
                  <th className="p-4 font-semibold">Slug</th>
                  <th className="p-4 font-semibold">Tọa độ</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                  <th className="p-4 font-semibold">Ngày tạo</th>
                  <th className="p-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="p-4">
                      <div className="font-medium text-stone-800">{item.title}</div>
                      <div className="text-xs text-stone-500 mt-1 line-clamp-1">{item.excerpt || "-"}</div>
                    </td>
                    <td className="p-4 text-stone-600">{item.slug}</td>
                    <td className="p-4 text-stone-600">{item.latitude ?? "-"}, {item.longitude ?? "-"}</td>
                    <td className="p-4 text-stone-700">{statusLabel(item.status)}</td>
                    <td className="p-4 text-stone-600">{toDate(item.createdAt)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-stone-400 hover:text-amber-700 rounded-md hover:bg-amber-50" title="Chỉnh sửa">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => void handleDelete(item.id)} className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50" title="Xóa">
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
            className="border-stone-100"
          />
        ) : null}
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-stone-800">{editingId ? "Chỉnh sửa địa danh" : "Thêm địa danh mới"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-stone-400 hover:bg-stone-100 rounded-full">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Tiêu đề" className="w-full px-3 py-2 border rounded" />
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug-kebab-case" className="w-full px-3 py-2 border rounded" />
              <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Tóm tắt" className="w-full px-3 py-2 border rounded" rows={2} />
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="URL hình đại diện" className="w-full px-3 py-2 border rounded" />
              <input type="file" accept="image/*" onChange={(e) => void handleUploadMedia(e, "imageUrl")} className="w-full px-3 py-2 border rounded" />
              <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="Link YouTube/Google Drive hoặc URL video" className="w-full px-3 py-2 border rounded" />
              <input type="file" accept="video/*" onChange={(e) => void handleUploadMedia(e, "videoUrl")} className="w-full px-3 py-2 border rounded" />
              <div className="text-xs text-stone-500">Video hỗ trợ dán link YouTube, Google Drive hoặc tải tệp trực tiếp.</div>
              {uploadingField ? <div className="text-xs text-stone-500">Đang tải {uploadingField === "imageUrl" ? "ảnh" : "video"} lên thư viện tệp...</div> : null}
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Nội dung" className="w-full px-3 py-2 border rounded" rows={6} />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="Vĩ độ (Latitude) - tùy chọn" className="w-full px-3 py-2 border rounded" />
                <input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="Kinh độ (Longitude) - tùy chọn" className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="rounded border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-600">
                Không cần nhập tọa độ trực tiếp. Nút bản đồ sẽ tự mở theo tọa độ đã có hoặc tìm theo tên địa danh.
              </div>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })} className="w-full px-3 py-2 border rounded">
                <option value={0}>Bản nháp</option>
                <option value={1}>Xuất bản</option>
                <option value={2}>Lưu trữ</option>
              </select>
            </div>
            <div className="p-5 border-t border-stone-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded border">Hủy</button>
              <button disabled={saving} onClick={() => void handleSave()} className="px-5 py-2 rounded bg-green-700 text-white disabled:opacity-60">
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
