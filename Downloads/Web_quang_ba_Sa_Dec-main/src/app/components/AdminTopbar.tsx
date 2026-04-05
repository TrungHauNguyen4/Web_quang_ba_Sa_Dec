import { Menu, Bell, Search } from "lucide-react";

interface AdminTopbarProps {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export function AdminTopbar({ isSidebarOpen, onOpenSidebar }: AdminTopbarProps) {
  return (
    <header className="h-20 bg-white border-b border-stone-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <button 
            onClick={onOpenSidebar}
            className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        )}
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="pl-10 pr-4 py-2 bg-stone-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500/20 w-64 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-stone-800">Admin User</div>
            <div className="text-xs text-stone-500">Super Admin</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
