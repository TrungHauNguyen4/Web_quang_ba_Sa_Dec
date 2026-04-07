import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import type { AxiosError } from "axios";
import { authService } from "../../services/auth.service";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialEmail = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const tokenMissing = useMemo(() => !token, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (tokenMissing) {
      setError("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (!email.trim() || !newPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword({
        email: email.trim(),
        token,
        newPassword,
      });
      setMessage(res?.message || "Đặt lại mật khẩu thành công.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError?.response?.data?.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Đặt lại mật khẩu</h1>
            <p className="text-slate-500 mt-2 text-sm">Nhập mật khẩu mới để hoàn tất</p>
          </div>

          {error ? (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center justify-center mb-4">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100 flex items-center justify-center mb-4">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="resetEmail" className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="resetEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-slate-50 focus:bg-white"
                placeholder="email@domain.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-slate-50 focus:bg-white pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-slate-50 focus:bg-white"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-700/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Đang xử lý...
                </>
              ) : (
                "Đặt lại mật khẩu"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-sm text-slate-500 hover:text-blue-700 transition-colors"
            >
              Quay lại đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
