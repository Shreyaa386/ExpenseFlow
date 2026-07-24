import { useEffect, useState } from "react";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
} from "lucide-react";

import SummaryCard from "../../components/dashboard/SummaryCard";
import FinancialOverviewChart from "../../components/charts/FinancialOverviewChart";
import CategoryPieChart from "../../components/charts/CategoryPieChart";

import { getDashboardData } from "../../services/dashboardService";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    chartData: [],
    categoryData: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <p className="text-lg text-slate-400">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Summary Cards */}

      <div className="grid gap-7 sm:grid-cols-2 2xl:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          amount={`₹${dashboardData.balance.toLocaleString()}`}
          icon={Wallet}
          iconBg="bg-indigo-500/20"
          iconColor="text-indigo-400"
        />

        <SummaryCard
          title="Income"
          amount={`₹${dashboardData.totalIncome.toLocaleString()}`}
          icon={ArrowDownCircle}
          iconBg="bg-emerald-500/20"
          iconColor="text-emerald-400"
        />

        <SummaryCard
          title="Expense"
          amount={`₹${dashboardData.totalExpense.toLocaleString()}`}
          icon={ArrowUpCircle}
          iconBg="bg-red-500/20"
          iconColor="text-red-400"
        />

        <SummaryCard
          title="Savings"
          amount={`₹${dashboardData.balance.toLocaleString()}`}
          icon={PiggyBank}
          iconBg="bg-yellow-500/20"
          iconColor="text-yellow-400"
        />
      </div>

      {/* Financial Overview */}

      <section className="pt-2">
        <FinancialOverviewChart
          data={dashboardData.chartData}
        />
      </section>

      {/* Bottom Section */}

      <section className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <CategoryPieChart
          data={dashboardData.categoryData}
        />

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">
            Monthly Insights
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Overview of this month's finances
          </p>

          <div className="mt-10 space-y-8">
            <div>
              <p className="text-sm text-slate-400">
                This Month Income
              </p>

              <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                ₹{dashboardData.monthlyIncome.toLocaleString()}
              </h3>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <p className="text-sm text-slate-400">
                This Month Expense
              </p>

              <h3 className="mt-2 text-3xl font-bold text-red-400">
                ₹{dashboardData.monthlyExpense.toLocaleString()}
              </h3>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <p className="text-sm text-slate-400">
                Savings This Month
              </p>

              <h3 className="mt-2 text-3xl font-bold text-indigo-400">
                ₹
                {(
                  dashboardData.monthlyIncome -
                  dashboardData.monthlyExpense
                ).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;