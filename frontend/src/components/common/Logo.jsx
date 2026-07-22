import logo from "../../assets/images/expenseflow-logo.jpeg";

function Logo({
  size = "md",
  showTagline = true,
  className = "",
}) {
  const sizes = {
    sm: {
      width: "w-36",
      tagline: "text-xs",
    },
    md: {
      width: "w-52",
      tagline: "text-sm",
    },
    lg: {
      width: "w-72",
      tagline: "text-base",
    },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div
      className={`flex flex-col items-center ${className}`}
    >
      <img
        src={logo}
        alt="ExpenseFlow Logo"
        className={`${currentSize.width} object-contain`}
      />

      {showTagline && (
        <p
          className={`mt-2 font-medium tracking-wide text-slate-500 ${currentSize.tagline}`}
        >
          Track. Manage. Grow.
        </p>
      )}
    </div>
  );
}

export default Logo;