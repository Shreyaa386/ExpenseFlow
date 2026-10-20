import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Card from "../../components/ui/Card";

function StatCard({ stat }) {
  const iconMap = {
    income: ArrowUpCircle,
    expense: ArrowDownCircle,
    saving: PiggyBank,
    transaction: Receipt,
  };

  const colorMap = {
    income: {
      bg: "bg-[#3F8F46]/10",
      text: "text-[#3F8F46]",
      border: "hover:border-[#3F8F46]/40",
    },
    expense: {
      bg: "bg-[#D9573B]/10",
      text: "text-[#D9573B]",
      border: "hover:border-[#D9573B]/40",
    },
    saving: {
      bg: "bg-[#087F68]/10",
      text: "text-[#087F68]",
      border: "hover:border-[#087F68]/40",
    },
    transaction: {
      bg: "bg-[#D99016]/10",
      text: "text-[#D99016]",
      border: "hover:border-[#D99016]/40",
    },
  };

  const Icon = iconMap[stat.type] || Receipt;
  const styles = colorMap[stat.type] || colorMap.transaction;

  return (
    <Card className="p-5 sm:p-6 min-h-[148px] sm:min-h-[154px] flex flex-col justify-between transition-all duration-200 hover:border-[#D5D3C8] shadow-[0_1px_3px_0_rgba(16,42,42,0.04)]">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8E7DE] ${styles.bg}`}
        >
          <Icon className={styles.text} size={20} />
        </div>

        {stat.change !== undefined && stat.change !== null && stat.change !== "" ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium ${
              stat.changeDirection === "positive"
                ? "border-[#3F8F46]/30 bg-[#3F8F46]/10 text-[#3F8F46]"
                : stat.changeDirection === "negative"
                ? "border-[#D9573B]/30 bg-[#D9573B]/10 text-[#D9573B]"
                : "border-[#E8E7DE] bg-[#F8F7F0] text-[#66736E]"
            }`}
          >
            {stat.changeDirection === "positive" ? (
              <ArrowUpRight size={13} />
            ) : stat.changeDirection === "negative" ? (
              <ArrowDownRight size={13} />
            ) : null}
            <span>{stat.change}</span>
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E]">
          {stat.title}
        </p>

        <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A] font-mono truncate leading-tight">
          {stat.value}
        </h3>

        {stat.subtitle && (
          <p className="mt-1 text-xs text-[#66736E] truncate">
            {stat.subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}

export default StatCard;