import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export const Select = forwardRef(
  ({ label, error, options = [], className = "", children, ...props }, ref) => {
    return (
      <div className={`w-full text-left ${label || error ? "space-y-1.5" : ""}`}>
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#102A2A] dark:text-[#F8FAFC]">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full h-11 appearance-none rounded-xl border bg-white dark:bg-[#0E172F] px-3.5 pr-10 text-xs sm:text-sm font-normal text-[#102A2A] dark:text-[#F8FAFC] outline-none transition-all duration-200
              ${
                error
                  ? "border-[#D9573B] focus:border-[#D9573B] focus:ring-2 focus:ring-[#D9573B]/15"
                  : "border-[#E8E7DE] dark:border-[#1E2D4A] hover:border-[#D5D3C8] dark:hover:border-[#2E4369] focus:border-[#087F68] dark:focus:border-[#00D09C] focus:ring-2 focus:ring-[#087F68]/15 dark:focus:ring-[#00D09C]/20"
              }
              ${className}
            `}
            {...props}
          >
            {options.length > 0
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-white dark:bg-[#111C38] text-[#102A2A] dark:text-[#F8FAFC] py-2"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#66736E] dark:text-[#94A3B8]">
            <ChevronDown size={16} />
          </div>
        </div>

        {error && (
          <p className="text-xs text-[#D9573B] dark:text-[#F87171] flex items-center gap-1 font-medium">
            <span>•</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
