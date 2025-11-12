import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state) => state.user.value);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return user ? (
    <div className="w-full flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content area - now scrollable */}
      <div className="flex-1 bg-slate-50 sm:ml-60 xl:ml-72 overflow-y-auto">
        <Outlet />
      </div>

      {/* Overlay for mobile when sidebar is open
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {sidebarOpen ? (
        <X
          className="fixed top-3 right-3 p-2 z-30 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : (
        <Menu
          className="fixed top-3 right-3 p-2 z-30 bg-white rounded-md shadow w-10 h-10 text-gray-600 hidden sm:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )} */}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
