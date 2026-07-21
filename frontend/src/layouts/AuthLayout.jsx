import { Outlet } from "react-router-dom";
import Logo from "../components/ui/Logo";

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
      
      {/* Background Blur Circles */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>

      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-300 opacity-20 blur-3xl"></div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Logo />

        <div className="mt-8 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;