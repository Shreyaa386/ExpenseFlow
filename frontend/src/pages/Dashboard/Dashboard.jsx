import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Users,
  Bell,
  ArrowRight,
  Target,
  ExternalLink,
  Calendar,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

import SummaryCard from "../../components/dashboard/SummaryCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import FinancialOverviewChart from "../../components/charts/FinancialOverviewChart";
import CategoryPieChart from "../../components/charts/CategoryPieChart";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

import { getDashboardData } from "../../services/dashboardService";
import { getProfile } from "../../services/userService";
import AIInsightsWidget from "../../components/ai/AIInsightsWidget";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    chartData: [],
    categoryData: [],
    recentTransactions: [],
    budgetSummary: {
      totalBudgeted: 0,
      totalSpent: 0,
      totalRemaining: 0,
      overallPercentage: 0,
      activeBudgets: [],
      thresholdWarnings: [],
    },
    splitSummary: {
      totalOwedToUser: 0,
      totalUserOwes: 0,
      netBalance: 0,
      activeCount: 0,
      recentSplits: [],
    },
    notifications: {
      recent: [],
      unreadCount: 0,
    },
  });

  const [period, setPeriod] = useState("all");
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async (selectedPeriod = period) => {
    try {
      setLoading(true);
      setError(null);

      const [dataRes, profileRes] = await Promise.allSettled([
        getDashboardData({ period: selectedPeriod }),
        getProfile(),
      ]);

      if (dataRes.status === "fulfilled" && dataRes.value) {
        setDashboardData(dataRes.value);
      } else if (dataRes.status === "rejected") {
        throw dataRes.reason;
      }

      if (profileRes.status === "fulfilled" && profileRes.value) {
        setUserProfile(profileRes.value.user || profileRes.value.data || null);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to sync dashboard.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchDashboard(period);
  }, [period, fetchDashboard]);

  // Real calculations (strictly derived from actual figures, never fake or mocked)
  const totalIncome = Number(dashboardData.totalIncome) || 0;
  const totalExpense = Number(dashboardData.totalExpense) || 0;
  const balance = Number(dashboardData.balance) || 0;
  const monthlyIncome = Number(dashboardData.monthlyIncome) || 0;
  const monthlyExpense = Number(dashboardData.monthlyExpense) || 0;

  // Real savings rate
  const savings = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
      : 0;

  // Real monthly budget consumption
  const monthlyBudgetGoal = Number(userProfile?.monthlyIncome) || monthlyIncome;
  const budgetPercentUsed =
    monthlyBudgetGoal > 0
      ? Math.min(100, Math.round((monthlyExpense / monthlyBudgetGoal) * 100))
      : 0;


  if (loading && !dashboardData.chartData.length) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-[#087F68]/20" />
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#104E42] border-t-transparent" />
        </div>
        <p className="text-sm font-medium text-[#66736E]">
          Syncing financial ledger from MongoDB...
        </p>
      </div>
    );
  }

  if (error && !dashboardData.chartData.length) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D9573B]/10 text-[#D9573B] border border-[#D9573B]/20">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-lg font-bold text-[#102A2A]">Ledger Sync Error</h3>
        <p className="text-xs text-[#66736E] max-w-sm">{error}</p>
        <Button onClick={() => fetchDashboard(period)} size="sm" className="mt-2">
          <RefreshCw size={14} className="mr-1.5" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Top Header & Date Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A]">
            Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#66736E] mt-1.5 font-medium">
            {userProfile?.name
              ? `Welcome back, ${userProfile.name}. Real-time portfolio overview and live spending metrics.`
              : "Real-time liquidity, income, expenses, and portfolio metrics."}
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#66736E] mr-1 hidden sm:flex">
            <Calendar size={14} className="text-[#087F68]" />
            <span className="font-semibold text-xs uppercase tracking-wider">Horizon:</span>
          </div>

          {[
            { label: "All Time", value: "all" },
            { label: "This Month", value: "month" },
            { label: "Last 30 Days", value: "30days" },
            { label: "This Year", value: "year" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setPeriod(item.value)}
              className={`h-9 inline-flex items-center rounded-xl px-3.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
                period === item.value
                  ? "border border-[#104E42] bg-[#104E42] text-white font-semibold shadow-sm"
                  : "border border-[#E8E7DE] bg-[#FFFDF8] text-[#66736E] hover:text-[#102A2A] hover:border-[#D5D3C8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Summary Metric Cards */}
      <section className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          amount={`₹${balance.toLocaleString()}`}
          icon={Wallet}
          accent="teal"
          badgeText={balance >= 0 ? "Liquid Positive" : "Deficit"}
          badgeType={balance >= 0 ? "positive" : "negative"}
          description={period === "all" ? "Cumulative Net" : "Selected Period"}
        />

        <SummaryCard
          title="Total Income"
          amount={`₹${totalIncome.toLocaleString()}`}
          icon={ArrowDownCircle}
          accent="emerald"
          badgeText="Inflow"
          badgeType="positive"
          description={period === "all" ? "All-time Deposited" : "Period Credits"}
        />

        <SummaryCard
          title="Total Expenses"
          amount={`₹${totalExpense.toLocaleString()}`}
          icon={ArrowUpCircle}
          accent="rose"
          badgeText="Outflow"
          badgeType="negative"
          description={period === "all" ? "All-time Debited" : "Period Debits"}
        />

        <SummaryCard
          title="Net Savings"
          amount={`₹${savings.toLocaleString()}`}
          icon={PiggyBank}
          accent="violet"
          badgeText={`${savingsRate}% Savings Rate`}
          badgeType={savingsRate >= 20 ? "positive" : "neutral"}
          description="Derived Savings Ratio"
        />
      </section>

      {/* Quick Financial Shortcuts Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 1. Add Transaction */}
        <Link
          to="/transactions/add"
          className="group flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8E7DE] hover:border-[#087F68]/40 hover:bg-[#F8F7F0]/40 hover:shadow-sm transition-all duration-200 cursor-pointer min-h-[82px]"
        >
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68] transition-colors duration-150 group-hover:bg-[#087F68]/15">
            <Plus size={22} />
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <p className="text-sm sm:text-[15px] font-bold text-[#102A2A] group-hover:text-[#087F68] transition-colors leading-snug truncate">
              Add Transaction
            </p>
            <p className="text-xs text-[#66736E] mt-0.5 leading-normal truncate">
              Record income or expense
            </p>
          </div>
        </Link>

        {/* 2. Create Budget */}
        <Link
          to="/budgets"
          className="group flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8E7DE] hover:border-[#D99016]/40 hover:bg-[#F8F7F0]/40 hover:shadow-sm transition-all duration-200 cursor-pointer min-h-[82px]"
        >
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#D99016]/10 text-[#D99016] transition-colors duration-150 group-hover:bg-[#D99016]/15">
            <Target size={22} />
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <p className="text-sm sm:text-[15px] font-bold text-[#102A2A] group-hover:text-[#D99016] transition-colors leading-snug truncate">
              Create Budget
            </p>
            <p className="text-xs text-[#66736E] mt-0.5 leading-normal truncate">
              Set category spending cap
            </p>
          </div>
        </Link>

        {/* 3. Split Expense */}
        <Link
          to="/split-expenses"
          className="group flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8E7DE] hover:border-[#104E42]/40 hover:bg-[#F8F7F0]/40 hover:shadow-sm transition-all duration-200 cursor-pointer min-h-[82px]"
        >
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#104E42]/10 text-[#104E42] transition-colors duration-150 group-hover:bg-[#104E42]/15">
            <Users size={22} />
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <p className="text-sm sm:text-[15px] font-bold text-[#102A2A] group-hover:text-[#104E42] transition-colors leading-snug truncate">
              Split Expense
            </p>
            <p className="text-xs text-[#66736E] mt-0.5 leading-normal truncate">
              Share group bill
            </p>
          </div>
        </Link>

        {/* 4. Analytics */}
        <Link
          to="/analytics"
          className="group flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8E7DE] hover:border-[#3F8F46]/40 hover:bg-[#F8F7F0]/40 hover:shadow-sm transition-all duration-200 cursor-pointer min-h-[82px]"
        >
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#3F8F46]/10 text-[#3F8F46] transition-colors duration-150 group-hover:bg-[#3F8F46]/15">
            <PiggyBank size={22} />
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <p className="text-sm sm:text-[15px] font-bold text-[#102A2A] group-hover:text-[#3F8F46] transition-colors leading-snug truncate">
              Analytics
            </p>
            <p className="text-xs text-[#66736E] mt-0.5 leading-normal truncate">
              Deep spending insights
            </p>
          </div>
        </Link>
      </section>

      {/* Threshold Alerts Banner (if any budget crossed threshold) */}
      {dashboardData.budgetSummary?.thresholdWarnings?.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] border border-[#E69A20]/40 text-[#102A2A] shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#E69A20]/15 text-[#E69A20] shrink-0 border border-[#E69A20]/30">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#102A2A]">Spending Limit Alert</p>
              <p className="text-xs text-[#66736E] mt-0.5 leading-relaxed">
                {dashboardData.budgetSummary.thresholdWarnings
                  .map((w) => `${w.name} (${w.percentage}% spent)`)
                  .join(", ")}
              </p>
            </div>
          </div>
          <Link to="/budgets">
            <Button
              size="sm"
              variant="outline"
              className="text-[#E69A20] border-[#E69A20]/40 hover:bg-[#E69A20]/10 text-xs px-3.5 h-9 shrink-0"
            >
              <span>Manage Budgets</span>
              <ArrowRight size={13} className="ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* 2. Spending & Financial Overview Charts */}
      <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr] items-stretch">
        <FinancialOverviewChart data={dashboardData.chartData} />
        <CategoryPieChart data={dashboardData.categoryData} />
      </section>

      {/* 3. Budget Progress & AI Financial Insights */}
      <section className="grid gap-5 xl:grid-cols-2 items-stretch">
        {/* Budget Progress Card */}
        <Card className="p-5 sm:p-6 flex flex-col justify-between h-full">
          <div>
            <CardHeader className="flex-row items-center justify-between pb-3 border-b border-[#E8E7DE]">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target size={18} className="text-[#087F68]" />
                  <span>Budget & Limit Tracking</span>
                </CardTitle>
                <p className="mt-0.5 text-xs text-[#66736E]">
                  Live monitoring across your weekly and monthly expenditure caps.
                </p>
              </div>

              <Link
                to="/budgets"
                className="text-xs text-[#087F68] hover:text-[#104E42] font-semibold inline-flex items-center gap-1 transition"
              >
                <span>Manage Budgets</span>
                <ExternalLink size={12} />
              </Link>
            </CardHeader>

            <CardContent className="space-y-5 pt-4">
              {dashboardData.budgetSummary?.activeBudgets?.length > 0 ? (
                <>
                  {/* Aggregate Budget Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#66736E]">
                        Spent:{" "}
                        <strong className="text-[#102A2A] font-mono">
                          ₹{dashboardData.budgetSummary.totalSpent.toLocaleString()}
                        </strong>
                      </span>
                      <span className="text-[#66736E]">
                        Cap:{" "}
                        <strong className="text-[#102A2A] font-mono">
                          ₹{dashboardData.budgetSummary.totalBudgeted.toLocaleString()}
                        </strong>
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E8E7DE]">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          dashboardData.budgetSummary.overallPercentage > 90
                            ? "bg-[#D9573B]"
                            : dashboardData.budgetSummary.overallPercentage > 75
                            ? "bg-[#E69A20]"
                            : "bg-[#087F68]"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            dashboardData.budgetSummary.overallPercentage
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#66736E] font-mono">
                      <span>
                        {dashboardData.budgetSummary.overallPercentage}% overall consumed
                      </span>
                      <span className="text-[#3F8F46] font-semibold">
                        ₹{dashboardData.budgetSummary.totalRemaining.toLocaleString()}{" "}
                        remaining buffer
                      </span>
                    </div>
                  </div>

                  {/* Active Budget Limits Preview */}
                  <div className="space-y-2 pt-1">
                    <p className="text-xs uppercase tracking-wider text-[#66736E] font-semibold">
                      Active Limit Caps
                    </p>
                    {dashboardData.budgetSummary.activeBudgets.slice(0, 3).map((b) => (
                      <div
                        key={b._id}
                        className="p-3 rounded-xl bg-[#F8F7F0] border border-[#E8E7DE] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#102A2A]">{b.name}</span>
                            <span className="text-xs font-mono text-[#087F68] capitalize px-1.5 py-0.5 rounded bg-[#087F68]/10 font-medium">
                              {b.period}
                            </span>
                          </div>
                          <span
                            className={`font-mono text-xs font-semibold ${
                              b.isExceeded
                                ? "text-[#D9573B]"
                                : b.percentage >= 80
                                ? "text-[#E69A20]"
                                : "text-[#102A2A]"
                            }`}
                          >
                            ₹{b.spent.toLocaleString()} / ₹{b.amount.toLocaleString()} ({b.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#E8E7DE] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              b.isExceeded
                                ? "bg-[#D9573B]"
                                : b.percentage >= 80
                                ? "bg-[#E69A20]"
                                : "bg-[#087F68]"
                            }`}
                            style={{ width: `${Math.min(100, b.percentage)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : monthlyBudgetGoal === 0 && monthlyExpense === 0 ? (
                <div className="rounded-xl border border-dashed border-[#E8E7DE] bg-[#F8F7F0] p-6 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68] border border-[#087F68]/20">
                    <Target size={18} />
                  </div>
                  <p className="text-xs font-bold text-[#102A2A]">
                    No Automated Budget Limits Active
                  </p>
                  <p className="text-xs text-[#66736E] max-w-xs mx-auto mt-1">
                    Configure weekly and monthly expenditure limits to keep spending within targets.
                  </p>
                  <div className="mt-3.5">
                    <Link to="/budgets">
                      <Button variant="outline" size="sm">
                        <Plus size={14} className="mr-1.5" />
                        <span>Create First Budget</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Visual Progress Bar from User Goals */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#66736E]">
                        Spent:{" "}
                        <strong className="text-[#102A2A] font-mono">
                           ₹{monthlyExpense.toLocaleString()}
                        </strong>
                      </span>
                      <span className="text-[#66736E]">
                        Target:{" "}
                        <strong className="text-[#102A2A] font-mono">
                          ₹{monthlyBudgetGoal.toLocaleString()}
                        </strong>
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E8E7DE]">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          budgetPercentUsed > 90
                            ? "bg-[#D9573B]"
                            : budgetPercentUsed > 70
                            ? "bg-[#E69A20]"
                            : "bg-[#087F68]"
                        }`}
                        style={{ width: `${Math.min(100, budgetPercentUsed)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#66736E] font-mono">
                      <span>{budgetPercentUsed}% consumed</span>
                      <span className="font-semibold text-[#102A2A]">
                        {monthlyBudgetGoal > monthlyExpense
                          ? `₹${(monthlyBudgetGoal - monthlyExpense).toLocaleString()} remaining`
                          : "Budget ceiling exceeded"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link to="/budgets">
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus size={14} className="mr-1.5" />
                        <span>Set Up Weekly & Category Budgets</span>
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </div>
        </Card>

        {/* AI Financial Insights Live Component */}
        <AIInsightsWidget />
      </section>

      {/* 4. Bottom Section: Recent Transactions & Split Expenses & Notifications */}
      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr] items-start">
        <RecentTransactions transactions={dashboardData.recentTransactions || []} />

        <div className="space-y-5">
          {/* Split Expenses Real-Data Card */}
          <Card className="p-5 sm:p-6">
            <CardHeader className="flex-row items-center justify-between pb-3.5 border-b border-[#E8E7DE]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#104E42]/10 text-[#104E42]">
                  <Users size={18} />
                </div>
                <div>
                  <CardTitle>Split Expenses</CardTitle>
                  <p className="text-xs sm:text-sm text-[#66736E] mt-0.5">
                    Shared bills and roommate settlements.
                  </p>
                </div>
              </div>

              <Badge variant="teal" size="sm">Active</Badge>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="rounded-xl border border-[#E8E7DE] bg-[#F8F7F0] p-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#087F68]/10 border border-[#087F68]/20">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#087F68] flex items-center gap-1.5">
                      <ArrowDownLeft size={13} /> You are owed
                    </span>
                    <p className="text-lg font-bold text-[#087F68] font-mono mt-1.5">
                      ₹{dashboardData.splitSummary?.totalOwedToUser?.toLocaleString() || 0}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#D9573B]/10 border border-[#D9573B]/20">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#D9573B] flex items-center gap-1.5">
                      <ArrowUpRight size={13} /> You owe
                    </span>
                    <p className="text-lg font-bold text-[#D9573B] font-mono mt-1.5">
                      ₹{dashboardData.splitSummary?.totalUserOwes?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                  <span className="text-[#66736E]">
                    <strong className="text-[#102A2A] font-mono">{dashboardData.splitSummary?.activeCount || 0}</strong> active shared bills
                  </span>
                  <Link to="/split-expenses">
                    <Button size="sm" variant="primary" className="text-xs px-3.5 h-8">
                      <span>Open Ledger</span>
                      <ArrowRight size={13} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time System Notifications Card */}
          <Card className="p-5 sm:p-6">
            <CardHeader className="flex-row items-center justify-between pb-3.5 border-b border-[#E8E7DE]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68]">
                  <Bell size={18} />
                </div>
                <div>
                  <CardTitle>Recent Alerts & Feeds</CardTitle>
                  <p className="text-xs sm:text-sm text-[#66736E] mt-0.5">Budget thresholds and bill events.</p>
                </div>
              </div>

              {dashboardData.notifications?.unreadCount > 0 && (
                <Badge variant="teal" dot={true} size="sm">
                  {dashboardData.notifications.unreadCount} new
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-3 pt-4">
              {dashboardData.notifications?.recent?.length > 0 ? (
                dashboardData.notifications.recent.slice(0, 3).map((item) => {
                  let dotColor = "bg-[#087F68]";
                  if (item.type === "danger") dotColor = "bg-[#D9573B]";
                  else if (item.type === "warning") dotColor = "bg-[#E69A20]";

                  return (
                    <div
                      key={item._id}
                      className="flex items-start gap-3 rounded-xl border border-[#E8E7DE] bg-[#F8F7F0] p-3.5"
                    >
                      <div className={`mt-1.5 h-2 w-2 rounded-full ${dotColor} shrink-0`} />
                      <div className="text-xs sm:text-sm flex-1 min-w-0">
                        <p className="font-semibold text-[#102A2A] truncate">{item.title}</p>
                        <p className="text-[#66736E] text-xs mt-0.5 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                        <span className="text-xs text-[#66736E] font-mono mt-1 block">
                          {new Date(item.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs sm:text-sm text-[#66736E]">
                  <CheckCircle2 size={22} className="mx-auto text-[#087F68] mb-2" />
                  <p className="text-[#102A2A] font-semibold">All caught up!</p>
                  <p className="text-xs text-[#66736E] mt-0.5">No recent alerts or warnings.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;