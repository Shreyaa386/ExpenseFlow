import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-3 text-slate-600">
            Welcome {user?.name}
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;