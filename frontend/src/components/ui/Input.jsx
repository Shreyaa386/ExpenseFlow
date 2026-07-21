import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    return (
      <div>
        {label && (
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
          {Icon && (
            <Icon
              size={18}
              className="flex-shrink-0 text-slate-400"
            />
          )}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none"
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;