export function Card({
  children,
  className = "",
  hover = true,
  glow = false,
  variant = "default",
  ...props
}) {
  const surfaceClass =
    variant === "elevated"
      ? "bg-[#FFFDF8] dark:bg-[#162447] border-[#E8E7DE] dark:border-[#1E2D4A] shadow-[0_4px_16px_-4px_rgba(16,42,42,0.08)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]"
      : "bg-[#FFFDF8] dark:bg-[#111C38] border-[#E8E7DE] dark:border-[#1E2D4A] shadow-[0_1px_3px_0_rgba(16,42,42,0.04),0_1px_2px_-1px_rgba(16,42,42,0.03)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]";

  return (
    <div
      className={`
        w-full
        rounded-2xl
        border
        ${surfaceClass}
        transition-all
        duration-200
        ${hover ? "hover:border-[#D5D3C8] dark:hover:border-[#2E4369] hover:shadow-[0_4px_16px_-4px_rgba(16,42,42,0.08)] dark:hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]" : ""}
        ${glow ? "hover:border-[#087F68]/40 dark:hover:border-[#00D09C]/40" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`flex items-center justify-between pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-base sm:text-lg font-bold tracking-tight text-[#102A2A] dark:text-[#F8FAFC] ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8] mt-1 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`pt-4 border-t border-[#E8E7DE] dark:border-[#1E2D4A] ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;