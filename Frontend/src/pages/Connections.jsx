import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  UserRoundPen,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { fetchConnections } from "../features/connections/connectionsSlice";
import api from "../api/axios";
import toast from "react-hot-toast";

const Connections = () => {
  const [currentTab, setCurrentTab] = useState("Followers");

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const { connections, pendingConnections, followers, following } = useSelector(
    (state) => state.connections
  );

  const dataArray = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Following", value: following, icon: UserCheck },
    { label: "Pending", value: pendingConnections, icon: UserRoundPen },
    { label: "Connections", value: connections, icon: UserPlus },
  ];

  const handleUnfollow = async (userId) => {
    try {
      const { data } = await api.post(
        "/api/user/unfollow",
        { id: userId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(await getToken()));
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const acceptConnection = async (userId) => {
    try {
      const { data } = await api.post(
        "/api/user/accept",
        { id: userId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(await getToken()));
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchConnections(token));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Connections</h1>
          <p className="text-gray-400">
            Manage your network and discover new connections
          </p>
        </div>

        {/* Counts */}
        <div className="mb-8 flex flex-wrap gap-6">
          {dataArray.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-700 bg-gray-900 shadow rounded-md"
            >
              <b className="text-white">{item.value.length}</b>
              <p className="text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="inline-flex flex-wrap items-center border border-gray-700 rounded-md p-1 bg-gray-900 shadow-sm">
          {dataArray.map((tab) => (
            <button
              onClick={() => setCurrentTab(tab.label)}
              key={tab.label}
              className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                currentTab === tab.label
                  ? "bg-gray-800 font-medium text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="ml-1">{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-2 text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Connections */}
        <div className="flex flex-wrap gap-6 mt-6">
          {dataArray
            .find((item) => item.label === currentTab)
            .value.map((user) => (
              <div
                key={user._id}
                className="w-full max-w-88 flex gap-5 p-6 bg-gray-900 shadow rounded-md "
              >
                <img
                  src={user.profile_picture}
                  alt=""
                  className="rounded-full w-12 h-12 shadow-md mx-auto"
                />
                <div className="flex-1">
                  <p className="font-medium  text-white">{user.full_name}</p>
                  <p className="text-gray-400">@{user.username}</p>
                  <p className="text-sm text-gray-400">
                    {user.bio ? user.bio.slice(0, 30) : ""}
                    {user.bio && user.bio.length > 30 ? "..." : ""}
                  </p>
                  <div className="flex max-sm:flex-col gap-2 mt-4">
                    {
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer"
                      >
                        View Profile
                      </button>
                    }
                    {currentTab === "Following" && (
                      <button
                        onClick={() => handleUnfollow(user._id)}
                        className="w-full p-2 text-sm rounded bg-gray-800 hover:bg-gray-700 text-gray-200 active:scale-95 transition cursor-pointer"
                      >
                        Unfollow
                      </button>
                    )}
                    {currentTab === "Pending" && (
                      <button
                        onClick={() => acceptConnection(user._id)}
                        className="w-full p-2 text-sm rounded bg-gray-800 hover:bg-gray-700 text-gray-200 active:scale-95 transition cursor-pointer"
                      >
                        Accept
                      </button>
                    )}
                    {currentTab === "Connections" && (
                      <button
                        onClick={() => navigate(`/messages/${user._id}`)}
                        className="w-full p-2 text-sm rounded bg-gray-800 hover:bg-gray-700 text-gray-200 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
