import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      icon: Icon,
      error,
      type = "text",
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <div
          className={`flex items-center rounded-xl border bg-white transition-all duration-200 ${
            error
              ? "border-red-500"
              : "border-slate-300 focus-within:border-[#12C29D] focus-within:ring-4 focus-within:ring-[#12C29D]/10"
          }`}
        >
          {Icon && (
            <Icon
              size={20}
              className="ml-4 text-slate-400"
            />
          )}

          <input
            ref={ref}
            type={
              isPassword
                ? showPassword
                  ? "text"
                  : "password"
                : type
            }
            className={`w-full bg-transparent px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="mr-4 text-slate-400 transition hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;