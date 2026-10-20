import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-lg",
  showClose = true,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#102A2A]/40 dark:bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={`
          relative w-full ${maxWidth} rounded-2xl sm:rounded-3xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#162447] p-6 sm:p-7 shadow-[0_20px_50px_rgba(16,42,42,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]
          z-10 transition-all animate-in zoom-in-95 fade-in duration-200 my-auto max-h-[calc(100vh-3rem)] flex flex-col text-[#102A2A] dark:text-[#F8FAFC]
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="mb-5 flex items-start justify-between gap-4 shrink-0">
            <div>
              {title && (
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#102A2A] dark:text-[#F8FAFC]">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8] leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-[#66736E] dark:text-[#94A3B8] transition hover:bg-[#F8F7F0] dark:hover:bg-[#0E172F] hover:text-[#102A2A] dark:hover:text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F68]/30 cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto pr-1 -mr-1">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
