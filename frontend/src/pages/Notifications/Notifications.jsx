import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Inbox,
  Search,
  X,
  CheckCheck,
  Trash2,
  ArrowRight,
  RefreshCw,
  Clock,
  Target,
  ArrowLeftRight,
  Sparkles,
  Info,
  Check,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";

import Card, { CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useNotifications } from "../../context/NotificationContext";
import { checkBudgetAlerts } from "../../services/notificationService";

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    counts,
    loading,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  // Active filter tab: "all" | "unread" | "budget" | "transaction" | "system"
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Search Notifications in memory or via context
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Tab filter
      if (activeTab === "unread" && item.read) return false;
      if (activeTab === "budget" && item.category !== "budget") return false;
      if (activeTab === "transaction" && item.category !== "transaction")
        return false;
      if (activeTab === "system" && item.category !== "system") return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const msgMatch = item.message?.toLowerCase().includes(q);
        const budgetMatch = item.metadata?.budgetName
          ?.toLowerCase()
          .includes(q);
        const categoryMatch = item.metadata?.categoryName
          ?.toLowerCase()
          .includes(q);
        return titleMatch || msgMatch || budgetMatch || categoryMatch;
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  // Handle Mark All As Read
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  // Handle Clear All Confirmation
  const handleConfirmClearAll = async () => {
    try {
      setClearing(true);
      await clearAll();
      setIsClearModalOpen(false);
      toast.success("All notifications cleared");
    } catch {
      toast.error("Failed to clear notifications");
    } finally {
      setClearing(false);
    }
  };

  // Handle On-Demand Budget Threshold Check
  const handleCheckAlerts = async () => {
    try {
      setRefreshing(true);
      await checkBudgetAlerts();
      await fetchNotifications();
      toast.success("Budget thresholds evaluated", { icon: "📊" });
    } catch {
      toast.error("Failed to refresh alerts");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle Individual Notification Click (mark as read + navigate)
  const handleCardClick = async (item) => {
    if (!item.read) {
      try {
        await markAsRead(item._id);
      } catch (e) {
        console.error(e);
      }
    }

    if (item.category === "budget") {
      navigate("/budgets");
    } else if (item.category === "transaction") {
      navigate("/transactions");
    } else if (item.category === "split") {
      navigate("/split-expenses");
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Page Header with Title, Subtitle, & Global Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A2A] dark:text-[#F8FAFC]">
            Notifications
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#66736E] dark:text-[#94A3B8] font-medium leading-relaxed">
            Stay informed about your spending, budgets, and financial activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Refresh / Check Alerts button */}
          <button
            type="button"
            onClick={handleCheckAlerts}
            disabled={refreshing}
            title="Scan active budgets and re-evaluate threshold alerts"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] px-3.5 text-xs sm:text-sm font-semibold text-[#102A2A] dark:text-[#F8FAFC] hover:bg-[#F8F7F0] dark:hover:bg-[#162447] hover:border-[#D5D3C8] dark:hover:border-[#2D3F66] transition-all duration-150 cursor-pointer shadow-xs active:scale-95 disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={`text-[#087F68] dark:text-[#00D09C] ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Check Alerts</span>
          </button>

          {/* Mark All as Read button */}
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] px-3.5 text-xs sm:text-sm font-semibold text-[#102A2A] dark:text-[#F8FAFC] hover:bg-[#F8F7F0] dark:hover:bg-[#162447] hover:border-[#D5D3C8] dark:hover:border-[#2D3F66] transition-all duration-150 cursor-pointer shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCheck size={16} className="text-[#087F68] dark:text-[#00D09C]" />
            <span>Mark all as read</span>
          </button>

          {/* Clear All button */}
          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            disabled={notifications.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D9573B]/25 dark:border-[#F87171]/30 bg-[#D9573B]/10 dark:bg-[#F87171]/15 px-3.5 text-xs sm:text-sm font-semibold text-[#D9573B] dark:text-[#F87171] hover:bg-[#D9573B]/20 dark:hover:bg-[#F87171]/25 transition-all duration-150 cursor-pointer shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={15} />
            <span>Clear all</span>
          </button>
        </div>
      </div>

      {/* 2. Four Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: All Notifications */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">
              All Notifications
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#104E42]/10 dark:bg-[#00D09C]/15 text-[#104E42] dark:text-[#00D09C]">
              <Bell size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#102A2A] dark:text-[#F8FAFC] tracking-tight">
            {counts.all}
          </p>
          <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8] font-medium">
            Total activity alerts logged
          </p>
        </Card>

        {/* Card 2: Unread */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">
              Unread
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087F68]/15 dark:bg-[#00D09C]/20 text-[#087F68] dark:text-[#00D09C]">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#087F68] dark:text-[#00D09C] tracking-tight">
            {counts.unread}
          </p>
          <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8] font-medium">
            Awaiting your review
          </p>
        </Card>

        {/* Card 3: Budget Warnings (75% - 90%) */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">
              Budget Warnings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCF5E5] dark:bg-[#FBBF24]/15 text-[#D99016] dark:text-[#FBBF24]">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#D99016] dark:text-[#FBBF24] tracking-tight">
            {counts.budgetWarnings}
          </p>
          <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8] font-medium">
            Approaching spending thresholds
          </p>
        </Card>

        {/* Card 4: Budget Exceeded (100%+) */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">
              Budget Exceeded
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDF0EB] dark:bg-[#F87171]/15 text-[#D9573B] dark:text-[#F87171]">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#D9573B] dark:text-[#F87171] tracking-tight">
            {counts.budgetExceeded}
          </p>
          <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8] font-medium">
            Limits crossed this period
          </p>
        </Card>
      </div>

      {/* 3. Search and Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2 sm:p-2.5 rounded-2xl bg-[#FFFDF8] dark:bg-[#111C38] border border-[#E8E7DE] dark:border-[#1E2D4A] shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All", count: counts.all },
            { id: "unread", label: "Unread", count: counts.unread },
            { id: "budget", label: "Budget Alerts", count: counts.budget },
            {
              id: "transaction",
              label: "Transactions",
              count: counts.transaction,
            },
            { id: "system", label: "System", count: counts.system },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#104E42] text-white dark:bg-[#00D09C] dark:text-[#060D1E] shadow-xs"
                    : "text-[#66736E] dark:text-[#94A3B8] hover:text-[#102A2A] dark:hover:text-[#F8FAFC] hover:bg-[#F8F7F0] dark:hover:bg-[#0E172F]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white dark:bg-black/20 dark:text-[#060D1E]"
                      : "bg-[#E8E7DE]/70 dark:bg-[#1E2D4A] text-[#66736E] dark:text-[#94A3B8]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] md:max-w-xs">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9B95] dark:text-[#94A3B8]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full h-10 pl-9 pr-8 rounded-xl bg-[#F8F7F0] dark:bg-[#0E172F] border border-[#E8E7DE] dark:border-[#1E2D4A] text-xs sm:text-sm font-medium text-[#102A2A] dark:text-[#F8FAFC] placeholder:text-[#9AA6A0] dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#087F68] dark:focus:border-[#00D09C] focus:bg-white dark:focus:bg-[#111C38] transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8E9B95] dark:text-[#94A3B8] hover:text-[#102A2A] dark:hover:text-[#F8FAFC]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 4. Notifications List Section */}
      <div className="space-y-3.5">
        {loading && notifications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-[#087F68] dark:border-[#00D09C] border-t-transparent" />
            <p className="mt-3 text-sm font-medium text-[#66736E] dark:text-[#94A3B8]">
              Loading your financial notifications...
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-6 text-center rounded-2xl bg-[#FFFDF8] dark:bg-[#111C38] border border-dashed border-[#E8E7DE] dark:border-[#1E2D4A]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3EE] dark:bg-[#00D09C]/15 text-[#087F68] dark:text-[#00D09C] mb-4">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#102A2A] dark:text-[#F8FAFC]">
              {searchQuery || activeTab !== "all"
                ? "No matching notifications"
                : "All Caught Up!"}
            </h3>
            <p className="mt-1.5 text-sm text-[#66736E] dark:text-[#94A3B8] max-w-md mx-auto leading-relaxed">
              {searchQuery || activeTab !== "all"
                ? "Try clearing your search keyword or switching filter tabs to see all activity."
                : "You have no active alerts or spending warnings right now. New notifications will appear here when you approach budget thresholds or record new activity."}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {(searchQuery || activeTab !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-white dark:bg-[#0E172F] text-xs sm:text-sm font-semibold text-[#102A2A] dark:text-[#F8FAFC] hover:bg-[#F8F7F0] dark:hover:bg-[#162447] transition cursor-pointer"
                >
                  Clear filters
                </button>
              )}
              <Link
                to="/budgets"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#104E42] hover:bg-[#176453] dark:bg-[#00D09C] dark:hover:bg-[#00B887] text-white dark:text-[#060D1E] text-xs sm:text-sm font-semibold transition"
              >
                <span>View Budgets</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* Notification Cards List */
          filteredNotifications.map((item) => {
            const isUnread = !item.read;

            // Priority and Type Visuals
            let iconBoxStyle = "bg-[#E8F3EE] dark:bg-[#00D09C]/15 text-[#087F68] dark:text-[#00D09C]";
            let IconComponent = Info;
            let priorityLabel = "Info";
            let priorityBadgeStyle =
              "bg-[#E8F3EE] dark:bg-[#00D09C]/15 text-[#087F68] dark:text-[#00D09C] border-[#087F68]/20 dark:border-[#00D09C]/30";
            let cardAccentBorder = isUnread ? "border-l-4 border-l-[#087F68] dark:border-l-[#00D09C]" : "";

            if (item.type === "danger" || (item.metadata?.threshold && item.metadata.threshold >= 100)) {
              IconComponent = AlertCircle;
              iconBoxStyle = "bg-[#FDF0EB] dark:bg-[#F87171]/15 text-[#D9573B] dark:text-[#F87171]";
              priorityLabel = "Exceeded";
              priorityBadgeStyle =
                "bg-[#FDF0EB] dark:bg-[#F87171]/15 text-[#D9573B] dark:text-[#F87171] border-[#D9573B]/30 dark:border-[#F87171]/30";
              cardAccentBorder = isUnread
                ? "border-l-4 border-l-[#D9573B] dark:border-l-[#F87171]"
                : "";
            } else if (item.type === "warning") {
              IconComponent = AlertTriangle;
              iconBoxStyle = "bg-[#FCF5E5] dark:bg-[#FBBF24]/15 text-[#D99016] dark:text-[#FBBF24]";
              priorityLabel =
                item.metadata?.threshold >= 90 ? "High Priority" : "Warning";
              priorityBadgeStyle =
                "bg-[#FCF5E5] dark:bg-[#FBBF24]/15 text-[#D99016] dark:text-[#FBBF24] border-[#D99016]/30 dark:border-[#FBBF24]/30";
              cardAccentBorder = isUnread
                ? "border-l-4 border-l-[#D99016] dark:border-l-[#FBBF24]"
                : "";
            } else if (item.category === "transaction") {
              IconComponent = ArrowLeftRight;
              iconBoxStyle = "bg-[#E6F4F1] dark:bg-[#00D09C]/15 text-[#087F68] dark:text-[#00D09C]";
              priorityLabel = "Ledger";
              priorityBadgeStyle =
                "bg-[#E6F4F1] dark:bg-[#00D09C]/15 text-[#087F68] dark:text-[#00D09C] border-[#087F68]/25 dark:border-[#00D09C]/30";
            } else if (item.category === "split") {
              IconComponent = Sparkles;
              iconBoxStyle = "bg-[#F3E9DD] dark:bg-[#FBBF24]/15 text-[#D99016] dark:text-[#FBBF24]";
              priorityLabel = "Split Bill";
              priorityBadgeStyle =
                "bg-[#F3E9DD] dark:bg-[#FBBF24]/15 text-[#D99016] dark:text-[#FBBF24] border-[#D99016]/30 dark:border-[#FBBF24]/30";
            }

            const hasBudgetDetails =
              item.metadata?.limit && item.metadata.limit > 0;
            const percentage = item.metadata?.percentage || 0;

            return (
              <div
                key={item._id}
                onClick={() => handleCardClick(item)}
                className={`group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#111C38] border border-[#E8E7DE] dark:border-[#1E2D4A] transition-all duration-200 cursor-pointer shadow-xs hover:border-[#D5D3C8] dark:hover:border-[#2D3F66] hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.2)] ${
                  isUnread ? `bg-[#FFFDF6] dark:bg-[#13203F] ${cardAccentBorder}` : "opacity-95"
                }`}
              >
                {/* Main Content Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Category / Priority Icon */}
                  <div
                    className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl ${iconBoxStyle} shadow-xs transition-transform duration-200 group-hover:scale-105`}
                  >
                    <IconComponent size={22} strokeWidth={2.2} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header Chips & Timestamp */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {/* Priority Tag */}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${priorityBadgeStyle}`}
                      >
                        {priorityLabel}
                      </span>

                      {/* Category Badge */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F8F7F0] dark:bg-[#0E172F] text-[11px] font-semibold text-[#66736E] dark:text-[#94A3B8] border border-[#E8E7DE] dark:border-[#1E2D4A]">
                        {item.category === "budget"
                          ? "Budget Alert"
                          : item.category === "transaction"
                          ? "Transaction"
                          : item.category === "split"
                          ? "Split Expense"
                          : "System"}
                      </span>

                      {/* Associated Category / Budget Name */}
                      {item.metadata?.categoryName && (
                        <span className="text-xs font-semibold text-[#104E42] dark:text-[#00D09C]">
                          • {item.metadata.categoryName}
                        </span>
                      )}

                      {/* Unread Indicator */}
                      {isUnread && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#D99016] dark:text-[#FBBF24] ml-auto sm:ml-0">
                          <span className="h-2 w-2 rounded-full bg-[#D99016] dark:bg-[#FBBF24] animate-pulse" />
                          <span>Unread</span>
                        </span>
                      )}

                      {/* Timestamp */}
                      <span className="text-xs text-[#8E9B95] dark:text-[#94A3B8] font-medium ml-auto">
                        {formatTimestamp(item.createdAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base sm:text-[17px] font-bold text-[#102A2A] dark:text-[#F8FAFC] tracking-tight leading-snug">
                      {item.title}
                    </h4>

                    {/* Message */}
                    <p className="mt-1 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8] font-medium leading-relaxed">
                      {item.message}
                    </p>

                    {/* Budget Consumption Details & Mini Progress Bar (if available) */}
                    {hasBudgetDetails && (
                      <div className="mt-3.5 pt-3 border-t border-[#F0EEE4] dark:border-[#1E2D4A] max-w-xl">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#66736E] dark:text-[#94A3B8] mb-1.5">
                          <span>
                            Spent: ₹{item.metadata.spent?.toLocaleString()}{" "}
                            <span className="text-[#8E9B95] dark:text-[#64748B]">
                              / ₹{item.metadata.limit?.toLocaleString()}
                            </span>
                          </span>
                          <span
                            className={
                              percentage >= 100
                                ? "text-[#D9573B] dark:text-[#F87171] font-bold"
                                : percentage >= 75
                                ? "text-[#D99016] dark:text-[#FBBF24] font-bold"
                                : "text-[#087F68] dark:text-[#00D09C] font-bold"
                            }
                          >
                            {percentage}% consumed
                          </span>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="w-full h-2 rounded-full bg-[#EAE7DC] dark:bg-[#1E2D4A] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentage >= 100
                                ? "bg-[#D9573B] dark:bg-[#F87171]"
                                : percentage >= 75
                                ? "bg-[#D99016] dark:bg-[#FBBF24]"
                                : "bg-[#087F68] dark:bg-[#00D09C]"
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(0, percentage))}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Controls */}
                <div
                  className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EEE4] dark:border-[#1E2D4A] shrink-0 self-end md:self-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* View Related Page Link */}
                  {item.category === "budget" ? (
                    <Link
                      to="/budgets"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-white dark:bg-[#0E172F] text-xs font-semibold text-[#104E42] dark:text-[#00D09C] hover:bg-[#F8F7F0] dark:hover:bg-[#162447] transition shadow-2xs"
                    >
                      <span>View Budget</span>
                      <ArrowRight size={13} />
                    </Link>
                  ) : item.category === "transaction" ? (
                    <Link
                      to="/transactions"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-white dark:bg-[#0E172F] text-xs font-semibold text-[#104E42] dark:text-[#00D09C] hover:bg-[#F8F7F0] dark:hover:bg-[#162447] transition shadow-2xs"
                    >
                      <span>View Ledger</span>
                      <ArrowRight size={13} />
                    </Link>
                  ) : null}

                  {/* Toggle Read / Unread */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (isUnread) {
                        await markAsRead(item._id);
                        toast.success("Marked as read");
                      } else {
                        await markAsUnread(item._id);
                        toast.success("Marked as unread");
                      }
                    }}
                    title={isUnread ? "Mark as read" : "Mark as unread"}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-white dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] hover:text-[#102A2A] dark:hover:text-[#F8FAFC] hover:bg-[#F8F7F0] dark:hover:bg-[#162447] transition cursor-pointer"
                  >
                    {isUnread ? <Check size={16} /> : <RotateCcw size={15} />}
                  </button>

                  {/* Dismiss / Delete button */}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await deleteNotification(item._id);
                        toast.success("Notification dismissed");
                      } catch {
                        toast.error("Failed to dismiss");
                      }
                    }}
                    title="Dismiss notification"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-white dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] hover:text-[#D9573B] dark:hover:text-[#F87171] hover:border-[#D9573B]/30 hover:bg-[#D9573B]/10 transition cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Clear All Confirmation Modal Dialog */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear All Notifications?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1">
          <p className="text-sm text-[#66736E] dark:text-[#94A3B8] leading-relaxed">
            Are you sure you want to permanently delete all{" "}
            <span className="font-bold text-[#102A2A] dark:text-[#F8FAFC]">{counts.all}</span>{" "}
            notifications? This will clear your activity ledger alerts and cannot
            be undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E7DE] dark:border-[#1E2D4A]">
            <button
              type="button"
              onClick={() => setIsClearModalOpen(false)}
              disabled={clearing}
              className="px-4 py-2.5 rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-white dark:bg-[#0E172F] text-xs sm:text-sm font-semibold text-[#66736E] dark:text-[#94A3B8] hover:text-[#102A2A] dark:hover:text-[#F8FAFC] hover:bg-[#F8F7F0] dark:hover:bg-[#162447] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmClearAll}
              disabled={clearing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9573B] hover:bg-[#C2482E] text-white text-xs sm:text-sm font-bold shadow-sm transition cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {clearing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Clear All</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
