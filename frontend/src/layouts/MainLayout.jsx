import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#020617]">
      {/* Sidebar */}
      <div className="p-5">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="my-5 mr-5 flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0B1120] shadow-2xl">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-10 pt-8 pb-10">
          <div className="mx-auto w-full max-w-[1700px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;