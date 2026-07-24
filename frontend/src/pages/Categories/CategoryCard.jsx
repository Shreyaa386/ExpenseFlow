import { Pencil, Trash2 } from "lucide-react";

function CategoryCard({
  category,
  onEdit,
  onDelete,
}) {
  const Icon = category.icon;

  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_12px_40px_rgba(79,70,229,0.15)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${category.bg}`}
        >
          <Icon
            size={30}
            className={category.color}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit?.(category)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete?.(category)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white">
          {category.name}
        </h3>

        <span
          className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            category.type === "Income"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {category.type}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-slate-800 pt-5">
        <p className="text-sm text-slate-400">
          Transactions
        </p>

        <h4 className="mt-2 text-3xl font-bold text-white">
          {category.transactions}
        </h4>
      </div>
    </div>
  );
}

export default CategoryCard;