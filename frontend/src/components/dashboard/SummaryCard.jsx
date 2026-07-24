import { ArrowUpRight } from "lucide-react";

function SummaryCard({
  title,
  amount,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl">
      {/* Glow */}
      <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-300 group-hover:bg-indigo-500/20"></div>

      <div className="relative z-10">
        {/* Top */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              {title}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
              {amount}
            </h2>
          </div>

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} transition duration-300 group-hover:scale-105`}
          >
            <Icon
              size={26}
              className={iconColor}
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20">
              <ArrowUpRight
                size={15}
                className="text-emerald-400"
              />
            </div>

            <span className="text-sm font-semibold text-emerald-400">
              +12%
            </span>
          </div>

          <p className="text-xs text-slate-500">
            vs last month
          </p>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;