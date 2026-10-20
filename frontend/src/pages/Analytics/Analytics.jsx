import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import StatCard from "./StatCard";
import MonthlyOverviewChart from "./MonthlyOverviewChart";
import ExpensePieChart from "./ExpensePieChart";
import TopCategories from "./TopCategories";
import { useTransactions } from "../../context/TransactionContext";
import AIInsightsWidget from "../../components/ai/AIInsightsWidget";

function Analytics() {
  const { transactions, loading } = useTransactions();
  const [timeframe, setTimeframe] = useState("30days");

  // Determine current and previous period date windows
  const { currentTransactions, previousTransactions, periodLabel } = useMemo(() => {
    const now = new Date();
    let currentStart;
    let currentEnd = now;
    let prevStart;
    let prevEnd;
    let label;

    if (timeframe === "30days") {
      currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      prevEnd = new Date(currentStart.getTime());
      prevStart = new Date(prevEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
      label = "vs previous 30 days";
    } else if (timeframe === "this-month") {
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      // Previous month
      prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      label = "vs last month";
    } else if (timeframe === "last-month") {
      currentStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      currentEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      prevStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      prevEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59);
      label = "vs month prior";
    } else if (timeframe === "this-year") {
      currentStart = new Date(now.getFullYear(), 0, 1);
      prevStart = new Date(now.getFullYear() - 1, 0, 1);
      prevEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
      label = "vs last year";
    } else {
      // all time
      return {
        currentTransactions: transactions,
        previousTransactions: [],
        periodLabel: "All Time Cumulative",
      };
    }

    const current = transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= currentStart && d <= currentEnd;
    });

    const previous = transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= prevStart && d <= prevEnd;
    });

    return {
      currentTransactions: current,
      previousTransactions: previous,
      periodLabel: label,
    };
  }, [transactions, timeframe]);

  // Aggregate current and previous period stats
  const analyticsData = useMemo(() => {
    // Current
    const currentIncome = currentTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const currentExpense = currentTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const currentSavings = currentIncome - currentExpense;
    const currentCount = currentTransactions.length;

    // Previous
    const prevIncome = previousTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const prevExpense = previousTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const prevSavings = prevIncome - prevExpense;
    const prevCount = previousTransactions.length;

    // Helper to calculate percentage change
    const calcChange = (curr, prev, higherIsGood = true) => {
      if (timeframe === "all" || prev === 0) {
        if (curr > 0 && prev === 0) return { change: "+100%", direction: higherIsGood ? "positive" : "negative" };
        return { change: null, direction: "neutral" };
      }

      const diff = curr - prev;
      const pct = Math.round((diff / Math.abs(prev)) * 100);
      const sign = pct >= 0 ? "+" : "";
      const isPositive = higherIsGood ? pct >= 0 : pct <= 0;

      return {
        change: `${sign}${pct}%`,
        direction: isPositive ? "positive" : "negative",
      };
    };

    const incomeMetric = calcChange(currentIncome, prevIncome, true);
    const expenseMetric = calcChange(currentExpense, prevExpense, false); // For expenses, reduction is positive
    const savingsMetric = calcChange(currentSavings, prevSavings, true);
    const countMetric = calcChange(currentCount, prevCount, true);

    const stats = [
      {
        title: "Total Inflow (Credits)",
        value: `₹${currentIncome.toLocaleString("en-IN")}`,
        change: incomeMetric.change,
        changeDirection: incomeMetric.direction,
        subtitle: periodLabel,
        type: "income",
      },
      {
        title: "Total Outflow (Debits)",
        value: `₹${currentExpense.toLocaleString("en-IN")}`,
        change: expenseMetric.change,
        changeDirection: expenseMetric.direction,
        subtitle: periodLabel,
        type: "expense",
      },
      {
        title: "Net Capital Surplus",
        value: `₹${currentSavings.toLocaleString("en-IN")}`,
        change: savingsMetric.change,
        changeDirection: savingsMetric.direction,
        subtitle: periodLabel,
        type: "saving",
      },
      {
        title: "Activity Entries",
        value: currentCount,
        change: countMetric.change,
        changeDirection: countMetric.direction,
        subtitle: periodLabel,
        type: "transaction",
      },
    ];

    return { stats, currentTransactions };
  }, [currentTransactions, previousTransactions, timeframe, periodLabel]);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#104E42] border-t-transparent" />
        <p className="text-sm text-[#66736E] font-medium">Computing Financial Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Top Header & Timeframe Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A]">
            Financial Analytics
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#66736E] font-medium">
            Cash flow velocity, expenditure distributions, and period comparisons.
          </p>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FFFDF8] border border-[#E8E7DE] self-start sm:self-auto overflow-x-auto max-w-full shadow-[0_1px_3px_0_rgba(16,42,42,0.04)]">
          {[
            { label: "Last 30 Days", value: "30days" },
            { label: "This Month", value: "this-month" },
            { label: "Last Month", value: "last-month" },
            { label: "This Year", value: "this-year" },
            { label: "All Time", value: "all" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTimeframe(item.value)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                timeframe === item.value
                  ? "bg-[#104E42] text-white shadow-sm"
                  : "text-[#66736E] hover:text-[#102A2A] hover:bg-[#F8F7F0]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards with Calculated Trends */}
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsData.stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <MonthlyOverviewChart transactions={analyticsData.currentTransactions} />
        <ExpensePieChart transactions={analyticsData.currentTransactions} />
      </div>

      {/* Ranked Category Distribution */}
      <TopCategories transactions={analyticsData.currentTransactions} />

      {/* AI Financial Insights & Trend Analytics */}
      <AIInsightsWidget title="AI Spending & Trend Insights" />
    </div>
  );
}

export default Analytics;