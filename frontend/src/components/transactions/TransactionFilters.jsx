import { useEffect, useState } from "react";
import { Search, Calendar } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { getCategories } from "../../services/categoryService";

function TransactionFilters({
  search,
  setSearch,
  type,
  setType,
  category,
  setCategory,
  sort,
  setSort,
  dateRange,
  setDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getCategories();
        if (data) setCategories(data);
      } catch (e) {
        console.warn("Could not load categories for filters:", e);
      }
    }
    loadCats();
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(16,42,42,0.04)]">
      {/* Top Filter Row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66736E] dark:text-[#94A3B8] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by title or note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-white dark:bg-[#0E172F] pl-10 pr-4 text-xs sm:text-sm text-[#102A2A] dark:text-[#F8FAFC] placeholder:text-[#66736E]/60 dark:placeholder:text-[#94A3B8]/60 outline-none transition-all duration-150 hover:border-[#D5D3C8] dark:hover:border-[#2D3F66] focus:border-[#087F68] dark:focus:border-[#00D09C] focus:ring-2 focus:ring-[#087F68]/15 dark:focus:ring-[#00D09C]/20"
          />
        </div>

        {/* Type Filter */}
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filter by transaction type"
        >
          <option value="all">All Types (Income & Expense)</option>
          <option value="income">Income Only (Credits)</option>
          <option value="expense">Expense Only (Debits)</option>
        </Select>

        {/* Category Filter */}
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c._id || c.name} value={c.name}>
              {c.name}
            </option>
          ))}
          {/* Default categories fallback */}
          {categories.length === 0 && (
            <>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Salary">Salary</option>
            </>
          )}
        </Select>

        {/* Sort Filter */}
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort transactions"
        >
          <option value="newest">Sort: Date (Newest First)</option>
          <option value="oldest">Sort: Date (Oldest First)</option>
          <option value="highest">Sort: Amount (High to Low)</option>
          <option value="lowest">Sort: Amount (Low to High)</option>
        </Select>
      </div>

      {/* Date Filtering Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-[#E8E7DE] dark:border-[#1E2D4A]">
        <div className="flex items-center gap-2 text-xs text-[#66736E] dark:text-[#94A3B8]">
          <Calendar size={14} className="text-[#087F68] dark:text-[#00D09C]" />
          <span className="font-semibold uppercase tracking-wider text-xs">
            Date Horizon:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { label: "All Dates", value: "all" },
            { label: "This Month", value: "this-month" },
            { label: "Last 30 Days", value: "30days" },
            { label: "This Year", value: "this-year" },
            { label: "Custom Range", value: "custom" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setDateRange(item.value)}
              className={`h-9 inline-flex items-center rounded-xl px-3.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
                dateRange === item.value
                  ? "border border-[#104E42] bg-[#104E42] text-white dark:border-[#00D09C] dark:bg-[#00D09C] dark:text-[#060D1E] font-semibold shadow-sm"
                  : "border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] hover:text-[#102A2A] dark:hover:text-[#F8FAFC] hover:border-[#D5D3C8] dark:hover:border-[#2D3F66]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Pickers (if custom selected) */}
      {dateRange === "custom" && (
        <div className="grid gap-3 sm:grid-cols-2 pt-3 border-t border-[#E8E7DE] dark:border-[#1E2D4A] animate-in fade-in duration-150">
          <Input
            label="From Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="To Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default TransactionFilters;