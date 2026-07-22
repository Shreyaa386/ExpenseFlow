import { ArrowUpRight } from "lucide-react";

function SummaryCard({
  title,
  amount,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {amount}
          </h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <Icon className={iconColor} size={28} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-emerald-400">
        <ArrowUpRight size={16} />
        +12% from last month
      </div>
    </div>
  );
}

export default SummaryCard;