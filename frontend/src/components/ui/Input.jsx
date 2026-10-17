import { forwardRef, useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      icon: Icon,
      error,
      type = "text",
      className = "",
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id || props.name || generatedId;
    const isPassword = type === "password";

    return (
      <div className={`w-full text-left ${label || error || helperText ? "space-y-1.5" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-[13px] font-semibold text-[#102A2A] dark:text-[#F8FAFC]"
          >
            {label}
          </label>
        )}

        <div
          className={`relative flex items-center rounded-xl border bg-white dark:bg-[#0E172F] transition-all duration-200 ${
            error
              ? "border-[#D9573B] focus-within:border-[#D9573B] focus-within:ring-2 focus-within:ring-[#D9573B]/15"
              : "border-[#E8E7DE] dark:border-[#1E2D4A] hover:border-[#D5D3C8] dark:hover:border-[#2E4369] focus-within:border-[#087F68] dark:focus-within:border-[#00D09C] focus-within:ring-2 focus-within:ring-[#087F68]/15 dark:focus-within:ring-[#00D09C]/20"
          }`}
        >
          {Icon && (
            <div className="pointer-events-none pl-3.5 pr-1 text-[#66736E] dark:text-[#94A3B8] flex items-center justify-center">
              <Icon size={18} />
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={`w-full bg-transparent px-3.5 py-2.5 text-sm font-normal text-[#102A2A] dark:text-[#F8FAFC] placeholder:text-[#66736E]/60 dark:placeholder:text-[#94A3B8]/60 focus:outline-none ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="mr-3 p-1 text-[#66736E] dark:text-[#94A3B8] transition hover:text-[#102A2A] dark:hover:text-[#F8FAFC] focus:outline-none focus:text-[#087F68] cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error ? (
          <p className="text-xs text-[#D9573B] dark:text-[#F87171] flex items-center gap-1 font-medium mt-1">
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-[#66736E] dark:text-[#94A3B8] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;