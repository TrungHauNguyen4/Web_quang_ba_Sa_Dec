import { Menu, Bell, Search, CalendarDays, Building2, CheckCheck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

interface AdminTopbarProps {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export function AdminTopbar({ isSidebarOpen, onOpenSidebar }: AdminTopbarProps) {
  const [now, setNow] = useState(() => Date.now());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "app-pending",
      title: "Có hồ sơ mới cần kiểm tra",
      description: "Mở trang Quản lý dịch vụ công để xử lý hồ sơ mới.",
      link: "/admin/services",
      isRead: false,
    },
    {
      id: "news-review",
      title: "Nhắc duyệt tin tức",
      description: "Kiểm tra mục Tin tức để cập nhật bài viết mới.",
      link: "/admin/news",
      isRead: false,
    },
  ]);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!notificationRef.current) return;
      if (!notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const sessionInfo = useMemo(() => {
    const expiresAtRaw = localStorage.getItem("tokenExpiresAt");
    const issuedAtRaw = localStorage.getItem("tokenIssuedAt");

    const expiresAt = Number(expiresAtRaw || 0);
    const issuedAt = Number(issuedAtRaw || 0);
    if (!expiresAt || Number.isNaN(expiresAt)) {
      return null;
    }

    const remainMs = Math.max(0, expiresAt - now);
    const remainSec = Math.floor(remainMs / 1000);
    const minutes = Math.floor(remainSec / 60);
    const seconds = remainSec % 60;
    const totalSec = issuedAt > 0 ? Math.max(1, Math.floor((expiresAt - issuedAt) / 1000)) : 1;
    const progress = Math.max(0, Math.min(100, Math.round((remainSec / totalSec) * 100)));

    return {
      remainText: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      progress,
      almostExpired: remainSec <= 120,
    };
  }, [now]);

  const submitSearch = () => {
    const keyword = searchKeyword.trim();
    if (!keyword) {
      navigate("/admin/services");
      return;
    }
    navigate(`/admin/services?q=${encodeURIComponent(keyword)}`);
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const openNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const markAllNotificationRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const openNotificationItem = (id: string, link: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
    setIsNotificationOpen(false);
    navigate(link);
  };

  const roleLabel = useMemo(() => {
    if (!user?.role) return "Chưa phân quyền";
    if (user.role === "Admin") return "Quản trị";
    if (user.role === "Editor") return "Biên tập";
    return user.role;
  }, [user?.role]);

  const profileName = user?.displayName?.trim() || user?.username || user?.email || "Tài khoản";
  const profileInitials = useMemo(() => {
    const source = profileName.trim();
    if (!source) return "TK";
    const words = source.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return `${words[0][0] || ""}${words[words.length - 1][0] || ""}`.toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
  }, [profileName]);

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <button 
            onClick={onOpenSidebar}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        )}

        <div className="hidden xl:flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 text-slate-600 text-sm">
          <Building2 size={16} />
          UBND Phường Sa Đéc
        </div>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm hồ sơ, công dân, văn bản..." 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitSearch();
              }
            }}
            className="pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 w-72 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <CalendarDays size={14} />
          Hệ thống trực 24/7
        </div>

        {sessionInfo ? (
          <div className={`hidden lg:flex flex-col gap-1 rounded-lg border px-3 py-2 min-w-[170px] ${sessionInfo.almostExpired ? "border-amber-300 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}>
            <div className={`text-[11px] font-semibold ${sessionInfo.almostExpired ? "text-amber-700" : "text-emerald-700"}`}>
              Phiên đăng nhập còn: {sessionInfo.remainText}
            </div>
            <div className="h-1.5 rounded-full bg-white/80 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${sessionInfo.almostExpired ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${sessionInfo.progress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={openNotification}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Thông báo"
          >
            <Bell size={20} />
            {unreadCount > 0 ? <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> : null}
          </button>

          {isNotificationOpen ? (
            <div className="absolute right-0 z-30 mt-2 w-[320px] rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Thông báo quản trị</p>
                  <p className="text-xs text-slate-500">{unreadCount} chưa đọc</p>
                </div>
                <button
                  type="button"
                  onClick={markAllNotificationRead}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <CheckCheck size={14} /> Đánh dấu đã đọc
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto p-2">
                {notifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openNotificationItem(item.id, item.link)}
                    className={`mb-2 w-full rounded-lg border px-3 py-2 text-left transition-colors last:mb-0 ${item.isRead ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50"}`}
                  >
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-800">{profileName}</div>
            <div className="text-xs text-slate-500">Vai trò: {roleLabel}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {profileInitials}
          </div>
        </div>
      </div>
    </header>
  );
}



