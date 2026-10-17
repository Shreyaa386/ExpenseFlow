import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PlusCircle,
  BarChart3,
  User,
  X,
} from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

function MainLayout() {
  const [desktopCollapsed, setDesktopCollapsed] = useState(() => {
    try {
      return localStorage.getItem("expenseflow_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scrolling on mobile when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileMenuOpen((prev) => !prev);
    } else {
      setDesktopCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem("expenseflow_sidebar_collapsed", String(next));
        } catch (e) {
          console.error(e);
        }
        return next;
      });
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#F8F7F0] dark:bg-[#0B1329] text-[#102A2A] dark:text-[#F8FAFC] transition-colors duration-200">
      {/* Desktop Sidebar (visible on lg and up) */}
      <aside
        className={`hidden lg:flex shrink-0 flex-col z-20 border-r border-[#176453]/30 dark:border-[#1E2D4A] bg-[#104E42] dark:bg-[#070D1E] transition-all duration-300 ease-in-out ${
          desktopCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <Sidebar collapsed={desktopCollapsed} />
      </aside>

      {/* Mobile Sidebar Overlay & Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#102A2A]/40 dark:bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 flex h-full w-[85%] max-w-xs flex-col bg-[#104E42] dark:bg-[#070D1E] border-r border-[#176453]/50 dark:border-[#1E2D4A] animate-in slide-in-from-left duration-250 shadow-2xl">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation"
              className="absolute top-5 right-5 z-20 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/90 transition hover:bg-white/20 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <Sidebar
              collapsed={false}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-[#F8F7F0] dark:bg-[#0B1329] min-w-0 transition-colors duration-200">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          isCollapsed={desktopCollapsed}
        />

        {/* Scrollable Page Body with consistent 20–28px (24px) horizontal padding */}
        <main className="flex-1 overflow-y-auto px-6 py-6 sm:py-8 pb-24 lg:pb-12 bg-[#F8F7F0] dark:bg-[#0B1329] transition-colors duration-200">
          <div className="w-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Quick-Action Bar (visible only on mobile) */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#176453]/40 dark:border-[#1E2D4A] bg-[#104E42] dark:bg-[#070D1E] px-3 py-2.5 backdrop-blur-md lg:hidden shadow-lg transition-colors duration-200">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition ${
                isActive ? "text-[#D99016] dark:text-[#00D09C] font-semibold" : "text-[#D1E0DC] dark:text-[#94A3B8] hover:text-white"
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition ${
                isActive ? "text-[#D99016] font-semibold" : "text-[#D1E0DC] hover:text-white"
              }`
            }
          >
            <ArrowLeftRight size={20} />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/transactions/add"
            className="flex -mt-5 h-12 w-12 items-center justify-center rounded-full bg-[#D99016] text-white shadow-md active:scale-95 transition hover:bg-[#c48113]"
          >
            <PlusCircle size={26} />
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition ${
                isActive ? "text-[#D99016] font-semibold" : "text-[#D1E0DC] hover:text-white"
              }`
            }
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition ${
                isActive ? "text-[#D99016] font-semibold" : "text-[#D1E0DC] hover:text-white"
              }`
            }
          >
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default MainLayout;