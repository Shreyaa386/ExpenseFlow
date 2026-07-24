import { Bell, UserCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

function Navbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const pageData = {
    "/dashboard": {
      title: "Welcome Back 👋",
      subtitle: "Manage your expenses and income effortlessly.",
    },
    "/transactions": {
      title: "Transactions",
      subtitle: "Track and manage all your income and expenses.",
    },
    "/categories": {
      title: "Categories",
      subtitle: "Organize your income and expense categories.",
    },
    "/analytics": {
      title: "Analytics",
      subtitle: "Understand your financial trends and insights.",
    },
    "/profile": {
      title: "Profile",
      subtitle: "Manage your account settings.",
    },
  };

  const currentPage =
    pageData[pathname] || {
      title: "ExpenseFlow",
      subtitle: "Manage your finances smarter.",
    };

  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-10 py-6">
      {/* Left */}

      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          {currentPage.title}
        </h1>

        <p className="mt-2 text-base text-slate-400">
          {currentPage.subtitle}
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">
        <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 transition hover:border-slate-600">
          <Bell
            size={20}
            className="text-slate-300"
          />

          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">
          <UserCircle2
            size={46}
            className="text-indigo-400"
          />

          <div>
            <h3 className="text-base font-semibold text-white">
              {user?.name}
            </h3>

            <p className="text-sm text-slate-400">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;