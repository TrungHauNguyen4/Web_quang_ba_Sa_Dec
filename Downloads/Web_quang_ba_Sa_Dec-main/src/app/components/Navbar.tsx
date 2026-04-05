import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import { publicNavigation } from "../config/navigation";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/88 shadow-[0_10px_30px_-24px_rgba(5,150,105,0.65)] backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-green-800">
          <span className="text-emerald-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2.25c-1.245 0-2.25 1.005-2.25 2.25v2.25H7.5c-1.245 0-2.25 1.005-2.25 2.25v6.75c0 1.245 1.005 2.25 2.25 2.25h9c1.245 0 2.25-1.005 2.25-2.25V9c0-1.245-1.005-2.25-2.25-2.25h-2.25V4.5c0-1.245-1.005-2.25-2.25-2.25z" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span>Cổng thông tin</span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600/80">
              Phường/Xã Sa Đéc
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-stone-200/80 bg-stone-50/80 p-1.5 lg:flex">
          {publicNavigation.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-stone-600 hover:text-orange-500"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/dich-vu"
            className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            Dịch vụ trực tuyến
          </Link>
          <Link
            to="/lien-he"
            className="inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-800"
          >
            Phản ánh nhanh <ArrowRight size={16} />
          </Link>
        </div>

        <button
          className="rounded-full border border-stone-200 p-2 text-stone-600 transition-colors hover:text-green-600 lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="absolute inset-x-0 top-20 h-[calc(100vh-5rem)] bg-stone-950/30 backdrop-blur-[2px]" />
          <nav
            id="mobile-navigation"
            className="absolute inset-x-4 top-24 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-2xl"
          >
            <div className="mb-4 rounded-[1.5rem] bg-gradient-to-br from-emerald-900 via-emerald-700 to-green-500 px-5 py-4 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">Truy cập nhanh</p>
              <p className="mt-2 text-lg font-semibold">Nộp hồ sơ, tra cứu và xem thông báo mới nhất.</p>
            </div>

            <div className="flex flex-col gap-2">
              {publicNavigation.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === "/"}
                    className={`rounded-2xl border px-4 py-3 transition-all ${
                      isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-transparent bg-stone-50 text-stone-700"
                    }`}
                  >
                    <div className="font-semibold">{link.label}</div>
                    <div className="mt-1 text-sm text-stone-500">{link.description}</div>
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/dich-vu"
                className="rounded-full border border-emerald-200 px-4 py-3 text-center text-sm font-semibold text-emerald-800"
              >
                Nộp hồ sơ
              </Link>
              <Link
                to="/lien-he"
                className="rounded-full bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Liên hệ ngay
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
