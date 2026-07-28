import { Pencil, Trash2 } from "lucide-react";

function CategoryCard({
  category,
  onEdit,
  onDelete,
}) {
  const Icon = category.icon;

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_20px_50px_rgba(99,102,241,0.18)]">

      {/* Header */}

      <div className="flex items-center justify-between p-6">

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${category.bg}`}
        >
          <Icon
            size={30}
            className={category.color}
          />
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => onEdit(category)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-indigo-500/20 hover:text-indigo-400"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(category)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

      {/* Body */}

      <div className="px-6">

        <h3 className="truncate text-3xl font-bold text-white">
          {category.name}
        </h3>

        <span
          className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            category.type === "Income"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {category.type}
        </span>

      </div>

      {/* Footer */}

      <div className="mt-8 border-t border-slate-700 px-6 py-5">

        <div className="flex items-center justify-between">

          <p className="text-sm font-medium text-slate-400">
            Transactions
          </p>

          <span className="rounded-xl bg-slate-800 px-4 py-2 text-2xl font-bold text-white">
            {category.transactions}
          </span>

        </div>

      </div>

    </div>
  );
}

export default CategoryCard;