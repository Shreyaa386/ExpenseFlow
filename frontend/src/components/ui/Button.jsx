function Button({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  loading = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex h-12 w-full items-center justify-center
        rounded-xl
        bg-[#12C29D]
        px-5
        font-semibold
        text-white
        transition-all
        duration-200
        hover:bg-[#0E9F82]
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;