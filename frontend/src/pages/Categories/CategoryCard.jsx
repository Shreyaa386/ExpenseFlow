import { Pencil, Trash2 } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { getCategoryIconMeta } from "../../constants/categoryIcons";

function CategoryCard({
  category,
  onEdit,
  onDelete,
  deleteLoading = false,
}) {
  const meta = getCategoryIconMeta(category.icon || category.name);
  const Icon = meta.icon;
  const isIncome = (category.type || "").toLowerCase() === "income";

  return (
    <Card className="p-4 sm:p-5 flex flex-col justify-between h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D99016]/40 min-h-[185px]">
      <div>
        {/* Top Header: Icon & Actions */}
        <div className="flex items-center justify-between gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] transition-transform duration-200 group-hover:scale-105 ${meta.bg}`}
          >
            <Icon size={20} className={meta.color} />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(category)}
              title="Edit category"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] transition hover:border-[#104E42] dark:hover:border-[#00D09C] hover:bg-[#FFFDF8] dark:hover:bg-[#162447] hover:text-[#104E42] dark:hover:text-[#00D09C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F68] dark:focus-visible:ring-[#00D09C] cursor-pointer"
            >
              <Pencil size={14} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(category)}
              disabled={deleteLoading}
              title="Delete category"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] transition hover:border-[#D9573B] dark:hover:border-[#F87171] hover:bg-[#D9573B]/10 hover:text-[#D9573B] dark:hover:text-[#F87171] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9573B] cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Category Name & Badge */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <h3 className="truncate text-base sm:text-lg font-bold tracking-tight text-[#102A2A] dark:text-[#F8FAFC]">
            {category.name}
          </h3>

          <Badge variant={isIncome ? "success" : "danger"} size="sm">
            {category.type}
          </Badge>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-[#E8E7DE] dark:border-[#1E2D4A] pt-3.5">
        <div className="rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] truncate">
            Entries
          </p>
          <p className="mt-0.5 text-sm font-bold text-[#102A2A] dark:text-[#F8FAFC] font-mono">
            {category.transactionsCount || 0}
          </p>
        </div>

        <div className="rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] p-3 text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] truncate">
            Total Volume
          </p>
          <p
            className={`mt-0.5 text-sm font-bold font-mono truncate ${
              isIncome ? "text-[#3F8F46] dark:text-[#00D09C]" : "text-[#102A2A] dark:text-[#F8FAFC]"
            }`}
          >
            ₹{(category.totalAmount || 0).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default CategoryCard;