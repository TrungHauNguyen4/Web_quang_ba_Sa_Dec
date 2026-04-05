import { useEffect, useState } from "react";
import { Save, Image as ImageIcon, Facebook, Youtube, Instagram, Globe, Phone, Mail, MapPin } from "lucide-react";
import type { AxiosError } from "axios";
import { settingsService } from "../../services/settings.service";

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    siteName: "",
    slogan: "",
    seoDescription: "",
    logoUrl: "",
    contactPhone: "",
    contactEmail: "",
    contactAddress: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
  });

  const getApiErrorMessage = (fallback: string, err: unknown) => {
    const axiosError = err as AxiosError<{ message?: string }>;
    const status = axiosError?.response?.status;
    const message = axiosError?.response?.data?.message;

    if (message) {
      return message;
    }

    if (status === 401 || status === 403) {
      return "Phiên đăng nhập không hợp lệ hoặc không đủ quyền. Vui lòng đăng nhập lại bằng tài khoản quản trị.";
    }

    return fallback;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await settingsService.get();
        setForm({
          siteName: data.siteName || "",
          slogan: data.slogan || "",
          seoDescription: data.seoDescription || "",
          logoUrl: data.logoUrl || "",
          contactPhone: data.contactPhone || "",
          contactEmail: data.contactEmail || "",
          contactAddress: data.contactAddress || "",
          facebookUrl: data.facebookUrl || "",
          instagramUrl: data.instagramUrl || "",
          youtubeUrl: data.youtubeUrl || "",
        });
      } catch (err) {
        setError(getApiErrorMessage("Không tải được cấu hình hệ thống.", err));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleSave = async () => {
    if (!form.siteName.trim() || !form.contactEmail.trim()) {
      setError("Tên website và email liên hệ là bắt buộc.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await settingsService.update({
        siteName: form.siteName.trim(),
        slogan: form.slogan.trim(),
        seoDescription: form.seoDescription.trim(),
        logoUrl: form.logoUrl.trim() || null,
        contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim(),
        contactAddress: form.contactAddress.trim(),
        facebookUrl: form.facebookUrl.trim() || null,
        instagramUrl: form.instagramUrl.trim() || null,
        youtubeUrl: form.youtubeUrl.trim() || null,
      });
      setMessage("Đã lưu cấu hình thành công.");
    } catch (err) {
      setError(getApiErrorMessage("Lưu cấu hình thất bại.", err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Cấu hình hệ thống</h1>
        <p className="text-sm text-stone-500">Quản lý thông tin chung của cổng thông tin điện tử</p>
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {message ? <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}
      {loading ? <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">Đang tải cấu hình...</div> : null}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <Globe size={20} className="text-stone-400" /> Thông tin chung
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Tên website</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Khẩu hiệu</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                value={form.slogan}
                onChange={(e) => setForm({ ...form, slogan: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">Mô tả SEO</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 resize-none"
              value={form.seoDescription}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">Logo website</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
                <ImageIcon size={32} className="text-slate-400" />
              </div>
              <div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                    placeholder="URL logo"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  />
                </div>
                <p className="text-xs text-stone-500">PNG, SVG hoặc WEBP. Kích thước đề xuất 200x50px.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <Phone size={20} className="text-stone-400" /> Thông tin liên hệ
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 flex items-center gap-2"><Phone size={14} /> Số điện thoại</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 flex items-center gap-2"><Mail size={14} /> Email</label>
              <input
                type="email"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2"><MapPin size={14} /> Địa chỉ</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
              value={form.contactAddress}
              onChange={(e) => setForm({ ...form, contactAddress: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <Facebook size={20} className="text-stone-400" /> Kênh thông tin
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Facebook size={20} />
            </div>
            <input
              type="text"
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
              placeholder="Đường dẫn Facebook"
              value={form.facebookUrl}
              onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center shrink-0">
              <Instagram size={20} />
            </div>
            <input
              type="text"
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
              placeholder="Đường dẫn Instagram"
              value={form.instagramUrl}
              onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 text-slate-800 rounded-lg flex items-center justify-center shrink-0">
              <Youtube size={20} />
            </div>
            <input
              type="text"
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600"
              placeholder="Đường dẫn YouTube"
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => void handleSave()}
          disabled={loading || saving}
          className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md disabled:opacity-60"
        >
          <Save size={18} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}




