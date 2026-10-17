import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Plus,
  User,
  Settings,
  LogOut,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { Dropdown, DropdownDivider, DropdownItem } from "../ui/Dropdown";

function Navbar({ onToggleSidebar, onToggleMobileMenu, isCollapsed = false }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleToggle = onToggleSidebar || onToggleMobileMenu;

  const {
    notifications,
    unreadCount,
    loading: loadingNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification: apiDeleteNotification,
  } = useNotifications();

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await apiDeleteNotification(id);
      toast.success("Notification removed");
    } catch {
      toast.error("Failed to remove notification");
    }
  };

  const handleNotificationClick = async (item) => {
    try {
      if (!item.read) {
        await markAsRead(item._id);
      }
      if (item.category === "budget") {
        navigate("/budgets");
      } else if (item.category === "transaction") {
        navigate("/transactions");
      } else if (item.category === "split") {
        navigate("/split-expenses");
      } else {
        navigate("/notifications");
      }
    } catch {
      navigate("/notifications");
    }
  };

  const getPageInfo = () => {
    if (pathname.startsWith("/notifications")) {
      return {
        title: "Notifications",
        subtitle: "Stay informed about your spending, budgets, and financial activity.",
      };
    }
    if (pathname === "/" || pathname === "/dashboard") {
      return {
        title: "Financial Dashboard",
        subtitle: "Real-time liquidity, income, expenses, and portfolio metrics.",
      };
    }
    if (pathname.startsWith("/transactions/add")) {
      return {
        title: "Record Transaction",
        subtitle: "Add a new revenue or expenditure entry to your ledger.",
      };
    }
    if (pathname.startsWith("/transactions/edit")) {
      return {
        title: "Edit Transaction",
        subtitle: "Update transaction details, accounts, or category tags.",
      };
    }
    if (pathname.startsWith("/transactions")) {
      return {
        title: "Transactions Ledger",
        subtitle: "Inspect, filter, search, and manage all your historical cash flows.",
      };
    }
    if (pathname.startsWith("/categories")) {
      return {
        title: "Budget Categories",
        subtitle: "Organize and monitor allocations across expenditure groups.",
      };
    }
    if (pathname.startsWith("/budgets")) {
      return {
        title: "Budgets & Spending Limits",
        subtitle: "Weekly and monthly expenditure caps with threshold alarms.",
      };
    }
    if (pathname.startsWith("/analytics")) {
      return {
        title: "Financial Analytics",
        subtitle: "Cash flow trends, savings rates, and segment distribution charts.",
      };
    }
    if (pathname.startsWith("/ai-assistant")) {
      return {
        title: "AI Financial Assistant",
        subtitle: "Conversational intelligence powered by Google Gemini, grounded in your ledger.",
      };
    }
    if (pathname.startsWith("/split-expenses")) {
      return {
        title: "Split Expenses",
        subtitle: "Settle shared expenditures, split balances, and manage IOUs.",
      };
    }
    if (pathname.startsWith("/profile")) {
      return {
        title: "Account Profile",
        subtitle: "Personal information, monthly income targets, and preferences.",
      };
    }
    if (pathname.startsWith("/settings")) {
      return {
        title: "System Settings",
        subtitle: "Authentication security, notification preferences, and system parameters.",
      };
    }

    return {
      title: "ExpenseFlow",
      subtitle: "Personal fintech and expense management platform.",
    };
  };

  const pageInfo = getPageInfo();

  return (
    <header className="sticky top-0 z-30 min-h-[76px] sm:min-h-[82px] shrink-0 flex items-center justify-between border-b border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] px-6 py-3 sm:py-3.5 shadow-xs transition-colors duration-200">
      {/* Left: Hamburger Toggle & Page Title */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        {/* Functional Hamburger Menu Button (Three Horizontal Lines ☰) */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Toggle sidebar"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] text-[#102A2A] dark:text-[#F8FAFC] transition-all duration-150 hover:bg-[#E8E7DE] dark:hover:bg-[#162447] hover:border-[#D5D3C8] dark:hover:border-[#2E4369] shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#087F68]/30 active:scale-95 shadow-xs"
        >
          <Menu size={20} className="text-[#102A2A] dark:text-[#F8FAFC]" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center text-[11px] font-semibold uppercase tracking-wider text-[#087F68] dark:text-[#00D09C] bg-[#087F68]/10 dark:bg-[#087F68]/20 px-2 py-0.5 rounded-md">
              ExpenseFlow
            </span>
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#102A2A] dark:text-[#F8FAFC] truncate">
              {pageInfo.title}
            </span>
          </div>
          <p className="hidden md:block text-xs text-[#66736E] dark:text-[#94A3B8] font-medium leading-tight truncate mt-0.5">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Action, Notifications, Profile Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* Quick Add Transaction Button */}
        <Link
          to="/transactions/add"
          className="hidden sm:inline-flex h-11 items-center gap-2 rounded-xl bg-[#104E42] hover:bg-[#176453] text-white px-4 text-xs sm:text-sm font-semibold shadow-sm transition-all duration-150 active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>Add Transaction</span>
        </Link>

        {/* Notifications Dropdown */}
        <Dropdown
          align="right"
          contentClassName="w-80 sm:w-96 p-2 bg-[#FFFDF8] dark:bg-[#162447] border border-[#E8E7DE] dark:border-[#1E2D4A] shadow-xl"
          trigger={({ isOpen }) => (
            <button
              type="button"
              aria-label="View notifications"
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
                isOpen
                  ? "border-[#104E42] dark:border-[#00D09C] bg-[#104E42]/10 dark:bg-[#00D09C]/15 text-[#104E42] dark:text-[#00D09C]"
                  : "border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] text-[#66736E] dark:text-[#94A3B8] hover:border-[#D5D3C8] dark:hover:border-[#2E4369] hover:bg-[#F8F7F0] dark:hover:bg-[#162447] hover:text-[#102A2A] dark:hover:text-[#F8FAFC]"
              }`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D99016] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D99016]" />
                </span>
              )}
            </button>
          )}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#E8E7DE] dark:border-[#1E2D4A]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#102A2A] dark:text-[#F8FAFC]">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#D99016]/15 px-2.5 py-0.5 text-xs font-semibold text-[#D99016]">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllRead();
                }}
                className="text-xs text-[#087F68] dark:text-[#00D09C] hover:text-[#104E42] dark:hover:text-emerald-300 transition font-medium cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#E8E7DE]/50 py-1">
            {loadingNotifications && notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#66736E]">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center px-4">
                <CheckCircle2 size={24} className="mx-auto text-[#087F68]/70 mb-2" />
                <p className="text-xs font-medium text-[#102A2A]">All Caught Up!</p>
                <p className="text-xs text-[#66736E] mt-0.5">
                  No active budget alerts or shared bill notifications.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !item.read;
                let Icon = Bell;
                let iconColor = "bg-[#104E42]/10 text-[#104E42]";

                if (item.type === "danger") {
                  Icon = AlertCircle;
                  iconColor = "bg-[#D9573B]/10 text-[#D9573B]";
                } else if (item.type === "warning") {
                  Icon = AlertTriangle;
                  iconColor = "bg-[#E69A20]/15 text-[#E69A20]";
                } else if (item.type === "success") {
                  Icon = CheckCircle2;
                  iconColor = "bg-[#3F8F46]/10 text-[#3F8F46]";
                } else if (item.category === "split") {
                  Icon = Sparkles;
                  iconColor = "bg-[#D99016]/15 text-[#D99016]";
                }

                const timeStr = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now";

                return (
                  <div
                    key={item._id}
                    onClick={() => handleNotificationClick(item)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition cursor-pointer group ${
                      isUnread
                        ? "bg-[#F8F7F0] border-l-2 border-[#D99016]"
                        : "opacity-80 hover:opacity-100"
                    } hover:bg-[#F8F7F0]`}
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconColor}`}
                    >
                      <Icon size={14} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-semibold ${isUnread ? "text-[#102A2A]" : "text-[#66736E]"}`}>
                          {item.title}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteNotification(e, item._id)}
                          className="opacity-0 group-hover:opacity-100 text-[#66736E] hover:text-[#D9573B] transition p-0.5"
                          title="Dismiss"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <p className="mt-0.5 text-xs text-[#66736E] leading-relaxed">
                        {item.message}
                      </p>

                      <span className="mt-1 block text-xs text-[#66736E] font-mono">
                        {timeStr}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-[#E8E7DE] flex items-center justify-between px-2 text-xs">
            <Link
              to="/notifications"
              className="font-semibold text-[#087F68] hover:text-[#104E42] transition inline-flex items-center gap-1"
            >
              <span>View all notifications</span>
              <span>→</span>
            </Link>
            <Link
              to="/settings"
              className="font-medium text-[#66736E] hover:text-[#102A2A] transition"
            >
              Settings
            </Link>
          </div>
        </Dropdown>

        {/* User Profile Dropdown */}
        <Dropdown
          align="right"
          contentClassName="w-64 p-2 bg-[#FFFDF8] dark:bg-[#162447] border border-[#E8E7DE] dark:border-[#1E2D4A] shadow-xl"
          trigger={({ isOpen }) => (
            <button
              type="button"
              className={`flex h-11 items-center gap-3 rounded-xl border px-2.5 sm:px-3 py-1.5 transition-all duration-200 cursor-pointer ${
                isOpen
                  ? "border-[#104E42] dark:border-[#00D09C] bg-[#F8F7F0] dark:bg-[#162447]"
                  : "border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] hover:border-[#D5D3C8] dark:hover:border-[#2E4369] hover:bg-[#F8F7F0] dark:hover:bg-[#162447]"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#104E42] dark:bg-[#070D1E] font-bold text-[#D99016] dark:text-[#00D09C] text-xs border border-[#D99016]/30 dark:border-[#00D09C]/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="hidden sm:block text-left min-w-0">
                <p className="truncate text-xs font-semibold text-[#102A2A] dark:text-[#F8FAFC] max-w-[110px]">
                  {user?.name || "Member"}
                </p>
                <p className="truncate text-xs text-[#66736E] dark:text-[#94A3B8] max-w-[110px]">
                  {user?.email || "Signed in"}
                </p>
              </div>

              <ChevronDown size={14} className="text-[#66736E] dark:text-[#94A3B8] hidden sm:block" />
            </button>
          )}
        >
          {/* User Details Header */}
          <div className="px-3 py-2 border-b border-[#E8E7DE] dark:border-[#1E2D4A]">
            <p className="text-xs font-bold text-[#102A2A] dark:text-[#F8FAFC] truncate">
              {user?.name || "Account User"}
            </p>
            <p className="text-xs text-[#66736E] dark:text-[#94A3B8] truncate">{user?.email}</p>
            <span className="mt-1.5 inline-block rounded-md border border-[#087F68]/30 dark:border-[#00D09C]/40 bg-[#087F68]/10 dark:bg-[#00D09C]/20 px-2 py-0.5 text-xs font-mono font-medium text-[#087F68] dark:text-[#00D09C]">
              Fintech Tier: Pro
            </span>
          </div>

          <div className="py-1">
            <DropdownItem
              icon={User}
              onClick={() => navigate("/profile")}
            >
              My Profile
            </DropdownItem>
            <DropdownItem
              icon={Settings}
              onClick={() => navigate("/settings")}
            >
              System Settings
            </DropdownItem>
          </div>

          <DropdownDivider />

          <DropdownItem
            icon={LogOut}
            danger={true}
            onClick={() => logout()}
          >
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}

export default Navbar;