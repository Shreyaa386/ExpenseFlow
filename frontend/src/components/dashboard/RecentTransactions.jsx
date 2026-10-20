import { Link } from "react-router-dom";
import { ArrowRight, Receipt, ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";
import Card, { CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";

function RecentTransactions({ transactions = [] }) {
  return (
    <Card className="p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <CardHeader className="flex-row items-center justify-between pb-4 border-b border-[#E8E7DE] dark:border-[#1E2D4A]">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <p className="mt-1 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8]">
            Latest real activity recorded in your account ledger.
          </p>
        </div>

        <Link to="/transactions">
          <Button variant="ghost" size="sm" className="text-[#104E42] hover:text-[#087F68] dark:text-[#00D09C] dark:hover:text-[#00B887] text-xs px-3 h-8 font-medium">
            <span>View All</span>
            <ArrowRight size={13} className="ml-1" />
          </Button>
        </Link>
      </CardHeader>

      {/* Content */}
      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0]/60 dark:bg-[#0B1329]/60 py-10 px-4 text-center mt-4">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68] dark:bg-[#00D09C]/10 dark:text-[#00D09C] border border-[#087F68]/20 dark:border-[#00D09C]/20">
            <Receipt size={22} />
          </div>
          <p className="text-base sm:text-lg font-bold text-[#102A2A] dark:text-[#F8FAFC]">No Transactions Yet</p>
          <p className="mt-1.5 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8] max-w-xs mx-auto leading-relaxed">
            Your recent ledger is empty. Add your first income or expense entry to start tracking.
          </p>
          <div className="mt-4">
            <Link to="/transactions/add">
              <Button size="sm" className="w-auto px-4 h-9">
                <Plus size={14} className="mr-1.5" />
                Add Transaction
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 mt-4">
          {transactions.slice(0, 5).map((transaction) => {
            const isIncome = transaction.type === "income";

            return (
              <div
                key={transaction._id}
                className="flex items-center justify-between rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] px-4 py-3.5 transition hover:border-[#D5D3C8] dark:hover:border-[#2D3F66] hover:bg-[#F8F7F0]/80 dark:hover:bg-[#162447]"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      isIncome
                        ? "border-[#3F8F46]/25 bg-[#3F8F46]/10 text-[#3F8F46] dark:border-[#00D09C]/30 dark:bg-[#00D09C]/15 dark:text-[#00D09C]"
                        : "border-[#D9573B]/25 bg-[#D9573B]/10 text-[#D9573B] dark:border-[#F87171]/30 dark:bg-[#F87171]/15 dark:text-[#F87171]"
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-[#102A2A] dark:text-[#F8FAFC]">
                      {transaction.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[#66736E] dark:text-[#94A3B8]">
                      <span className="truncate">
                        {transaction.category}
                      </span>
                      <span className="text-[#66736E]/60 dark:text-[#64748B]">•</span>
                      <span className="font-mono truncate">
                        {transaction.account || "Cash"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Date */}
                <div className="text-right shrink-0 ml-3">
                  <p
                    className={`text-sm sm:text-base font-bold font-mono ${
                      isIncome ? "text-[#3F8F46] dark:text-[#00D09C]" : "text-[#D9573B] dark:text-[#F87171]"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹{Number(transaction.amount).toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-xs text-[#66736E] dark:text-[#94A3B8] font-mono">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default RecentTransactions;