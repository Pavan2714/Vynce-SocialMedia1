import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MenuItems from "./MenuItems";
import {
  Edit3,
  LogOut,
  Menu,
  Settings,
  Home,
  MessageSquare,
  Users,
  Compass,
  User,
} from "lucide-react";
import { useClerk } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user.value);
  const { signOut, openUserProfile } = useClerk();
  const [showMenu, setShowMenu] = useState(false);

  // Mobile navigation items
  const mobileNavItems = [
    { path: "/", icon: Home, label: "Feed" },
    { path: "/connections", icon: Users, label: "Connections" },
    {
      path: "/messages",
      icon: MessageSquare,
      label: "Messages",
      hasNotification: true,
    },
    { path: "/discover", icon: Compass, label: "Discover" },
    {
      path: `/profile/${user?._id}`,
      icon: User,
      label: "Profile",
      hasNotification: true,
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div
        className={`w-60 xl:w-72 bg-black border-r border-zinc-800 flex-col justify-between items-center h-screen fixed hidden sm:flex ${
          sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"
        } transition-all duration-300 ease-in-out z-20`}
      >
        {/* Scrollable Top Section */}
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="flex items-center gap-3 sticky top-0 bg-black z-10 px-6 py-10">
            {/* Logo on the left */}
            <img src={logo} alt="Logo" className="w-35 h-10 rounded-xl" />
          </div>

          <MenuItems setSidebarOpen={setSidebarOpen} />

          <Link
            to="/create-post"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center gap-2 py-3 mt-6 mx-4 mb-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all text-white font-medium cursor-pointer shadow-lg shadow-indigo-500/30"
          >
            <Edit3 className="w-5 h-5" />
            Add Post
          </Link>
        </div>

        {/* Fixed Bottom Section */}
        <div className="w-full p-4 border-t border-zinc-800 bg-black flex-shrink-0 relative">
          {/* Menu Dropdown */}
          {showMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
              <button
                onClick={() => {
                  openUserProfile();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-zinc-800 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Manage Account</span>
              </button>
              <button
                onClick={() => {
                  signOut();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-800 transition-colors border-t border-zinc-800"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          )}

          {/* User Info with Menu Button */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center flex-1 min-w-0">
              <img
                src={user.profile_picture}
                alt={user.full_name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-800"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-medium text-white truncate">
                  {user.full_name}
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  @{user.username}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-all"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800">
        <nav className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center flex-1 py-2 px-1 active:scale-95 transition-transform"
              >
                <div className="relative">
                  <div
                    className={`p-2 rounded-xl transition-all ${
                      active
                        ? "bg-white text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
