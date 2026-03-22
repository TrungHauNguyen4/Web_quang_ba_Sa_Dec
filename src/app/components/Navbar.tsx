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
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-green-700">
          <span className="text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 8.25 3c1.804 0 3.56.71 4.75 1.95A6.73 6.73 0 0117.75 3c3.536 0 6 2.322 6 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span>Sa Đéc</span>
            <span className="text-xs font-medium uppercase tracking-[0.24em] text-emerald-500/80">
              Tourism Portal
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
            to="/ban-do"
            className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
          >
            Lên lịch trình
          </Link>
          <Link
            to="/lien-he"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600"
          >
            Tư vấn nhanh <ArrowRight size={16} />
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
            <div className="mb-4 rounded-[1.5rem] bg-gradient-to-br from-emerald-900 via-emerald-700 to-orange-500 px-5 py-4 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">Khám phá nhanh</p>
              <p className="mt-2 text-lg font-semibold">Chọn điểm đến, món ngon hoặc lịch trình phù hợp.</p>
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
                to="/ban-do"
                className="rounded-full border border-emerald-200 px-4 py-3 text-center text-sm font-semibold text-emerald-700"
              >
                Xem bản đồ
              </Link>
              <Link
                to="/lien-he"
                className="rounded-full bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white"
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
