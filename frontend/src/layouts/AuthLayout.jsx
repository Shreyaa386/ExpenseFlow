import { Outlet } from "react-router-dom";
import Logo from "../components/common/Logo";

function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50" />

      {/* Large Blur Circle */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#12C29D]/15 blur-3xl" />

      {/* Bottom Blur */}
      <div className="absolute -right-32 -bottom-32 h-[420px] w-[420px] rounded-full bg-sky-200/20 blur-3xl" />

      {/* Decorative Circles */}
      <div className="absolute top-24 left-16 h-5 w-5 rounded-full bg-[#12C29D]/30" />
      <div className="absolute top-52 right-24 h-4 w-4 rounded-full bg-sky-300/40" />
      <div className="absolute bottom-36 left-40 h-8 w-8 rounded-full bg-emerald-200/40" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(#081B33 1px, transparent 1px),
            linear-gradient(90deg, #081B33 1px, transparent 1px)
          `,
          backgroundSize: "45px 45px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Logo
              size="md"
              showTagline={false}
            />
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;