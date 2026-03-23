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
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminSidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isMobile, isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Destinations", icon: MapPin, path: "/admin/destinations" },
    { name: "Cuisine", icon: Utensils, path: "/admin/cuisine" },
    { name: "News", icon: Newspaper, path: "/admin/news" },
    { name: "Services", icon: FileText, path: "/admin/services" },
    { name: "Media Library", icon: ImageIcon, path: "/admin/media" },
    { name: "Comments", icon: MessageSquare, path: "/admin/comments" },
    { name: "Users & Roles", icon: Users, path: "/admin/users" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

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
            className={`z-40 flex shrink-0 flex-col overflow-hidden border-r border-stone-200 bg-white ${
              isMobile ? "absolute inset-y-0 left-0 w-[280px] shadow-2xl" : ""
            }`}
          >
          <div className="h-20 flex items-center px-6 border-b border-stone-200 justify-between shrink-0">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-green-700 whitespace-nowrap">
              <span className="text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 8.25 3c1.804 0 3.56.71 4.75 1.95A6.73 6.73 0 0117.75 3c3.536 0 6 2.322 6 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </span>
              Sa Đéc CMS
            </Link>
            <button onClick={onClose} className="lg:hidden text-stone-500 hover:text-stone-800 shrink-0">
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 px-2">Quản trị viên</div>
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
                        ? "bg-green-50 text-green-700 font-semibold"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <item.icon size={20} className={isActive ? "text-green-600" : "text-stone-400"} />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-stone-200 shrink-0">
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 hover:text-red-600 rounded-xl transition-colors w-full whitespace-nowrap text-left"
            >
              <LogOut size={20} className="text-stone-400" />
              Đăng xuất
            </button>
          </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
