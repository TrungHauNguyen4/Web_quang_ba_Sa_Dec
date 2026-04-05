import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { cuisineService } from "../../services/cuisine.service";
import { mediaService } from "../../services/media.service";
import { PaginationControls } from "../../components/ui/PaginationControls";

type CuisineItem = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  galleryImageUrls?: string[];
  videoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: number | string;
  createdAt: string;
};

export function AdminCuisine() {
  const [items, setItems] = useState<CuisineItem[]>([]);
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
  const [uploadingField, setUploadingField] = useState<"imageUrl" | "videoUrl" | "gallery" | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    imageUrl: "",
    galleryImageUrls: [] as string[],
    videoUrl: "",
    latitude: "",
    longitude: "",
    status: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cuisineService.getAllAdmin({
        page,
        pageSize,
        q: query || undefined,
        status: statusFilter === "all" ? undefined : Number(statusFilter),
      });
      setItems(Array.isArray(response?.items) ? response.items : []);
      setTotal(Number(response?.total) || 0);
      setTotalPages(Number(response?.totalPages) || 0);
    } catch {
      setError("Không tải được danh sách món ăn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [statusFilter, page, pageSize]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ title: "", slug: "", description: "", category: "", imageUrl: "", galleryImageUrls: [], videoUrl: "", latitude: "", longitude: "", status: 0 });
    setNewGalleryUrl("");
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CuisineItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      category: item.category || "",
      imageUrl: item.imageUrl || "",
      galleryImageUrls: Array.isArray(item.galleryImageUrls) ? item.galleryImageUrls : [],
      videoUrl: item.videoUrl || "",
      latitude: typeof item.latitude === "number" ? String(item.latitude) : "",
      longitude: typeof item.longitude === "number" ? String(item.longitude) : "",
      status: typeof item.status === "number" ? item.status : item.status === "Published" ? 1 : item.status === "Archived" ? 2 : 0,
    });
    setNewGalleryUrl("");
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
        description: form.description || undefined,
        category: form.category || undefined,
        imageUrl: form.imageUrl || undefined,
        galleryImageUrls: form.galleryImageUrls,
        videoUrl: form.videoUrl || undefined,
        latitude: form.latitude.trim() ? Number(form.latitude) : undefined,
        longitude: form.longitude.trim() ? Number(form.longitude) : undefined,
        status: form.status,
      };

      if (editingId) {
        await cuisineService.update(editingId, payload);
      } else {
        await cuisineService.create(payload);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setForm({ title: "", slug: "", description: "", category: "", imageUrl: "", galleryImageUrls: [], videoUrl: "", latitude: "", longitude: "", status: 0 });
      setNewGalleryUrl("");
      await loadData();
    } catch {
      setError(editingId ? "Cập nhật món ăn thất bại." : "Tạo món ăn thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Bạn chắc chắn muốn xóa món ăn này?");
    if (!ok) return;

    try {
      await cuisineService.remove(id);
      await loadData();
    } catch {
      setError("Xóa món ăn thất bại.");
    }
  };

  const handleUploadMedia = async (event: React.ChangeEvent<HTMLInputElement>, field: "imageUrl" | "videoUrl" | "gallery") => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    try {
      const uploaded = await mediaService.upload(file);
      if (field === "gallery") {
        setForm((prev) => ({
          ...prev,
          galleryImageUrls: uploaded?.url ? [...prev.galleryImageUrls, uploaded.url] : prev.galleryImageUrls,
        }));
      } else {
        setForm((prev) => ({ ...prev, [field]: uploaded?.url || prev[field] }));
      }
    } catch {
      setError("Tải tệp lên thư viện thất bại.");
    } finally {
      setUploadingField(null);
      event.target.value = "";
    }
  };

  const handleUploadGalleryImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploadingField("gallery");
    try {
      const uploaded = await Promise.all(files.map((file) => mediaService.upload(file)));
      setForm((prev) => ({
        ...prev,
        galleryImageUrls: [
          ...prev.galleryImageUrls,
          ...uploaded
            .map((item) => item?.url)
            .filter((url): url is string => Boolean(url)),
        ],
      }));
    } catch {
      setError("Tải ảnh bổ sung thất bại.");
    } finally {
      setUploadingField(null);
      event.target.value = "";
    }
  };

  const addGalleryImageUrl = () => {
    const url = newGalleryUrl.trim();
    if (!url) return;
    setForm((prev) => ({
      ...prev,
      galleryImageUrls: prev.galleryImageUrls.includes(url) ? prev.galleryImageUrls : [...prev.galleryImageUrls, url],
    }));
    setNewGalleryUrl("");
  };

  const removeGalleryImageUrl = (url: string) => {
    setForm((prev) => ({
      ...prev,
      galleryImageUrls: prev.galleryImageUrls.filter((item) => item !== url),
    }));
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
          <h1 className="text-2xl font-bold text-stone-800">Quản lý ẩm thực</h1>
          <p className="text-sm text-stone-500">Quản lý danh sách món ăn, đặc sản địa phương</p>
        </div>
        <button onClick={handleOpenCreate} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> Thêm món ăn
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
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
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="0">Bản nháp</option>
              <option value="1">Đã xuất bản</option>
              <option value="2">Đã lưu trữ</option>
            </select>
            <button
              onClick={() => {
                setPage(1);
                void loadData();
              }}
              className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
            >
              Tải lại
            </button>
          </div>
        </div>

        {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}
        {loading ? <div className="p-4 text-sm text-stone-500">Đang tải dữ liệu...</div> : null}

        {!loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Món ăn</th>
                  <th className="p-4 font-semibold">Phân loại</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                  <th className="p-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {items.map((food) => (
                  <tr key={food.id} className="hover:bg-stone-50/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-stone-800">{food.title}</div>
                      <div className="text-xs text-stone-500 mt-1 line-clamp-1">{food.description || "-"}</div>
                    </td>
                    <td className="p-4 text-stone-600">{food.category || "-"}</td>
                    <td className="p-4 text-stone-600">{statusLabel(food.status)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenEdit(food)} className="p-1.5 text-stone-400 hover:text-amber-700 rounded-md hover:bg-amber-50 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => void handleDelete(food.id)} className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
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
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-stone-800">{editingId ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Tên món ăn" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug-kebab-case" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Phân loại" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="URL hình đại diện" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <input type="file" accept="image/*" onChange={(e) => void handleUploadMedia(e, "imageUrl")} className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <div className="space-y-2 rounded-lg border border-stone-200 p-3">
                <div className="text-sm font-semibold text-stone-700">Ảnh bổ sung (nhiều ảnh)</div>
                <div className="flex gap-2">
                  <input
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Dán URL ảnh bổ sung"
                    className="flex-1 px-3 py-2 rounded border border-stone-200"
                  />
                  <button type="button" onClick={addGalleryImageUrl} className="px-3 py-2 rounded bg-orange-100 text-orange-800 text-sm font-semibold">
                    Thêm
                  </button>
                </div>
                <input type="file" accept="image/*" multiple onChange={(e) => void handleUploadGalleryImages(e)} className="w-full px-3 py-2 rounded border border-stone-200" />
                {form.galleryImageUrls.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {form.galleryImageUrls.map((url) => (
                      <div key={url} className="relative rounded border border-stone-200 overflow-hidden">
                        <img src={url} alt="gallery" className="h-20 w-full object-cover" />
                        <button type="button" onClick={() => removeGalleryImageUrl(url)} className="absolute top-1 right-1 bg-white/90 text-red-600 rounded px-1 text-xs">
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="Link YouTube/Google Drive hoặc URL video" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <input type="file" accept="video/*" onChange={(e) => void handleUploadMedia(e, "videoUrl")} className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <div className="text-xs text-stone-500">Video hỗ trợ dán link YouTube, Google Drive hoặc tải tệp trực tiếp.</div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="Vĩ độ (latitude) - tùy chọn" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
                <input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="Kinh độ (longitude) - tùy chọn" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-600">
                Bản đồ sẽ tự động mở theo tọa độ đã có hoặc theo tên món ăn nếu chưa có tọa độ.
              </div>
              {uploadingField ? (
                <div className="text-xs text-stone-500">
                  Đang tải {uploadingField === "videoUrl" ? "video" : uploadingField === "gallery" ? "ảnh bổ sung" : "ảnh"} lên thư viện tệp...
                </div>
              ) : null}
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-stone-200" placeholder="Mô tả" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg border border-stone-200">
                <option value={0}>Bản nháp</option>
                <option value={1}>Xuất bản</option>
                <option value={2}>Lưu trữ</option>
              </select>
            </div>

            <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50 rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg font-medium text-stone-600 hover:bg-stone-200">Hủy</button>
              <button disabled={saving} onClick={() => void handleSave()} className="px-6 py-2.5 rounded-lg font-medium bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60">
                {saving ? "Đang lưu..." : "Lưu món ăn"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
