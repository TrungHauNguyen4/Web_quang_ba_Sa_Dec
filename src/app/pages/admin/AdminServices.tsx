import { useEffect, useState } from "react";
import { Search, CheckCircle, Clock, XCircle, FileText, X, Plus, Pencil, Trash2 } from "lucide-react";
import { isAxiosError } from "axios";
import { useSearchParams } from "react-router";
import { serviceApplicationService } from "../../services/service-application.service";
import { PaginationControls } from "../../components/ui/PaginationControls";

type ServiceApplication = {
  id: string;
  serviceName: string;
  applicant: string;
  submittedAt: string;
  dueAt: string;
  status: string;
  isOverdue: boolean;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  attachmentUrls?: string[];
  updatedAt: string;
};

type ServiceFieldConfig = {
  rowId: string;
  key: string;
  label: string;
  required: boolean;
  type: "text" | "textarea" | "date";
  placeholder: string;
};

function createRowId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `row_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

type ServiceConfigItem = {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  formSchema?: {
    title?: string | null;
    hint?: string | null;
    templateUrl?: string | null;
    requiredDocuments?: string | null;
    fields: Array<{
      key: string;
      label: string;
      required: boolean;
      type: string;
      placeholder?: string | null;
    }>;
  } | null;
};

function toFieldKey(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9_\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

export function AdminServices() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<ServiceApplication[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<ServiceApplication | null>(null);
  const [nextStatus, setNextStatus] = useState("processing");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [serviceConfigs, setServiceConfigs] = useState<ServiceConfigItem[]>([]);
  const [serviceConfigLoading, setServiceConfigLoading] = useState(true);
  const [serviceConfigError, setServiceConfigError] = useState<string | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    isActive: true,
    formTitle: "",
    formHint: "",
    templateUrl: "",
    requiredDocuments: "",
    fields: [] as ServiceFieldConfig[],
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApplicationService.getAllAdmin({
        page,
        pageSize,
        q: query || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setItems(Array.isArray(response?.items) ? response.items : []);
      setTotal(Number(response?.total) || 0);
      setTotalPages(Number(response?.totalPages) || 0);
    } catch {
      setError("Không tải được danh sách hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryFromUrl = searchParams.get("q") || "";
    if (queryFromUrl !== query) {
      setQuery(queryFromUrl);
      setPage(1);
    }
  }, [searchParams, query]);

  useEffect(() => {
    void loadData();
  }, [statusFilter, page, pageSize, query]);

  const loadServiceConfigs = async () => {
    setServiceConfigLoading(true);
    setServiceConfigError(null);
    try {
      const response = await serviceApplicationService.getServicesAdmin({ page: 1, pageSize: 200 });
      setServiceConfigs(Array.isArray(response?.items) ? (response.items as ServiceConfigItem[]) : []);
    } catch {
      setServiceConfigError("Không tải được danh mục thủ tục.");
    } finally {
      setServiceConfigLoading(false);
    }
  };

  useEffect(() => {
    void loadServiceConfigs();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium w-fit"><Clock size={14} /> Chờ tiếp nhận</span>;
      case "processing":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium w-fit"><FileText size={14} /> Đang xử lý</span>;
      case "completed":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium w-fit"><CheckCircle size={14} /> Đã giải quyết thành công</span>;
      case "rejected":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium w-fit"><XCircle size={14} /> Từ chối</span>;
      default:
        return <span className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md text-xs font-medium w-fit">{status}</span>;
    }
  };

  const toDate = (value: string) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("vi-VN");
  };

  const openDetail = (app: ServiceApplication) => {
    setSelectedApp(app);
    setNextStatus(app.status || "processing");
    setNote(app.note || "");
  };

  const saveStatus = async () => {
    if (!selectedApp) return;
    try {
      await serviceApplicationService.updateStatus(selectedApp.id, nextStatus, note || undefined);
      setSelectedApp(null);
      await loadData();
    } catch {
      setError("Cập nhật trạng thái thất bại.");
    }
  };

  const markResolved = async () => {
    if (!selectedApp) return;
    try {
      await serviceApplicationService.updateStatus(selectedApp.id, "completed", note || undefined);
      setSelectedApp(null);
      await loadData();
    } catch {
      setError("Đánh dấu giải quyết thành công thất bại.");
    }
  };

  const deleteResolvedApplication = async () => {
    if (!selectedApp) return;

    const ok = window.confirm("Chỉ nên xóa khi hồ sơ đã giải quyết thành công. Bạn muốn tiếp tục?");
    if (!ok) return;

    try {
      await serviceApplicationService.removeApplication(selectedApp.id);
      setSelectedApp(null);
      await loadData();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(String(err.response?.data?.message || "Xóa hồ sơ thất bại."));
      } else {
        setError("Xóa hồ sơ thất bại.");
      }
    }
  };

  const openCreateService = () => {
    setEditingServiceId(null);
    setServiceForm({
      name: "",
      description: "",
      isActive: true,
      formTitle: "",
      formHint: "",
      templateUrl: "",
      requiredDocuments: "",
      fields: [],
    });
    setConfigModalOpen(true);
  };

  const openEditService = (item: ServiceConfigItem) => {
    setEditingServiceId(item.id);
    setServiceForm({
      name: item.name,
      description: item.description || "",
      isActive: item.isActive,
      formTitle: item.formSchema?.title || "",
      formHint: item.formSchema?.hint || "",
      templateUrl: item.formSchema?.templateUrl || "",
      requiredDocuments: item.formSchema?.requiredDocuments || "",
      fields: Array.isArray(item.formSchema?.fields)
        ? item.formSchema!.fields.map((field) => ({
            rowId: createRowId(),
            key: field.key,
            label: field.label,
            required: Boolean(field.required),
            type: (field.type === "textarea" || field.type === "date" ? field.type : "text") as "text" | "textarea" | "date",
            placeholder: field.placeholder || "",
          }))
        : [],
    });
    setConfigModalOpen(true);
  };

  const addField = () => {
    setServiceForm((prev) => ({
      ...prev,
      fields: [...prev.fields, { rowId: createRowId(), key: "", label: "", required: false, type: "text", placeholder: "" }],
    }));
  };

  const removeField = (index: number) => {
    setServiceForm((prev) => ({ ...prev, fields: prev.fields.filter((_, i) => i !== index) }));
  };

  const updateField = (index: number, patch: Partial<ServiceFieldConfig>) => {
    setServiceForm((prev) => ({
      ...prev,
      fields: prev.fields.map((field, i) => (i === index ? { ...field, ...patch } : field)),
    }));
  };

  const saveServiceConfig = async () => {
    setServiceConfigError(null);

    if (!serviceForm.name.trim()) {
      setServiceConfigError("Tên thủ tục là bắt buộc.");
      return;
    }

    if (serviceForm.description.trim().length > 2000) {
      setServiceConfigError("Mô tả thủ tục không được vượt quá 2000 ký tự.");
      return;
    }

    const normalizedFields = serviceForm.fields
      .map((f) => ({
        key: toFieldKey(f.key),
        label: f.label.trim(),
        required: f.required,
        type: f.type,
        placeholder: f.placeholder.trim() || undefined,
      }))
      .filter((f) => f.key && f.label);

    const invalidKey = normalizedFields.find((field) => !/^[a-z][a-z0-9_]{1,63}$/.test(field.key));
    if (invalidKey) {
      setServiceConfigError("Key phải bắt đầu bằng chữ cái, chỉ gồm chữ thường/số/gạch dưới và dài từ 2-64 ký tự.");
      return;
    }

    const duplicated = normalizedFields.find((field, index) => normalizedFields.findIndex((x) => x.key === field.key) !== index);
    if (duplicated) {
      setServiceConfigError(`Key bị trùng: ${duplicated.key}. Vui lòng đổi key khác nhau cho từng trường.`);
      return;
    }

    const payload = {
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim() || undefined,
      isActive: serviceForm.isActive,
      formSchema: {
        title: serviceForm.formTitle.trim() || undefined,
        hint: serviceForm.formHint.trim() || undefined,
        templateUrl: serviceForm.templateUrl.trim() || undefined,
        requiredDocuments: serviceForm.requiredDocuments.trim() || undefined,
        fields: normalizedFields,
      },
    };

    try {
      if (editingServiceId) {
        await serviceApplicationService.updateService(editingServiceId, payload);
      } else {
        await serviceApplicationService.createService(payload);
      }
      setConfigModalOpen(false);
      await loadServiceConfigs();
    } catch {
      setServiceConfigError("Lưu cấu hình thủ tục thất bại.");
    }
  };

  const removeService = async (id: string) => {
    const ok = window.confirm("Bạn chắc chắn muốn xóa thủ tục này?");
    if (!ok) return;
    try {
      await serviceApplicationService.removeService(id);
      await loadServiceConfigs();
    } catch {
      setServiceConfigError("Xóa thủ tục thất bại.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Quản lý dịch vụ hành chính</h1>
        <p className="text-sm text-stone-500">Tiếp nhận và xử lý hồ sơ trực tuyến của người dân, doanh nghiệp.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Tìm mã hồ sơ, tên người nộp..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
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
              <option value="pending">Chờ tiếp nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="rejected">Từ chối</option>
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
                  <th className="p-4 font-semibold">Mã hồ sơ</th>
                  <th className="p-4 font-semibold">Tên thủ tục</th>
                  <th className="p-4 font-semibold">Người/Tổ chức nộp</th>
                  <th className="p-4 font-semibold">Ngày nộp</th>
                  <th className="p-4 font-semibold">Hạn giải quyết</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                  <th className="p-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {items.map((app) => (
                  <tr key={app.id} className="hover:bg-stone-50/30 transition-colors">
                    <td className="p-4 font-semibold text-blue-600">{app.id}</td>
                    <td className="p-4 font-medium text-stone-800">{app.serviceName}</td>
                    <td className="p-4 text-stone-600">{app.applicant}</td>
                    <td className="p-4 text-stone-600">{toDate(app.submittedAt)}</td>
                    <td className="p-4 text-sm">
                      <div className={app.isOverdue && app.status !== "completed" && app.status !== "rejected" ? "text-red-700 font-semibold" : "text-stone-600"}>
                        {toDate(app.dueAt)}
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(app.status)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openDetail(app)} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-medium transition-colors">
                        Xử lý
                      </button>
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

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Danh mục thủ tục và biểu mẫu</h2>
            <p className="text-sm text-stone-500">Admin tự định nghĩa trường biểu mẫu cho từng dịch vụ công.</p>
          </div>
          <button onClick={openCreateService} className="px-3 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium flex items-center gap-1.5">
            <Plus size={16} /> Thêm thủ tục
          </button>
        </div>

        {serviceConfigError ? <div className="p-4 text-sm text-red-600">{serviceConfigError}</div> : null}
        {serviceConfigLoading ? <div className="p-4 text-sm text-stone-500">Đang tải danh mục thủ tục...</div> : null}

        {!serviceConfigLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Thủ tục</th>
                  <th className="p-4 font-semibold">Số trường biểu mẫu</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                  <th className="p-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {serviceConfigs.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/30">
                    <td className="p-4">
                      <div className="font-medium text-stone-800">{item.name}</div>
                      <div className="text-xs text-stone-500 mt-1">{item.description || "Không có mô tả"}</div>
                    </td>
                    <td className="p-4 text-stone-700">{item.formSchema?.fields?.length || 0}</td>
                    <td className="p-4">{item.isActive ? <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs">Đang hoạt động</span> : <span className="px-2 py-1 rounded bg-stone-100 text-stone-700 text-xs">Ngưng</span>}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEditService(item)} className="p-1.5 rounded hover:bg-blue-50 text-blue-700" title="Chỉnh sửa"><Pencil size={16} /></button>
                        <button onClick={() => void removeService(item.id)} className="p-1.5 rounded hover:bg-red-50 text-red-700" title="Xóa"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {configModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setConfigModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-stone-800">{editingServiceId ? "Chỉnh sửa biểu mẫu thủ tục" : "Thêm thủ tục và biểu mẫu"}</h3>
              <button onClick={() => setConfigModalOpen(false)} className="p-2 rounded-full hover:bg-stone-100 text-stone-500"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={serviceForm.name} onChange={(e) => setServiceForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Tên thủ tục" className="px-4 py-2.5 rounded-lg border border-stone-200" />
                <select value={serviceForm.isActive ? "1" : "0"} onChange={(e) => setServiceForm((prev) => ({ ...prev, isActive: e.target.value === "1" }))} className="px-4 py-2.5 rounded-lg border border-stone-200">
                  <option value="1">Đang hoạt động</option>
                  <option value="0">Ngưng hoạt động</option>
                </select>
              </div>

              <textarea value={serviceForm.description} onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Mô tả thủ tục" rows={2} className="w-full px-4 py-2.5 rounded-lg border border-stone-200 resize-none" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={serviceForm.formTitle} onChange={(e) => setServiceForm((prev) => ({ ...prev, formTitle: e.target.value }))} placeholder="Tiêu đề biểu mẫu" className="px-4 py-2.5 rounded-lg border border-stone-200" />
                <input value={serviceForm.formHint} onChange={(e) => setServiceForm((prev) => ({ ...prev, formHint: e.target.value }))} placeholder="Gợi ý biểu mẫu" className="px-4 py-2.5 rounded-lg border border-stone-200" />
              </div>

              <input
                value={serviceForm.templateUrl}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, templateUrl: e.target.value }))}
                placeholder="Link tải biểu mẫu (PDF/DOC)"
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200"
              />

              <textarea
                value={serviceForm.requiredDocuments}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, requiredDocuments: e.target.value }))}
                placeholder="Hồ sơ cần mang theo khi đến nộp trực tiếp (mỗi mục một dòng)"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 resize-none"
              />

              <div className="rounded-xl border border-stone-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-stone-800">Danh sách trường biểu mẫu</h4>
                  <button onClick={addField} className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-sm flex items-center gap-1"><Plus size={14} /> Thêm trường</button>
                </div>

                {serviceForm.fields.length === 0 ? <div className="text-sm text-stone-500">Chưa có trường nào. Bấm Thêm trường để cấu hình.</div> : null}

                {serviceForm.fields.map((field, index) => (
                  <div key={field.rowId} className="grid grid-cols-1 md:grid-cols-12 gap-2 border border-stone-200 rounded-lg p-3">
                    <input
                      value={field.key}
                      onChange={(e) => updateField(index, { key: toFieldKey(e.target.value) })}
                      placeholder="key, vd: so_cccd"
                      className="md:col-span-3 px-3 py-2 border rounded"
                    />
                    <input value={field.label} onChange={(e) => updateField(index, { label: e.target.value })} placeholder="Nhãn hiển thị" className="md:col-span-3 px-3 py-2 border rounded" />
                    <select value={field.type} onChange={(e) => updateField(index, { type: e.target.value as "text" | "textarea" | "date" })} className="md:col-span-2 px-3 py-2 border rounded">
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="date">Date</option>
                    </select>
                    <input value={field.placeholder} onChange={(e) => updateField(index, { placeholder: e.target.value })} placeholder="Placeholder" className="md:col-span-2 px-3 py-2 border rounded" />
                    <label className="md:col-span-1 text-xs flex items-center gap-1 px-2 py-2 border rounded">
                      <input type="checkbox" checked={field.required} onChange={(e) => updateField(index, { required: e.target.checked })} /> Bắt buộc
                    </label>
                    <button onClick={() => removeField(index)} className="md:col-span-1 px-2 py-2 rounded bg-red-50 text-red-700"><Trash2 size={14} /></button>
                  </div>
                ))}

                <div className="text-xs text-stone-500">
                  Gợi ý: key nên theo dạng snake_case, ví dụ <span className="font-semibold">so_cccd</span>, <span className="font-semibold">dia_chi_cu_tru</span>.
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-end gap-2">
              <button onClick={() => setConfigModalOpen(false)} className="px-4 py-2.5 rounded-lg border border-stone-200">Hủy</button>
              <button onClick={() => void saveServiceConfig()} className="px-4 py-2.5 rounded-lg bg-emerald-700 text-white">Lưu cấu hình</button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedApp ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setSelectedApp(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-stone-800">Chi tiết hồ sơ: {selectedApp.id}</h2>
                <p className="text-sm text-stone-500 mt-1">{selectedApp.serviceName}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="text-sm text-stone-500 mb-1">Trạng thái hiện tại</div>
                {getStatusBadge(selectedApp.status)}
                <div className="mt-2 text-sm">
                  <span className="text-stone-500">Hạn giải quyết: </span>
                  <span className={selectedApp.isOverdue && selectedApp.status !== "completed" && selectedApp.status !== "rejected" ? "text-red-700 font-semibold" : "text-stone-700 font-medium"}>
                    {toDate(selectedApp.dueAt)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-stone-500">Người nộp</div>
                  <div className="font-medium text-stone-800">{selectedApp.applicant}</div>
                </div>
                <div>
                  <div className="text-stone-500">Số điện thoại</div>
                  <div className="font-medium text-stone-800">{selectedApp.phone || "-"}</div>
                </div>
                <div>
                  <div className="text-stone-500">Email</div>
                  <div className="font-medium text-stone-800">{selectedApp.email || "-"}</div>
                </div>
                <div>
                  <div className="text-stone-500">Địa chỉ</div>
                  <div className="font-medium text-stone-800">{selectedApp.address || "-"}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-stone-500 mb-2">Tệp đính kèm</div>
                {selectedApp.attachmentUrls && selectedApp.attachmentUrls.length > 0 ? (
                  <div className="space-y-2">
                    {selectedApp.attachmentUrls.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50"
                      >
                        <span className="truncate">{url}</span>
                        <span className="ml-3 shrink-0">Mở</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-stone-200 px-3 py-2 text-sm text-stone-500">
                    Hồ sơ này không có tệp đính kèm.
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-stone-500 mb-2">Cập nhật trạng thái</div>
                <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:outline-none focus:border-blue-500 bg-white">
                  <option value="pending">Chờ tiếp nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="completed">Đã giải quyết thành công</option>
                  <option value="rejected">Từ chối</option>
                </select>
                <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="mt-3 w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:border-blue-500 bg-white resize-none" placeholder="Ghi chú..." />
                {selectedApp.status !== "completed" ? (
                  <button
                    onClick={() => void markResolved()}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    <CheckCircle size={16} /> Đánh dấu đã giải quyết thành công
                  </button>
                ) : null}
              </div>
            </div>

            <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50 rounded-b-2xl">
              {selectedApp.status === "completed" ? (
                <button onClick={() => void deleteResolvedApplication()} className="px-6 py-2.5 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
                  Xóa hồ sơ và tệp đính kèm
                </button>
              ) : null}
              <button onClick={() => setSelectedApp(null)} className="px-6 py-2.5 rounded-lg font-medium text-stone-600 hover:bg-stone-200 transition-colors">
                Đóng
              </button>
              <button onClick={() => void saveStatus()} className="px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
