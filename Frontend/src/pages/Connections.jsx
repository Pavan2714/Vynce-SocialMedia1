import React, { useEffect, useState } from "react";
import { MessageSquare, X, UserCheck, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { fetchConnections } from "../features/connections/connectionsSlice";
import api from "../api/axios";
import toast from "react-hot-toast";
import followersIcon from "../assets/icons/followers.png";
import followingIcon from "../assets/icons/following.png";
import pendingIcon from "../assets/icons/pending.png";
import connectionsIcon from "../assets/icons/connections.png";

const Connections = () => {
  const [currentTab, setCurrentTab] = useState("Followers");

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const { connections, pendingConnections, followers, following } = useSelector(
    (state) => state.connections
  );

  const dataArray = [
    {
      label: "Followers",
      value: followers,
      icon: followersIcon,
      color: "blue",
    },
    {
      label: "Following",
      value: following,
      icon: followingIcon,
      color: "green",
    },
    {
      label: "Pending",
      value: pendingConnections,
      icon: pendingIcon,
      color: "yellow",
    },
    {
      label: "Connections",
      value: connections,
      icon: connectionsIcon,
      color: "purple",
    },
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

  const handleRemoveConnection = async (userId) => {
    try {
      const { data } = await api.post(
        "/api/user/remove-connection",
        { id: userId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(await getToken()));
      } else {
        toast.error(data.message);
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
    <div className="min-h-screen bg-black overflow-y-auto pb-[50px]">
      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-10 bg-black px-4 py-4 sm:hidden border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30 p-2.5">
              <img
                src={connectionsIcon}
                alt="My Network"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-light text-white leading-tight">
                My Network
              </h1>
              <p className="text-sm text-gray-400 mt-1">Manage connections</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Desktop Header Section */}
        <div className="mb-6 sm:mb-8 hidden sm:block">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 p-2.5">
              <img
                src={connectionsIcon}
                alt="Discover People"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-left">
              <h1 className="text-2xl font-light text-white">My Network</h1>
              <p className="text-sm text-gray-400 mt-1">
                Manage your connections and grow your network
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Increased Size for Mobile */}
        <div className="flex items-center justify-center sm:justify-start mb-6 sm:mb-8">
          <div className="w-full sm:w-auto inline-flex bg-zinc-900 border border-zinc-800 rounded-2xl p-2 sm:p-1.5 gap-2 sm:gap-1 shadow-xl">
            {dataArray.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setCurrentTab(tab.label)}
                className={`relative flex flex-col items-center justify-center gap-1.5 px-3 py-3 flex-1 sm:flex-initial sm:flex-row sm:gap-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  currentTab === tab.label
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {/* Icon with conditional background - Larger on Mobile */}
                {currentTab === tab.label ? (
                  <div className="bg-zinc-100 p-2 sm:p-1.5 rounded-lg flex-shrink-0">
                    <img
                      src={tab.icon}
                      alt={tab.label}
                      className="w-5 h-5 sm:w-4 sm:h-4 object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 p-0.5">
                    <img
                      src={tab.icon}
                      alt={tab.label}
                      className="w-5 h-5 sm:w-4 sm:h-4 object-contain opacity-60"
                    />
                  </div>
                )}

                {/* Label - Larger on Mobile */}
                <span className="text-[10px] leading-tight sm:text-sm font-medium">
                  {tab.label}
                </span>

                {/* Count Badge - Larger on Mobile */}
                <span
                  className={`absolute -top-1 -right-1 sm:static text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-1.5 rounded-full sm:rounded-md min-w-[20px] sm:min-w-[18px] text-center ${
                    currentTab === tab.label
                      ? "bg-black text-white sm:bg-zinc-200 sm:text-black"
                      : "bg-red-500 text-white sm:bg-zinc-800 sm:text-gray-300"
                  }`}
                >
                  {tab.value.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Users List/Grid */}
        {dataArray.find((item) => item.label === currentTab).value.length >
        0 ? (
          <div className="space-y-3 sm:space-y-4">
            {dataArray
              .find((item) => item.label === currentTab)
              .value.map((user) => (
                <div
                  key={user._id}
                  className="group bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-zinc-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Profile Section */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                      <div
                        className="relative flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/profile/${user._id}`)}
                      >
                        <img
                          src={user.profile_picture}
                          alt={user.full_name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover ring-2 ring-zinc-800 group-hover:ring-indigo-500/50 transition-all duration-300 hover:scale-105"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-white text-sm sm:text-base mb-0.5 truncate cursor-pointer hover:text-indigo-400 transition-colors"
                          onClick={() => navigate(`/profile/${user._id}`)}
                        >
                          {user.full_name}
                        </h3>
                        <p className="text-xs text-gray-400 mb-1 truncate">
                          @{user.username}
                        </p>
                        {user.bio && (
                          <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 hidden sm:block">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      {/* Following Tab - Unfollow Button */}
                      {currentTab === "Following" && (
                        <button
                          onClick={() => handleUnfollow(user._id)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-zinc-800 hover:bg-red-600 text-gray-300 hover:text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all border border-zinc-700"
                        >
                          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Unfollow</span>
                        </button>
                      )}

                      {/* Pending Tab - Accept Button */}
                      {currentTab === "Pending" && (
                        <button
                          onClick={() => acceptConnection(user._id)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all shadow-lg shadow-green-500/30"
                        >
                          <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Accept</span>
                        </button>
                      )}

                      {/* Connections Tab - Message & Remove Buttons */}
                      {currentTab === "Connections" && (
                        <>
                          <button
                            onClick={() => navigate(`/messages/${user._id}`)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-zinc-800 hover:bg-blue-600 text-gray-300 hover:text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all border border-zinc-700"
                          >
                            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>Message</span>
                          </button>
                          <button
                            onClick={() => handleRemoveConnection(user._id)}
                            className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-auto sm:gap-1.5 sm:px-4 sm:py-2.5 bg-zinc-800 hover:bg-red-600 text-gray-300 hover:text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all border border-zinc-700"
                          >
                            <UserMinus className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          // Empty State - Centered and Optimized for Mobile
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)] py-16 px-4">
            <div className="w-24 h-24 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <img
                src={dataArray.find((item) => item.label === currentTab).icon}
                alt={currentTab}
                className="w-12 h-12 object-contain opacity-50"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 text-center">
              No {currentTab.toLowerCase()} yet
            </h3>
            <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
              Start building your network by connecting with people who share
              your interests
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
