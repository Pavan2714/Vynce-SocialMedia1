import React, { useState } from "react";
import { MessageSquare, Search, Users, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import connectionsIcon from "../assets/icons/connections.png";
import messagesIcon from "../assets/icons/messages.png";
import noconnectionIcon from "../assets/icons/noconnection.png";

const Messages = () => {
  const { connections } = useSelector((state) => state.connections);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnections = connections.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black overflow-y-auto pb-[50px]">
      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-10 bg-black px-4 py-4 sm:hidden border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 p-2.5">
              <img
                src={messagesIcon}
                alt="Messages"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-light text-white leading-tight">
                Messages
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Chat with connections
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Desktop Header Section */}
        <div className="mb-6 sm:mb-8 hidden sm:block">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 p-2.5">
              <img
                src={messagesIcon}
                alt="Messages"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-light text-white">Messages</h1>
              <p className="text-sm text-gray-400 mt-1">
                Chat with your connections
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/30 to-purple-950/50 border border-blue-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              {/* Icon with white background */}
              <div className="bg-white/95 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg">
                <img
                  src={connectionsIcon}
                  alt="Available Connections"
                  className="w-5 h-5 sm:w-7 sm:h-7 object-contain"
                />
              </div>
              <span className="text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium bg-white/10 text-white border border-white/20">
                {filteredConnections.length}
              </span>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white mb-1">
                {filteredConnections.length}
              </p>
              <p className="text-sm text-white/90 font-medium">
                Available Connections
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Connected Users List */}
        {filteredConnections.length > 0 ? (
          <div className="space-y-4">
            {filteredConnections.map((user) => (
              <div
                key={user._id}
                className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300"
              >
                <div className="flex flex-row items-center gap-3 sm:gap-4">
                  {/* Profile Section */}
                  <div className="flex items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${user._id}`);
                      }}
                      className="relative flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={user.profile_picture}
                        alt={user.full_name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-zinc-800 hover:ring-blue-500/50 transition-all duration-300 hover:scale-105"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                    </div>

                    {/* User Info - Not clickable, just shows info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-base mb-0.5 truncate">
                        {user.full_name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1 truncate">
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p className="text-sm text-gray-500 line-clamp-1 hidden sm:block">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message Button - Only this opens chat */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/messages/${user._id}`);
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-xl active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
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
                src={noconnectionIcon}
                alt="No connections"
                className="w-10 h-10 object-contain opacity-50"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {searchQuery ? "No results found" : "No connections yet"}
            </h3>
            <p className="text-sm text-gray-400 text-center max-w-md leading-relaxed px-4">
              {searchQuery
                ? `No connections match "${searchQuery}". Try a different search term.`
                : "Start connecting with people to see them here and begin conversations."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
