import {
  LayoutDashboard,
  Receipt,
  Tags,
  ChartColumn,
  User,
  LogOut,
  Search,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/expenseflow-logo.png";

const menuItems = [
  {
  title: "Dashboard",
  icon: LayoutDashboard,
  path: "/",
},
  {
    title: "Transactions",
    icon: Receipt,
    path: "/transactions",
  },
  {
    title: "Categories",
    icon: Tags,
    path: "/categories",
  },
  {
    title: "Analytics",
    icon: ChartColumn,
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
<aside className="flex h-full w-[340px] flex-col rounded-3xl border border-slate-800 bg-[#0F172A] px-7 py-8">      {/* Logo */}
      <div className="flex items-center gap-5">
        <img
          src={logo}
          alt="ExpenseFlow"
          className="h-14 w-14 rounded-2xl object-cover shadow-lg"
        />

        <h1 className="text-[32px] font-bold tracking-tight text-white">
          ExpenseFlow
        </h1>
      </div>

      {/* Search */}
      <div className="mt-10 mb-12 px-2">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4">
          <Search
            size={21}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-[16px] text-white placeholder:text-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-5 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-5 rounded-2xl px-5 py-4 transition-all duration-200 ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={23} />

              <span className="text-[18px] font-medium">
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-10 border-t border-slate-800 pt-8 px-2">
        <button
          onClick={logout}
          className="flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={23} />

          <span className="text-[18px] font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;