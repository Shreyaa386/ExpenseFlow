import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";

function RecentTransactions({ transactions = [] }) {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Your latest financial activities.
          </p>
        </div>

        <Link to="/transactions">
          <Button className="w-auto px-5">
            View All
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 py-12 text-center">
          <p className="text-lg font-semibold text-white">
            No Transactions Yet
          </p>

          <p className="mt-2 text-slate-400">
            Add your first transaction to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 transition hover:bg-slate-800"
            >
              {/* Left */}
              <div>
                <h3 className="font-semibold text-white">
                  {transaction.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {transaction.category}
                </p>
              </div>

              {/* Right */}
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    transaction.type === "income"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}₹
                  {transaction.amount}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentTransactions;