function Card({ children, className = "" }) {
  return (
    <div
      className={`
        w-full
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;