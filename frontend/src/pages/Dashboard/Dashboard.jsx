import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
} from "lucide-react";

import SummaryCard from "../../components/dashboard/SummaryCard";
import ExpenseChart from "../../components/charts/ExpenseChart";

function Dashboard() {
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
          amount="₹52,400"
          icon={Wallet}
          iconBg="bg-indigo-500/20"
          iconColor="text-indigo-400"
        />

        <SummaryCard
          title="Income"
          amount="₹80,000"
          icon={ArrowDownCircle}
          iconBg="bg-emerald-500/20"
          iconColor="text-emerald-400"
        />

        <SummaryCard
          title="Expense"
          amount="₹27,600"
          icon={ArrowUpCircle}
          iconBg="bg-red-500/20"
          iconColor="text-red-400"
        />

        <SummaryCard
          title="Savings"
          amount="₹52,400"
          icon={PiggyBank}
          iconBg="bg-yellow-500/20"
          iconColor="text-yellow-400"
        />
      </div>

      {/* Charts & Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Expense Chart */}
        <ExpenseChart />

        {/* Recent Transactions */}
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