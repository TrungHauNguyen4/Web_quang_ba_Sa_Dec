import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { useIsMobile } from "./ui/use-mobile";

export function AdminLayout() {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden font-sans text-stone-800">
      <AdminSidebar isMobile={isMobile} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar isSidebarOpen={isSidebarOpen} onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-stone-50/50 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
