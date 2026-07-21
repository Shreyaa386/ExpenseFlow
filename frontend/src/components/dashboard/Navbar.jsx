import { Bell, Search, UserCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-8 py-5 backdrop-blur-xl">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome, {user?.name?.split(" ")[0]} 👋
        </h1>

        <p className="mt-1 text-slate-400">
          Manage your finances smarter with ExpenseFlow.
        </p>
      </div>

      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-800 px-4 py-3">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-52 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Notification */}
        <button className="rounded-xl border border-white/10 bg-slate-800 p-3 transition hover:bg-slate-700">
          <Bell className="text-white" size={20} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-800 px-4 py-2">
          <UserCircle2 size={42} className="text-indigo-400" />

          <div>
            <p className="font-semibold text-white">{user?.name}</p>

            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;