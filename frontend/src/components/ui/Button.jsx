function Button({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium tracking-tight rounded-xl transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer";

  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#104E42] dark:bg-[#087F68] hover:bg-[#176453] dark:hover:bg-[#076e5a] text-white font-medium shadow-sm border border-[#104E42] dark:border-[#087F68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104E42]/20 dark:focus-visible:ring-[#087F68]/30",
    accent:
      "bg-[#D99016] dark:bg-[#D99016] hover:bg-[#c48113] text-white font-medium shadow-sm border border-[#D99016]",
    secondary:
      "bg-[#FFFDF8] dark:bg-[#162447] hover:bg-[#F8F7F0] dark:hover:bg-[#1E2D4A] text-[#102A2A] dark:text-[#F8FAFC] border border-[#E8E7DE] dark:border-[#1E2D4A] hover:border-[#D5D3C8] dark:hover:border-[#2E4369] shadow-sm",
    outline:
      "bg-transparent hover:bg-[#F8F7F0] dark:hover:bg-[#162447] text-[#102A2A] dark:text-[#F8FAFC] border border-[#E8E7DE] dark:border-[#1E2D4A] hover:border-[#D5D3C8] dark:hover:border-[#2E4369]",
    ghost:
      "bg-transparent hover:bg-[#104E42]/5 dark:hover:bg-[#162447] text-[#66736E] dark:text-[#94A3B8] hover:text-[#102A2A] dark:hover:text-[#F8FAFC]",
    danger:
      "bg-[#D9573B] hover:bg-[#c24c32] text-white font-medium shadow-sm border border-[#D9573B]",
    teal:
      "bg-[#087F68] hover:bg-[#076e5a] text-white font-medium shadow-sm border border-[#087F68]",
    violet:
      "bg-[#104E42] dark:bg-[#087F68] hover:bg-[#176453] dark:hover:bg-[#076e5a] text-white font-medium shadow-sm border border-[#104E42] dark:border-[#087F68]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;