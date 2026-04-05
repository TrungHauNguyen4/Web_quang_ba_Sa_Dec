import { useEffect, useState } from "react";
import { Menu, X, Home, Search, Facebook, Youtube } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import { publicNavigation } from "../config/navigation";
import { settingsService, type SystemSettingsDto } from "../services/settings.service";

const DEFAULT_LOGO = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flag_of_Vietnam.svg/120px-Flag_of_Vietnam.svg.png";
const DEFAULT_SITE_NAME = "PHƯỜNG SA ĐÉC PORTAL";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SystemSettingsDto | null>(null);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsQuickMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const data = await settingsService.getPublic();
        if (!active) return;
        setSettings(data);
      } catch {
        if (!active) return;
        setSettings(null);
      }
    };

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-300 bg-[#f5f5f5] shadow-sm">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 px-3 md:px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-slate-900">
            <img
              src={settings?.logoUrl || DEFAULT_LOGO}
              alt="Logo"
              className="h-7 w-10 rounded object-cover"
            />
            <span className="hidden text-sm font-extrabold tracking-wide text-sky-700 md:block">
              {(settings?.siteName || DEFAULT_SITE_NAME).toUpperCase()}
            </span>
          </Link>
          <button
            className="hidden rounded p-1 text-slate-700 transition-colors hover:bg-slate-200 lg:inline-flex"
            aria-label="Menu nhanh"
            onClick={() => setIsQuickMenuOpen((prev) => !prev)}
            aria-expanded={isQuickMenuOpen}
            aria-controls="desktop-quick-navigation"
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
                `whitespace-nowrap px-2 py-1 text-[12px] font-bold transition-colors xl:px-3 xl:text-[13px] ${
                  isActive ? "text-sky-700" : "text-slate-800 hover:text-sky-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {settings?.youtubeUrl ? (
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded bg-red-500/10 p-1 text-red-600 hover:bg-red-500/20"
              aria-label="Youtube"
            >
              <Youtube size={16} />
            </a>
          ) : (
            <button className="rounded bg-red-500/10 p-1 text-red-600/60" aria-label="Youtube" disabled>
              <Youtube size={16} />
            </button>
          )}
          {settings?.facebookUrl ? (
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded bg-blue-500/10 p-1 text-blue-700 hover:bg-blue-500/20"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>
          ) : (
            <button className="rounded bg-blue-500/10 p-1 text-blue-700/60" aria-label="Facebook" disabled>
              <Facebook size={16} />
            </button>
          )}
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

      {isQuickMenuOpen ? (
        <div className="relative hidden lg:block">
          <div className="mx-auto max-w-[1240px] px-4">
            <nav
              id="desktop-quick-navigation"
              className="absolute left-4 top-1 z-50 w-[420px] rounded-xl border border-slate-200 bg-white p-4 shadow-2xl"
            >
              <div className="mb-3 rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white">
                Menu nhanh: chuyển nhanh đến các phân hệ chính
              </div>
              <div className="grid grid-cols-1 gap-2">
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
                          : "border-transparent bg-slate-50 text-slate-700 hover:border-slate-200"
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
        </div>
      ) : null}

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



