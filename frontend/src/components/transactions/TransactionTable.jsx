import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight, FileText } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table";

function TransactionTable({
  transactions = [],
  onEdit,
  onDelete,
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] p-12 text-center shadow-[0_1px_3px_0_rgba(16,42,42,0.04)]">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68] dark:bg-[#00D09C]/10 dark:text-[#00D09C] border border-[#087F68]/20 dark:border-[#00D09C]/20">
          <FileText size={20} />
        </div>
        <h3 className="text-base font-bold text-[#102A2A] dark:text-[#F8FAFC]">
          No Transactions Found
        </h3>
        <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8] max-w-xs mx-auto">
          No records match your active filters or your account ledger is currently empty.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow hover={false}>
          <TableHead>Transaction</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Flow Amount</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((transaction) => {
          const isIncome = transaction.type === "income";

          return (
            <TableRow key={transaction._id}>
              {/* Title & Memo */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                      isIncome
                        ? "border-[#3F8F46]/20 bg-[#3F8F46]/10 text-[#3F8F46] dark:border-[#00D09C]/30 dark:bg-[#00D09C]/15 dark:text-[#00D09C]"
                        : "border-[#D9573B]/20 bg-[#D9573B]/10 text-[#D9573B] dark:border-[#F87171]/30 dark:bg-[#F87171]/15 dark:text-[#F87171]"
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-[#102A2A] dark:text-[#F8FAFC] truncate max-w-xs text-sm sm:text-[15px]">
                      {transaction.title}
                    </p>
                    {transaction.note && (
                      <div className="flex items-center gap-1 mt-0.5 text-[#66736E] dark:text-[#94A3B8] text-xs truncate max-w-xs">
                        <FileText size={12} className="shrink-0" />
                        <span className="truncate">{transaction.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Category */}
              <TableCell>
                <span className="inline-block rounded-lg border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] px-2.5 py-1 text-xs text-[#102A2A] dark:text-[#F8FAFC] font-medium">
                  {transaction.category}
                </span>
              </TableCell>

              {/* Account */}
              <TableCell>
                <span className="text-xs text-[#66736E] dark:text-[#94A3B8] font-mono">
                  {transaction.account || "Cash"}
                </span>
              </TableCell>

              {/* Amount */}
              <TableCell>
                <span
                  className={`text-sm sm:text-base font-bold font-mono ${
                    isIncome ? "text-[#3F8F46] dark:text-[#00D09C]" : "text-[#D9573B] dark:text-[#F87171]"
                  }`}
                >
                  {isIncome ? "+" : "-"}₹{Number(transaction.amount).toLocaleString()}
                </span>
              </TableCell>

              {/* Date */}
              <TableCell>
                <span className="text-xs text-[#66736E] dark:text-[#94A3B8] font-mono">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(transaction)}
                    title="Edit transaction"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] transition hover:border-[#104E42] dark:hover:border-[#00D09C] hover:bg-[#FFFDF8] dark:hover:bg-[#162447] hover:text-[#104E42] dark:hover:text-[#00D09C] cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(transaction._id)}
                    title="Delete transaction"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] transition hover:border-[#D9573B] dark:hover:border-[#F87171] hover:bg-[#D9573B]/10 dark:hover:bg-[#F87171]/20 hover:text-[#D9573B] dark:hover:text-[#F87171] cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default TransactionTable;