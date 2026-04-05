import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard,
  MapPin,
  Utensils,
  Newspaper,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ShieldCheck,
  Landmark,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminSidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isMobile, isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Trung tâm điều hành", icon: LayoutDashboard, path: "/admin" },
    { name: "Quản lý địa danh", icon: MapPin, path: "/admin/destinations" },
    { name: "Quản lý ẩm thực", icon: Utensils, path: "/admin/cuisine" },
    { name: "Quản lý tin tức", icon: Newspaper, path: "/admin/news" },
    { name: "Hồ sơ hành chính", icon: FileText, path: "/admin/services" },
    { name: "Thư viện tệp", icon: ImageIcon, path: "/admin/media" },
    { name: "Duyệt bình luận", icon: MessageSquare, path: "/admin/comments" },
    { name: "Tài khoản và vai trò", icon: Users, path: "/admin/users" },
    { name: "Cấu hình hệ thống", icon: Settings, path: "/admin/settings" },
  ].filter((item) => !(item.path === "/admin/users" && user?.role !== "Admin"));

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-stone-950/35 backdrop-blur-[2px] lg:hidden"
              onClick={onClose}
            />
          )}

          <motion.aside
            initial={isMobile ? { x: -280, opacity: 0 } : { width: 0, opacity: 0 }}
            animate={isMobile ? { x: 0, opacity: 1 } : { width: 280, opacity: 1 }}
            exit={isMobile ? { x: -280, opacity: 0 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`z-40 flex shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-slate-950 text-slate-100 ${
              isMobile ? "absolute inset-y-0 left-0 w-[280px] shadow-2xl" : ""
            }`}
          >
          <div className="h-20 flex items-center px-6 border-b border-slate-800 justify-between shrink-0">
            <Link to="/" className="flex items-center gap-3 whitespace-nowrap">
              <span className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-300 flex items-center justify-center">
                <Landmark size={22} />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold tracking-[0.12em] uppercase text-slate-300">Hệ thống quản trị</span>
                <span className="block text-base font-bold text-white">UBND Phường Sa Đéc</span>
              </span>
            </Link>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white shrink-0">
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="px-4 py-4 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck size={14} />
              Chế độ quản trị cấp phường
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <ClipboardList size={14} />
              Theo dõi và xử lý nghiệp vụ một cửa
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-5 px-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em] mb-3 px-2">Danh mục</div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (isMobile) {
                        onClose();
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-900/20"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <item.icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800 shrink-0">
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-900 hover:text-red-300 rounded-xl transition-colors w-full whitespace-nowrap text-left"
            >
              <LogOut size={18} className="text-slate-500" />
              Đăng xuất
            </button>
          </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}



