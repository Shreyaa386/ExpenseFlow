import { useEffect, useState } from "react";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
} from "lucide-react";

import SummaryCard from "../../components/dashboard/SummaryCard";
import ExpenseChart from "../../components/charts/ExpenseChart";

import { getDashboardData } from "../../services/dashboardService";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
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
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-slate-400">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2 className="text-4xl font-bold text-white">
          Dashboard
        </h2>

        <p className="mt-2 text-slate-400">
          Here's an overview of your finances.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

      {/* Charts & Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseChart />

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your latest financial activities
            </p>
          </div>

          <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed border-slate-700 text-slate-500">
            Transactions Coming Soon 💳
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;