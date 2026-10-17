function SummaryCard({
  title,
  amount,
  icon: Icon,
  accent = "teal",
  badgeText = null,
  badgeType = "neutral",
  description = null,
}) {
  const accentStyles = {
    teal: {
      border: "hover:border-[#087F68]/40 dark:hover:border-[#00D09C]/40",
      iconBg: "bg-[#087F68]/10 dark:bg-[#00D09C]/15 text-[#087F68] dark:text-[#00D09C] border border-[#087F68]/20 dark:border-[#00D09C]/30",
    },
    emerald: {
      border: "hover:border-[#3F8F46]/40 dark:hover:border-[#10B981]/40",
      iconBg: "bg-[#3F8F46]/10 dark:bg-[#10B981]/15 text-[#3F8F46] dark:text-[#34D399] border border-[#3F8F46]/20 dark:border-[#10B981]/30",
    },
    rose: {
      border: "hover:border-[#D9573B]/40 dark:hover:border-[#EF4444]/40",
      iconBg: "bg-[#D9573B]/10 dark:bg-[#EF4444]/15 text-[#D9573B] dark:text-[#F87171] border border-[#D9573B]/20 dark:border-[#EF4444]/30",
    },
    blue: {
      border: "hover:border-[#104E42]/40 dark:hover:border-[#087F68]/40",
      iconBg: "bg-[#104E42]/10 dark:bg-[#087F68]/20 text-[#104E42] dark:text-[#00D09C] border border-[#104E42]/20 dark:border-[#087F68]/30",
    },
    violet: {
      border: "hover:border-[#D99016]/40 dark:hover:border-[#F59E0B]/40",
      iconBg: "bg-[#D99016]/10 dark:bg-[#F59E0B]/15 text-[#D99016] dark:text-[#FBBF24] border border-[#D99016]/20 dark:border-[#F59E0B]/30",
    },
  };

  const style = accentStyles[accent] || accentStyles.teal;

  const badgeStyles = {
    positive: "bg-[#3F8F46]/10 dark:bg-[#10B981]/15 text-[#3F8F46] dark:text-[#34D399] border-[#3F8F46]/20 dark:border-[#10B981]/30",
    negative: "bg-[#D9573B]/10 dark:bg-[#EF4444]/15 text-[#D9573B] dark:text-[#F87171] border-[#D9573B]/20 dark:border-[#EF4444]/30",
    neutral: "bg-[#F8F7F0] dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] border-[#E8E7DE] dark:border-[#1E2D4A]",
    info: "bg-[#104E42]/10 dark:bg-[#087F68]/20 text-[#104E42] dark:text-[#00D09C] border-[#104E42]/20 dark:border-[#087F68]/30",
  };

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 ${style.border} shadow-[0_1px_3px_0_rgba(16,42,42,0.04)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.3)] hover:shadow-[0_4px_16px_-4px_rgba(16,42,42,0.08)] dark:hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] min-h-[148px] sm:min-h-[154px]`}
    >
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] truncate">
              {title}
            </p>

            <h3 className="mt-2 text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#102A2A] dark:text-[#F8FAFC] truncate leading-tight">
              {amount}
            </h3>
          </div>

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg} transition-colors duration-150`}
          >
            <Icon size={20} />
          </div>
        </div>

        {/* Bottom Context */}
        {(badgeText || description) && (
          <div className="mt-4 flex items-center justify-between border-t border-[#E8E7DE] dark:border-[#1E2D4A] pt-3 text-xs gap-2 min-w-0">
            {badgeText && (
              <span
                className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium truncate ${
                  badgeStyles[badgeType] || badgeStyles.neutral
                }`}
              >
                {badgeText}
              </span>
            )}

            {description && (
              <p className="text-xs text-[#66736E] dark:text-[#94A3B8] font-medium ml-auto truncate">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;