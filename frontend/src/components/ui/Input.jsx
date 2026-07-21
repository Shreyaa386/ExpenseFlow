import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      icon: Icon,
      error,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
      <div>
        {label && (
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <div
          className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition
          ${
            error
              ? "border-red-500"
              : "border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
          }`}
        >
          {Icon && (
            <Icon
              size={18}
              className="flex-shrink-0 text-slate-400"
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
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none"
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="text-slate-400 hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;