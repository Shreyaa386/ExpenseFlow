import { Pencil, Trash2 } from "lucide-react";

function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 p-12 text-center">
        <h2 className="text-xl font-semibold text-white">
          No Transactions Found
        </h2>

        <p className="mt-2 text-slate-400">
          Start by adding your first transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl">
      <table className="w-full">
        <thead className="border-b border-white/10 bg-slate-800/50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Title
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Category
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Account
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Amount
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Date
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction._id}
              className="border-b border-white/5 transition hover:bg-slate-800/40"
            >
              <td className="px-6 py-4 text-white">
                {transaction.title}
              </td>

              <td className="px-6 py-4 text-slate-300">
                {transaction.category}
              </td>

              <td className="px-6 py-4 text-slate-300">
                {transaction.account}
              </td>

              <td
                className={`px-6 py-4 font-semibold ${
                  transaction.type === "income"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}₹
                {transaction.amount.toLocaleString()}
              </td>

              <td className="px-6 py-4 text-slate-300">
                {new Date(transaction.date).toLocaleDateString()}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="rounded-lg bg-blue-500/20 p-2 text-blue-400 transition hover:bg-blue-500/30"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(transaction._id)}
                    className="rounded-lg bg-red-500/20 p-2 text-red-400 transition hover:bg-red-500/30"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;