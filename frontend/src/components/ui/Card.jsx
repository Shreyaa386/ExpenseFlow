function Card({ children, className = "" }) {
  return (
    <div
      className={`
        w-full
        rounded-3xl
        border
        border-white/10
        bg-slate-900/70
        backdrop-blur-xl
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        transition-all
        duration-300
        hover:border-indigo-500/30
        hover:shadow-[0_12px_40px_rgba(99,102,241,0.12)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;