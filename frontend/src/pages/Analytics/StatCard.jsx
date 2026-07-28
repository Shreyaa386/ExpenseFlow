import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Receipt,
} from "lucide-react";

function StatCard({ stat }) {
  const iconMap = {
    income: ArrowUpCircle,
    expense: ArrowDownCircle,
    saving: PiggyBank,
    transaction: Receipt,
  };

  const colorMap = {
    income: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-400",
      badge: "bg-emerald-500/15 text-emerald-400",
    },
    expense: {
      bg: "bg-red-500/15",
      text: "text-red-400",
      badge: "bg-red-500/15 text-red-400",
    },
    saving: {
      bg: "bg-indigo-500/15",
      text: "text-indigo-400",
      badge: "bg-indigo-500/15 text-indigo-400",
    },
    transaction: {
      bg: "bg-amber-500/15",
      text: "text-amber-400",
      badge: "bg-amber-500/15 text-amber-400",
    },
  };

  const Icon = iconMap[stat.type];
  const styles = colorMap[stat.type];

  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_20px_50px_rgba(99,102,241,0.18)]">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${styles.bg}`}
        >
          <Icon className={styles.text} size={28} />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
        >
          {stat.change}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm text-slate-400">
          {stat.title}
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          {stat.value}
        </h2>
      </div>
    </div>
  );
}

export default StatCard;