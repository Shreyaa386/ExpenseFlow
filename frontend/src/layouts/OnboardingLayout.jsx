import { Outlet } from "react-router-dom";

import Logo from "../components/common/Logo";

function OnboardingLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#ECFDF5] px-6 py-10">
      {/* Background Blur */}
      <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-[#12C29D]/10 blur-3xl"></div>

      <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#0E9F82]/10 blur-3xl"></div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#081B33 1px, transparent 1px), linear-gradient(90deg, #081B33 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-2xl backdrop-blur-md">
        <div className="mb-10 flex justify-center">
          <Logo size="md" showTagline={false} />
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default OnboardingLayout;