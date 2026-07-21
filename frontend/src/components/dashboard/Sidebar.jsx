import {
  LayoutDashboard,
  Wallet,
  Tags,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Transactions",
    icon: Wallet,
    path: "/transactions",
  },
  {
    title: "Categories",
    icon: Tags,
    path: "/categories",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
];

function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="border-b border-white/10 px-8 py-8">
        <h1 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-4xl font-extrabold text-transparent">
          ExpenseFlow
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Smart Expense Management
        </p>
      </div>

      <nav className="flex-1 space-y-3 px-5 py-8">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={22} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-5">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 px-5 py-4 font-semibold text-white transition hover:bg-red-600"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;