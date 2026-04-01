import { Menu, Bell, Search, CalendarDays, Building2 } from "lucide-react";

interface AdminTopbarProps {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export function AdminTopbar({ isSidebarOpen, onOpenSidebar }: AdminTopbarProps) {
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
            className="pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 w-72 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <CalendarDays size={14} />
          Hệ thống trực 24/7
        </div>

        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-800">Cán bộ quản trị</div>
            <div className="text-xs text-slate-500">Vai trò: Admin</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            QT
          </div>
        </div>
      </div>
    </header>
  );
}



