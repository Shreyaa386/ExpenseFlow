function Card({ children }) {
  return (
    <div className="w-full rounded-3xl border border-white/50 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
      {children}
    </div>
  );
}

export default Card;