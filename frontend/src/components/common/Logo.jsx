import { Link } from "react-router-dom";
import logoImg from "../../assets/images/expenseflow-logo.png";

export function LogoMark({ className = "h-10 w-10" }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 via-blue-500 to-violet-600 p-[1.5px] shadow-[0_0_20px_rgba(20,184,166,0.35)] ${className}`}
    >
      <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#070B14] overflow-hidden">
        <img
          src={logoImg}
          alt="ExpenseFlow Mark"
          className="h-full w-full object-cover scale-110"
          onError={(e) => {
            // Fallback to stylized SVG if image missing
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Vector SVG Fallback */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-teal-400 absolute"
          style={{ pointerEvents: "none" }}
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
    </div>
  );
}

function Logo({
  size = "md",
  showTagline = true,
  className = "",
  to = "/",
  variant = "light", // 'light' (for dark backgrounds) or 'dark' (for light/cream backgrounds)
}) {
  const sizes = {
    sm: {
      mark: "h-8 w-8",
      text: "text-lg",
      tagline: "text-[10px]",
    },
    md: {
      mark: "h-10 w-10",
      text: "text-xl",
      tagline: "text-xs",
    },
    lg: {
      mark: "h-14 w-14",
      text: "text-3xl",
      tagline: "text-sm",
    },
  };

  const currentSize = sizes[size] || sizes.md;
  const isDarkText = variant === "dark";

  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <LogoMark className={currentSize.mark} />

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {isDarkText ? (
            <span
              className={`font-black tracking-tight text-[#102A2A] ${currentSize.text}`}
            >
              Expense<span className="text-[#087F68]">Flow</span>
            </span>
          ) : (
            <span
              className={`font-black tracking-tight text-white ${currentSize.text} bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent`}
            >
              Expense<span className="text-teal-400">Flow</span>
            </span>
          )}

          <span
            className={`rounded-md px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
              isDarkText
                ? "border border-[#087F68]/20 bg-[#087F68]/10 text-[#087F68]"
                : "border border-teal-500/30 bg-teal-500/10 text-teal-400"
            }`}
          >
            PRO
          </span>
        </div>

        {showTagline && (
          <p
            className={`font-medium tracking-wider ${
              isDarkText ? "text-[#66736E]" : "text-slate-400"
            } ${currentSize.tagline}`}
          >
            Track • Manage • Grow
          </p>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;