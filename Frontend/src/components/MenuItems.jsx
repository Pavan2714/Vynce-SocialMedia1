import React from "react";
import { NavLink } from "react-router-dom";
import { Home, MessageSquare, Users, Compass, User } from "lucide-react";

const MenuItems = ({ setSidebarOpen }) => {
  const menuItems = [
    { name: "Feed", icon: Home, path: "/" },
    { name: "Messages", icon: MessageSquare, path: "/messages" },
    { name: "Connections", icon: Users, path: "/connections" },
    { name: "Discover", icon: Compass, path: "/discover" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="w-full px-4 space-y-2">
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
              isActive ? "bg-zinc-800" : "hover:bg-zinc-900"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className="w-6 h-6 text-white" />
              <span
                className={`text-base text-white ${
                  isActive ? "font-bold" : "font-normal"
                }`}
              >
                {item.name}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default MenuItems;
