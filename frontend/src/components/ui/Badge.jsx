export function Badge({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  ...props
}) {
  const variantStyles = {
    teal: "bg-[#087F68]/10 dark:bg-[#00D09C]/15 text-[#087F68] dark:text-[#00D09C] border-[#087F68]/25 dark:border-[#00D09C]/30",
    success: "bg-[#3F8F46]/10 dark:bg-[#10B981]/15 text-[#3F8F46] dark:text-[#34D399] border-[#3F8F46]/25 dark:border-[#10B981]/30",
    warning: "bg-[#E69A20]/10 dark:bg-[#F59E0B]/15 text-[#E69A20] dark:text-[#FBBF24] border-[#E69A20]/25 dark:border-[#F59E0B]/30",
    danger: "bg-[#D9573B]/10 dark:bg-[#EF4444]/15 text-[#D9573B] dark:text-[#F87171] border-[#D9573B]/25 dark:border-[#EF4444]/30",
    accent: "bg-[#D99016]/10 dark:bg-[#F59E0B]/15 text-[#D99016] dark:text-[#FBBF24] border-[#D99016]/25 dark:border-[#F59E0B]/30",
    blue: "bg-[#104E42]/10 dark:bg-[#087F68]/20 text-[#104E42] dark:text-[#00D09C] border-[#104E42]/25 dark:border-[#087F68]/30",
    violet: "bg-[#176453]/10 dark:bg-[#087F68]/20 text-[#176453] dark:text-[#00D09C] border-[#176453]/25 dark:border-[#087F68]/30",
    neutral: "bg-[#F8F7F0] dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] border-[#E8E7DE] dark:border-[#1E2D4A]",
  };

  const dotColors = {
    teal: "bg-[#087F68] dark:bg-[#00D09C]",
    success: "bg-[#3F8F46] dark:bg-[#10B981]",
    warning: "bg-[#E69A20] dark:bg-[#F59E0B]",
    danger: "bg-[#D9573B] dark:bg-[#EF4444]",
    accent: "bg-[#D99016] dark:bg-[#F59E0B]",
    blue: "bg-[#104E42] dark:bg-[#00D09C]",
    violet: "bg-[#176453] dark:bg-[#00D09C]",
    neutral: "bg-[#66736E] dark:bg-[#94A3B8]",
  };

  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5 gap-1 font-medium",
    md: "text-xs px-3 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-semibold",
  };

  const selectedVariant = variantStyles[variant] || variantStyles.neutral;
  const selectedDotColor = dotColors[variant] || dotColors.neutral;

  return (
    <span
      className={`
        inline-flex items-center rounded-full border tracking-wide uppercase font-mono
        ${sizeStyles[size] || sizeStyles.md}
        ${selectedVariant}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedDotColor}`}
          />
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${selectedDotColor}`}
          />
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
