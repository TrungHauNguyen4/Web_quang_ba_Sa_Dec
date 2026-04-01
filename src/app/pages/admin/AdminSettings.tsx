import { Save, Image as ImageIcon, Facebook, Twitter, Instagram, Globe, Phone, Mail, MapPin } from "lucide-react";

export function AdminSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Cấu hình hệ thống</h1>
        <p className="text-sm text-stone-500">Quản lý thông tin chung của cổng thông tin điện tử</p>
      </div>

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
              <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600" defaultValue="Cổng thông tin điện tử cấp phường" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Khẩu hiệu</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600" defaultValue="Minh bạch - Hiệu quả - Phục vụ" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">Mô tả SEO</label>
            <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 resize-none" defaultValue="Cổng thông tin điện tử cấp phường, cung cấp dịch vụ công trực tuyến, thông báo điều hành và tiếp nhận phản ánh kiến nghị."></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">Logo website</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
                <ImageIcon size={32} className="text-slate-400" />
              </div>
              <div>
                <div className="flex gap-2 mb-2">
                  <button className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">Tải ảnh mới</button>
                  <button className="px-4 py-2 border border-slate-200 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors">Xóa</button>
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
              <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600" defaultValue="0277 3861 xxx" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 flex items-center gap-2"><Mail size={14} /> Email</label>
              <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600" defaultValue="contact@sadec.gov.vn" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2"><MapPin size={14} /> Địa chỉ</label>
            <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600" defaultValue="UBND TP Sa Đéc, Phường 1, TP Sa Đéc, Phường Sa Đéc" />
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
            <input type="text" className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600" placeholder="Đường dẫn Facebook" defaultValue="https://facebook.com/sadec" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center shrink-0">
              <Instagram size={20} />
            </div>
            <input type="text" className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600" placeholder="Đường dẫn Instagram" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 text-slate-800 rounded-lg flex items-center justify-center shrink-0">
              <Twitter size={20} />
            </div>
            <input type="text" className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600" placeholder="Đường dẫn Twitter (X)" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md">
          <Save size={18} /> Lưu thay đổi
        </button>
      </div>
    </div>
  );
}




