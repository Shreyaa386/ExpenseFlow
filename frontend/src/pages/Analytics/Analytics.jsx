import { useMemo } from "react";

import StatCard from "./StatCard";
import MonthlyOverviewChart from "./MonthlyOverviewChart";
import ExpensePieChart from "./ExpensePieChart";
import TopCategories from "./TopCategories";

import { useTransactions } from "../../context/TransactionContext";

function Analytics() {
  const { transactions, loading } = useTransactions();

  const analyticsData = useMemo(() => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (sum, transaction) => sum + Number(transaction.amount),
        0
      );

    const totalExpense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (sum, transaction) => sum + Number(transaction.amount),
        0
      );

    const totalSavings = totalIncome - totalExpense;

    const stats = [
      {
        title: "Total Income",
        value: `₹${totalIncome.toLocaleString("en-IN")}`,
        change: "",
        type: "income",
      },
      {
        title: "Total Expenses",
        value: `₹${totalExpense.toLocaleString("en-IN")}`,
        change: "",
        type: "expense",
      },
      {
        title: "Net Savings",
        value: `₹${totalSavings.toLocaleString("en-IN")}`,
        change: "",
        type: "saving",
      },
      {
        title: "Transactions",
        value: transactions.length,
        change: "",
        type: "transaction",
      },
    ];

    return {
      stats,
      totalIncome,
      totalExpense,
      totalSavings,
    };
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-slate-400">
          Loading Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {analyticsData.stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <MonthlyOverviewChart
          transactions={transactions}
        />

        <ExpensePieChart
          transactions={transactions}
        />
      </div>

      {/* Top Categories */}

      <TopCategories
        transactions={transactions}
      />
    </div>
  );
}

export default Analytics;