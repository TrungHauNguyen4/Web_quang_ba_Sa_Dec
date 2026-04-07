import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Loader2, ShieldCheck, X } from "lucide-react";
import type { AxiosError } from "axios";
import { authService } from "../../services/auth.service";

export function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotValue, setForgotValue] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ username, password });
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
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
            <h1 className="text-2xl font-bold text-slate-900">Đăng nhập quản trị</h1>
            <p className="text-slate-500 mt-2 text-sm">Cổng thông tin điện tử cấp phường</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center justify-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Tên đăng nhập / Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-slate-50 focus:bg-white"
                placeholder="admin@sadec.gov.vn"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-slate-50 focus:bg-white pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
                "Đăng nhập"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setForgotMessage(null);
                setForgotValue(username);
                setForgotOpen(true);
              }}
              className="text-sm text-slate-500 hover:text-blue-700 transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400">© 2026 Cổng thông tin điện tử Phường Sa Đéc. Bản quyền thuộc UBND Phường Sa Đéc.</p>
        </div>
      </div>

      {forgotOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setForgotOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Quên mật khẩu</h2>
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
                aria-label="Đóng"
                title="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500">Nhập tên đăng nhập hoặc email để nhận hướng dẫn đặt lại mật khẩu.</p>

              {forgotMessage ? (
                <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100">{forgotMessage}</div>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="forgotValue" className="text-sm font-semibold text-slate-700">
                  Tên đăng nhập / Email
                </label>
                <input
                  id="forgotValue"
                  type="text"
                  value={forgotValue}
                  onChange={(e) => setForgotValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-slate-50 focus:bg-white"
                  placeholder="admin@sadec.gov.vn"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={forgotLoading}
                onClick={async () => {
                  setForgotLoading(true);
                  setForgotMessage(null);
                  try {
                    const res = await authService.forgotPassword(forgotValue.trim());
                    setForgotMessage(res?.message || "Nếu tài khoản tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi tới email đăng ký.");
                  } catch (err) {
                    const axiosError = err as AxiosError<{ message?: string }>;
                    setForgotMessage(
                      axiosError?.response?.data?.message ||
                        "Nếu tài khoản tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi tới email đăng ký."
                    );
                  } finally {
                    setForgotLoading(false);
                  }
                }}
                className="px-6 py-2.5 rounded-lg font-medium bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-70"
              >
                {forgotLoading ? "Đang gửi..." : "Gửi"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}



