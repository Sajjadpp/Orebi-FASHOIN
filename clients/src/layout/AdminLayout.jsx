
import AdminHeader from "../components/admin/Dashboard/Header/Header";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Dashboard/Sidebar/SideBar";
import { useContext } from "react";
import { SidebarContext } from "../context/SideBarContext";

const AdminLayout = () => {
    const {isToogle} = useContext(SidebarContext)
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`w-${isToogle ? "64" : "16"} bg-gray-100 hidden md:block hi`}>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-md">
          <AdminHeader />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
