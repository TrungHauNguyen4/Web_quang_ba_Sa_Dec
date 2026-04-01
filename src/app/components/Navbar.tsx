import { useEffect, useState } from "react";
import { Menu, X, Home, Search, Facebook, Youtube } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import { publicNavigation } from "../config/navigation";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-300 bg-[#f5f5f5] shadow-sm">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 px-3 md:px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-slate-900">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flag_of_Vietnam.svg/120px-Flag_of_Vietnam.svg.png"
              alt="Logo"
              className="h-7 w-10 rounded object-cover"
            />
            <span className="hidden text-sm font-extrabold tracking-wide text-sky-700 md:block">PHƯỜNG SA ĐÉC PORTAL</span>
          </Link>
          <button
            className="hidden rounded p-1 text-slate-700 transition-colors hover:bg-slate-200 lg:inline-flex"
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>
          <Link
            to="/"
            className="hidden rounded p-1 text-slate-700 transition-colors hover:bg-slate-200 lg:inline-flex"
            aria-label="Home"
          >
            <Home size={18} />
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {publicNavigation.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `px-2 py-1 text-[14px] font-bold transition-colors xl:px-3 ${
                  isActive ? "text-sky-700" : "text-slate-800 hover:text-sky-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button className="rounded bg-sky-500/10 p-1 text-sky-600 hover:bg-sky-500/20" aria-label="Zalo">
            Z
          </button>
          <button className="rounded bg-red-500/10 p-1 text-red-600 hover:bg-red-500/20" aria-label="Youtube">
            <Youtube size={16} />
          </button>
          <button className="rounded bg-blue-500/10 p-1 text-blue-700 hover:bg-blue-500/20" aria-label="Facebook">
            <Facebook size={16} />
          </button>
          <button className="rounded bg-slate-500/10 p-1 text-slate-700 hover:bg-slate-500/20" aria-label="Search">
            <Search size={16} />
          </button>
        </div>

        <button
          className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition-colors hover:text-blue-700 lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="absolute inset-x-0 top-16 h-[calc(100vh-4rem)] bg-slate-950/30 backdrop-blur-[2px]" />
          <nav
            id="mobile-navigation"
            className="absolute inset-x-3 top-20 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl"
          >
            <div className="mb-3 rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white">
              Cổng thông tin điện tử - menu nhanh
            </div>

            <div className="flex flex-col gap-2">
              {publicNavigation.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === "/"}
                    className={`rounded-lg border px-4 py-3 transition-all ${
                      isActive
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-transparent bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="font-semibold">{link.label}</div>
                    <div className="mt-1 text-sm text-slate-500">{link.description}</div>
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}



