import { useEffect, useRef, useState } from "react";

export function Dropdown({
  trigger,
  children,
  align = "right",
  className = "",
  contentClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const alignStyles = {
    left: "left-0 origin-top-left",
    right: "right-0 origin-top-right",
    center: "left-1/2 -translate-x-1/2 origin-top",
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {typeof trigger === "function" ? trigger({ isOpen }) : trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute mt-2 z-50 min-w-[220px] rounded-2xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#162447] p-1.5 shadow-[0_12px_40px_rgba(16,42,42,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)]
            animate-in fade-in zoom-in-95 duration-150 text-[#102A2A] dark:text-[#F8FAFC]
            ${alignStyles[align] || alignStyles.right}
            ${contentClassName}
          `}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  icon: Icon,
  danger = false,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 text-left cursor-pointer
        ${
          danger
            ? "text-[#D9573B] dark:text-[#F87171] hover:bg-[#D9573B]/10 dark:hover:bg-[#D9573B]/20"
            : "text-[#102A2A] dark:text-[#F8FAFC] hover:bg-[#F8F7F0] dark:hover:bg-[#1E2D4A]"
        }
        ${className}
      `}
      {...props}
    >
      {Icon && (
        <Icon
          size={16}
          className={danger ? "text-[#D9573B] dark:text-[#F87171]" : "text-[#66736E] dark:text-[#94A3B8]"}
        />
      )}
      <span className="flex-1">{children}</span>
    </button>
  );
}

export function DropdownDivider({ className = "" }) {
  return <div className={`my-1 border-t border-[#E8E7DE] dark:border-[#1E2D4A] ${className}`} />;
}

export function DropdownHeader({ children, className = "" }) {
  return (
    <div className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] ${className}`}>
      {children}
    </div>
  );
}

export default Dropdown;
