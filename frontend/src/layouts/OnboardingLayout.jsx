import { Outlet } from "react-router-dom";
import Logo from "../components/common/Logo";

function OnboardingLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F7F0] px-4 sm:px-6 py-10 text-[#102A2A]">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 rounded-full bg-[#104E42]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-[#D99016]/8 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-[#E8E7DE] bg-[#FFFDF8] p-6 sm:p-10 shadow-[0_12px_40px_rgba(16,78,66,0.06)]">
        <div className="mb-8 flex justify-center">
          <Logo size="md" showTagline={false} />
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default OnboardingLayout;