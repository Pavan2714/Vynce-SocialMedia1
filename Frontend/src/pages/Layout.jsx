import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state) => state.user.value);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isChatBoxRoute = /^\/messages\/[^/]+$/.test(location.pathname);

  // Hide sidebar only on small screens for chatbox route
  const showSidebar = !(isChatBoxRoute && window.innerWidth < 640);

  return user ? (
    <div className="w-full flex min-h-screen">
      {showSidebar && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      {/* Main content area - now scrollable */}
      <div
        className={`flex-1 bg-slate-50 overflow-y-auto${
          showSidebar ? " sm:ml-60 xl:ml-72" : ""
        }`}
      >
        <Outlet />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
