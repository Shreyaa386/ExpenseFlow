import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  BarChart3,
  Target,
  Users,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import Logo, { LogoMark } from "../common/Logo";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    exact: true,
  },
  {
    title: "Transactions",
    icon: ArrowLeftRight,
    path: "/transactions",
  },
  {
    title: "Categories",
    icon: Tags,
    path: "/categories",
  },
  {
    title: "Budgets",
    icon: Target,
    path: "/budgets",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "AI Assistant",
    icon: Sparkles,
    path: "/ai-assistant",
    badge: "Gemini",
  },
  {
    title: "Split Expenses",
    icon: Users,
    path: "/split-expenses",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar({ onNavigate, collapsed = false }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div
      className={`flex h-full w-full flex-col justify-between overflow-y-auto ${
        collapsed ? "px-2" : "px-4"
      } py-5 bg-[#104E42] dark:bg-[#070D1E] text-[#F8F7F0] dark:text-[#F8FAFC] transition-colors duration-200`}
    >
      {/* Top Branding & Nav */}
      <div className="space-y-5">
        {/* Brand */}
        <div
          className={`pt-1 pb-4 border-b border-[#176453]/60 dark:border-[#1E2D4A] ${
            collapsed ? "flex justify-center" : "px-2"
          }`}
        >
          {collapsed ? (
            <Link
              to="/"
              title="ExpenseFlow Dashboard"
              className="flex items-center justify-center transition-opacity hover:opacity-90"
            >
              <LogoMark className="h-10 w-10" />
            </Link>
          ) : (
            <Logo size="md" showTagline={true} />
          )}
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-[#A3BEB7] dark:text-[#94A3B8] mb-2.5">
              Navigation
            </p>
          )}

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasUnread = item.path === "/notifications" && unreadCount > 0;

              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  end={item.exact}
                  onClick={handleLinkClick}
                  title={item.title}
                  aria-label={item.title}
                  className={({ isActive }) =>
                    `group relative flex items-center ${
                      collapsed
                        ? "justify-center h-11 w-full"
                        : "justify-between px-3.5 py-2.5 text-xs sm:text-sm"
                    } rounded-xl font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-[#176453] dark:bg-[#111C38] text-white dark:text-[#00D09C] font-semibold shadow-sm border-l-4 border-[#D99016] dark:border-[#00D09C]"
                        : "text-[#D1E0DC] dark:text-[#94A3B8] hover:bg-[#176453]/60 dark:hover:bg-[#111C38]/60 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`flex items-center ${
                          collapsed ? "justify-center" : "gap-3"
                        }`}
                      >
                        <div className="relative flex items-center justify-center">
                          <Icon
                            size={collapsed ? 20 : 18}
                            className={`transition-colors duration-150 ${
                              isActive
                                ? "text-[#D99016] dark:text-[#00D09C]"
                                : "text-[#A3BEB7] dark:text-[#94A3B8] group-hover:text-white"
                            }`}
                          />
                          {collapsed && (item.badge || hasUnread) && (
                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#D99016] dark:bg-[#00D09C] ring-2 ring-[#104E42] dark:ring-[#070D1E]" />
                          )}
                        </div>
                        {!collapsed && <span>{item.title}</span>}
                      </div>

                      {!collapsed && (
                        <div className="flex items-center gap-1.5">
                          {hasUnread && (
                            <span className="rounded-full bg-[#D99016] dark:bg-[#087F68] px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                          {item.badge && (
                            <span className="rounded-full bg-[#104E42] dark:bg-[#070D1E] px-2.5 py-0.5 text-xs font-mono font-medium text-[#D99016] dark:text-[#00D09C] border border-[#D99016]/40 dark:border-[#00D09C]/40">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight
                            size={14}
                            className={`transition-all duration-150 ${
                              isActive
                                ? "text-[#D99016] dark:text-[#00D09C] translate-x-0 opacity-100"
                                : "opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0"
                            }`}
                          />
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Bottom User Profile & Sign Out */}
      {collapsed ? (
        <div className="pt-4 border-t border-[#176453]/60 dark:border-[#1E2D4A] flex flex-col items-center gap-2.5">
          <div
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#176453] dark:bg-[#111C38] font-bold text-[#D99016] dark:text-[#00D09C] border border-[#D99016]/30 dark:border-[#00D09C]/30 text-xs font-mono cursor-pointer"
            title={`${user?.name || "Account User"} (${user?.email || "verified member"})`}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#104E42] dark:border-[#070D1E] bg-[#3F8F46]" />
          </div>

          <button
            type="button"
            onClick={() => {
              handleLinkClick();
              logout();
            }}
            title="Sign Out"
            aria-label="Sign Out"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#176453] dark:border-[#1E2D4A] bg-transparent text-[#D1E0DC] dark:text-[#94A3B8] transition-all duration-150 hover:border-[#D9573B]/50 hover:bg-[#D9573B]/20 hover:text-white cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <div className="pt-4 border-t border-[#176453]/60 dark:border-[#1E2D4A] space-y-2.5">
          <div className="flex items-center gap-3 rounded-2xl bg-[#176453]/80 dark:bg-[#111C38] p-3 border border-[#176453] dark:border-[#1E2D4A]">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#104E42] dark:bg-[#162447] font-bold text-[#D99016] dark:text-[#00D09C] border border-[#D99016]/30 dark:border-[#00D09C]/30 text-xs font-mono">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#104E42] dark:border-[#070D1E] bg-[#3F8F46]" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="truncate text-xs font-semibold text-white">
                {user?.name || "Account User"}
              </h4>
              <p className="truncate text-xs text-[#A3BEB7] dark:text-[#94A3B8]">
                {user?.email || "verified member"}
              </p>
            </div>

            <span title="Verified Account" className="text-[#3F8F46]">
              <ShieldCheck size={16} />
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              handleLinkClick();
              logout();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#176453] dark:border-[#1E2D4A] bg-transparent py-2.5 text-xs font-medium text-[#D1E0DC] dark:text-[#94A3B8] transition-all duration-150 hover:border-[#D9573B]/50 hover:bg-[#D9573B]/20 hover:text-white cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;