import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-8 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;