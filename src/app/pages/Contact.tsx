import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { feedbackService } from "../services/feedback.service";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function allowPhoneControlKey(key: string): boolean {
  return ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(key);
}

export function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();
    const content = form.content.trim();

    if (!fullName || !email || !phone || !address || !content) {
      setError("Vui lòng nhập đầy đủ Họ tên, Email, Số điện thoại, Địa chỉ và Nội dung.");
      return;
    }

    if (fullName.length < 2 || fullName.length > 200) {
      setError("Họ và tên phải từ 2 đến 200 ký tự.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email không đúng định dạng.");
      return;
    }

    if (!/^\d{8,15}$/.test(phone)) {
      setError("Số điện thoại chỉ được chứa chữ số và có độ dài từ 8 đến 15 số.");
      return;
    }

    if (address.length > 500) {
      setError("Địa chỉ không được vượt quá 500 ký tự.");
      return;
    }

    if (content.length < 10 || content.length > 3000) {
      setError("Nội dung phản ánh phải từ 10 đến 3000 ký tự.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await feedbackService.submit({
        fullName,
        email,
        phone,
        address,
        content,
      });

      setMessage(`Gửi thành công. Mã tiếp nhận: ${result.ticketId}`);
      setForm({ fullName: "", email: "", phone: "", address: "", content: "" });
    } catch {
      setError("Gửi phản ánh thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-100 min-h-screen pb-20">
      <div className="bg-slate-900 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1920" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Liên hệ và hỗ trợ</h1>
          <p className="text-slate-300 max-w-2xl mx-auto px-4">Tiếp nhận phản ánh, kiến nghị và hướng dẫn thủ tục hành chính cho người dân.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Thông tin cơ quan</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Địa chỉ</h3>
                    <p className="text-slate-600 mt-1">UBND Phường Sa Đéc,<br />Đường Trần Phú, khu vực trung tâm,<br />TP Sa Đéc</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-50 text-cyan-700 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Tổng đài</h3>
                    <p className="text-slate-600 mt-1">0277 3861 xxx<br />0277 3862 xxx</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Email</h3>
                    <p className="text-slate-600 mt-1">contact@sadec.gov.vn<br />motcua@sadec.gov.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Giờ làm việc</h3>
                    <p className="text-slate-600 mt-1">Sáng: 07:30 - 11:30<br />Chiều: 13:30 - 17:00<br />Từ thứ 2 đến thứ 6</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-2/3 space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Gửi phản ánh kiến nghị</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Họ và tên *</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      maxLength={200}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      maxLength={200}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Số điện thoại *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onKeyDown={(e) => {
                      if (allowPhoneControlKey(e.key) || /^\d$/.test(e.key)) {
                        return;
                      }
                      e.preventDefault();
                    }}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 15);
                      setForm((prev) => ({ ...prev, phone: onlyDigits }));
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Địa chỉ *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50"
                    placeholder="Nhập địa chỉ"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nội dung *</label>
                  <textarea
                    rows={5}
                    value={form.content}
                    onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                    maxLength={3000}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 resize-none"
                    placeholder="Nhập nội dung phản ánh/kiến nghị..."
                  ></textarea>
                </div>
                {error ? <div className="text-sm text-red-700">{error}</div> : null}
                {message ? <div className="text-sm text-emerald-700">{message}</div> : null}
                <button disabled={submitting} type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60">
                  <Send size={18} /> {submitting ? "Đang gửi..." : "Gửi phản ánh"}
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden h-80 relative">
              <iframe
                title="Google Maps - UBND Phường Sa Đéc"
                src="https://www.google.com/maps?q=UBND%20Ph%C6%B0%E1%BB%9Dng%20Sa%20%C4%90%C3%A9c%2C%20%C4%90%E1%BB%93ng%20Th%C3%A1p&output=embed"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}



