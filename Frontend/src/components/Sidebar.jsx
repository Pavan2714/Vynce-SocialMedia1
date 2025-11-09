import React from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import { Edit3, LogOut } from "lucide-react";
import { UserButton, useClerk } from "@clerk/clerk-react";
import { useSelector } from "react-redux";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);
  // const user = dummyUserData;
  const { signOut } = useClerk();

  return (
    <div
      className={`w-60 xl:w-72 bg-black border-r border-gray-700 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${
        sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="w-full">
        <div className="flex items-center gap-2">
          <img
            onClick={() => navigate("/")}
            src={assets.logo1}
            alt="Logo"
            className="h-18 w-45 object-contain mt-2 mb-2 cursor-pointer"
          />
        </div>

        <MenuItems setSidebarOpen={setSidebarOpen} />

        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer"
        >
          <Edit3 className="w-5 h-5" />
          Add Post
        </Link>
      </div>

      <div className="w-full p-4 px-7 flex items-center justify-between border-t border-gray-700">
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton />
          <div>
            <h1 className="text-sm font-medium text-white">{user.full_name}</h1>
            <p className="text-xs text-gray-400">@{user.username}</p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-300 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
