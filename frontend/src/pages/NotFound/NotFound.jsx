import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#104E42]/10 border border-[#104E42]/20 flex items-center justify-center text-[#104E42] mb-6 shadow-xs">
        <Compass size={32} />
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-[#102A2A] tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-lg sm:text-xl font-bold text-[#102A2A] mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-[#66736E] max-w-md mb-8">
        The financial ledger view or page you requested cannot be found or may have moved.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-xl bg-[#104E42] hover:bg-[#176453] text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-all"
      >
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}

export default NotFound;