import { Outlet } from "react-router-dom";
import Logo from "../components/common/Logo";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <Logo size="lg" />
          </div>

          {/* Login / Signup Form */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;