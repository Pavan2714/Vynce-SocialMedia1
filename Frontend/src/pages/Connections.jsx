import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Eye,
  X,
  UserCheck,
  UserPlus,
  UserMinus,
} from "lucide-react";
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
  const [currentTab, setCurrentTab] = useState("Connections");
  const [loadingStates, setLoadingStates] = useState({});

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const {
    connections = [],
    pendingConnections = [],
    sentRequests = [],
    followers = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.connections);

  const dataArray = [
    {
      label: "Connections",
      value: connections,
      icon: connectionsIcon,
      description: "Your accepted connections",
    },
    {
      label: "Pending",
      value: pendingConnections,
      icon: pendingIcon,
      description: "Connection requests you received",
    },
    {
      label: "Sent",
      value: sentRequests,
      icon: followingIcon,
      description: "Connection requests you sent",
    },
    {
      label: "Followers",
      value: followers,
      icon: followersIcon,
      description: "People who follow you",
    },
  ];

  // Helper function to check connection status
  const getConnectionStatus = (userId) => {
    if (connections.some((conn) => conn._id === userId)) return "connected";
    if (sentRequests.some((req) => req._id === userId)) return "sent";
    if (pendingConnections.some((req) => req._id === userId)) return "received";
    return "none";
  };

  // Send connection request
  const sendConnectionRequest = async (userId) => {
    if (loadingStates[userId]) return;

    setLoadingStates((prev) => ({ ...prev, [userId]: true }));

    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/connect",
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Connection request sent!");
        await dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Send connection error:", error);
      toast.error(error?.response?.data?.message || "Failed to send request");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Accept connection request
  const acceptConnection = async (userId) => {
    if (loadingStates[userId]) return;

    setLoadingStates((prev) => ({ ...prev, [userId]: true }));

    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/accept",
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Connection request accepted!");
        await dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Accept connection error:", error);
      toast.error(error?.response?.data?.message || "Failed to accept request");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Reject connection request
  const rejectConnection = async (userId) => {
    if (loadingStates[userId]) return;

    setLoadingStates((prev) => ({ ...prev, [userId]: true }));

    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/reject-request",
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Connection request rejected");
        await dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Reject connection error:", error);
      toast.error(error?.response?.data?.message || "Failed to reject request");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Cancel sent request
  const cancelSentRequest = async (userId) => {
    if (loadingStates[userId]) return;

    setLoadingStates((prev) => ({ ...prev, [userId]: true }));

    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/cancel-request",
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Request cancelled");
        await dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Cancel request error:", error);
      toast.error(error?.response?.data?.message || "Failed to cancel request");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Remove connection
  const removeConnection = async (userId) => {
    if (loadingStates[userId]) return;

    setLoadingStates((prev) => ({ ...prev, [userId]: true }));

    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/remove-connection",
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Connection removed");
        await dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Remove connection error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to remove connection"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const token = await getToken();
        dispatch(fetchConnections(token));
      } catch (error) {
        console.error("Error loading connections:", error);
        toast.error("Failed to load connections");
      }
    };

    loadConnections();
  }, [dispatch, getToken]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading connections...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-400 mb-4">
            Error loading connections: {error}
          </p>
          <button
            onClick={async () => {
              const token = await getToken();
              dispatch(fetchConnections(token));
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentTabData = dataArray.find((item) => item.label === currentTab);

  return (
    <div className="min-h-screen bg-black overflow-y-auto pb-[50px]">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-black px-4 py-3 sm:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30 p-2">
            <img
              src={connectionsIcon}
              alt="My Network"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-light text-white">My Network</h1>
            <p className="text-sm text-gray-400 mt-1">Manage connections</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Desktop Header */}
        <div className="mb-6 sm:mb-8 hidden sm:block">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 p-2.5">
              <img
                src={connectionsIcon}
                alt="My Network"
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

        {/* Tab Navigation */}
        <div className="flex items-center justify-center sm:justify-start mb-6 sm:mb-8">
          <div className="w-full sm:w-auto inline-flex bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-1.5 gap-1.5 sm:gap-1 shadow-xl">
            {dataArray.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setCurrentTab(tab.label)}
                className={`relative flex flex-col items-center justify-center gap-1 px-2 py-2.5 flex-1 sm:flex-initial sm:flex-row sm:gap-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  currentTab === tab.label
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
                title={tab.description}
              >
                {/* Icon */}
                {currentTab === tab.label ? (
                  <div className="bg-zinc-100 p-1.5 rounded-lg flex-shrink-0">
                    <img
                      src={tab.icon}
                      alt={tab.label}
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0">
                    <img
                      src={tab.icon}
                      alt={tab.label}
                      className="w-4 h-4 object-contain opacity-60"
                    />
                  </div>
                )}

                {/* Label */}
                <span className="text-[9px] leading-tight sm:text-sm font-medium">
                  {tab.label}
                </span>

                {/* Count Badge */}
                <span
                  className={`absolute -top-1 -right-1 sm:static text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full sm:rounded-md min-w-[18px] text-center ${
                    currentTab === tab.label
                      ? "bg-black text-white sm:bg-zinc-200 sm:text-black"
                      : "bg-red-500 text-white sm:bg-zinc-800 sm:text-gray-300"
                  }`}
                >
                  {tab.value?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Users List */}
        {currentTabData?.value?.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {currentTabData.value.map((user) => (
              <div
                key={user._id}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-zinc-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="flex flex-row items-center gap-3 sm:gap-4">
                  {/* Profile Section */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div
                      className="relative flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      <img
                        src={user.profile_picture || "/default-avatar.png"}
                        alt={user.full_name || "User"}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover ring-2 ring-zinc-800 group-hover:ring-indigo-500/50 transition-all duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-white text-sm sm:text-base mb-0.5 truncate cursor-pointer hover:text-indigo-400 transition-colors"
                        onClick={() => navigate(`/profile/${user._id}`)}
                      >
                        {user.full_name || "Unknown User"}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1 truncate">
                        @{user.username || "unknown"}
                      </p>
                      {user.bio && (
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 hidden sm:block">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all shadow-lg shadow-indigo-500/30"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>View</span>
                    </button>

                    {/* Connections Tab */}
                    {currentTab === "Connections" && (
                      <>
                        <button
                          onClick={() => navigate(`/messages/${user._id}`)}
                          className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all shadow-lg shadow-blue-500/30"
                        >
                          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Message</span>
                        </button>
                        <button
                          onClick={() => removeConnection(user._id)}
                          disabled={loadingStates[user._id]}
                          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all border ${
                            loadingStates[user._id]
                              ? "bg-gray-600 text-gray-300 cursor-not-allowed border-gray-600"
                              : "bg-zinc-800 hover:bg-red-600 text-gray-300 hover:text-white border-zinc-700"
                          }`}
                        >
                          {loadingStates[user._id] ? (
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UserMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                          <span>
                            {loadingStates[user._id] ? "Removing..." : "Remove"}
                          </span>
                        </button>
                      </>
                    )}

                    {/* Pending Tab */}
                    {currentTab === "Pending" && (
                      <>
                        <button
                          onClick={() => acceptConnection(user._id)}
                          disabled={loadingStates[user._id]}
                          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all shadow-lg ${
                            loadingStates[user._id]
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 shadow-green-500/30"
                          }`}
                        >
                          {loadingStates[user._id] ? (
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                          <span>
                            {loadingStates[user._id]
                              ? "Accepting..."
                              : "Accept"}
                          </span>
                        </button>
                        <button
                          onClick={() => rejectConnection(user._id)}
                          disabled={loadingStates[user._id]}
                          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all border ${
                            loadingStates[user._id]
                              ? "bg-gray-600 text-gray-300 cursor-not-allowed border-gray-600"
                              : "bg-zinc-800 hover:bg-red-600 text-gray-300 hover:text-white border-zinc-700"
                          }`}
                        >
                          {loadingStates[user._id] ? (
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                          <span>
                            {loadingStates[user._id]
                              ? "Rejecting..."
                              : "Reject"}
                          </span>
                        </button>
                      </>
                    )}

                    {/* Sent Tab */}
                    {currentTab === "Sent" && (
                      <button
                        onClick={() => cancelSentRequest(user._id)}
                        disabled={loadingStates[user._id]}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all border ${
                          loadingStates[user._id]
                            ? "bg-gray-600 text-gray-300 cursor-not-allowed border-gray-600"
                            : "bg-zinc-800 hover:bg-red-600 text-gray-300 hover:text-white border-zinc-700"
                        }`}
                      >
                        {loadingStates[user._id] ? (
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                        <span>
                          {loadingStates[user._id] ? "Cancelling..." : "Cancel"}
                        </span>
                      </button>
                    )}

                    {/* Followers Tab */}
                    {currentTab === "Followers" && (
                      <>
                        {(() => {
                          const status = getConnectionStatus(user._id);

                          if (status === "connected") {
                            return (
                              <button className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl cursor-default">
                                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>Connected</span>
                              </button>
                            );
                          }

                          if (status === "sent") {
                            return (
                              <button className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-yellow-600 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl cursor-default">
                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Pending</span>
                              </button>
                            );
                          }

                          return (
                            <button
                              onClick={() => sendConnectionRequest(user._id)}
                              disabled={loadingStates[user._id]}
                              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl active:scale-95 transition-all shadow-lg ${
                                loadingStates[user._id]
                                  ? "bg-gray-600 cursor-not-allowed"
                                  : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-green-500/30"
                              }`}
                            >
                              {loadingStates[user._id] ? (
                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              )}
                              <span>
                                {loadingStates[user._id]
                                  ? "Sending..."
                                  : "Connect"}
                              </span>
                            </button>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6">
              <img
                src={currentTabData?.icon}
                alt={currentTab}
                className="w-10 h-10 object-contain opacity-50"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No {currentTab.toLowerCase()} yet
            </h3>
            <p className="text-sm text-gray-400 text-center max-w-md px-4">
              {currentTab === "Connections" &&
                "Start building your network by connecting with people"}
              {currentTab === "Pending" && "No pending connection requests"}
              {currentTab === "Sent" && "No sent requests"}
              {currentTab === "Followers" && "No followers yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
