import React from "react";
import {
  MapPin,
  MessageCircle,
  Plus,
  UserPlus,
  Check,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { fetchUser } from "../features/user/userSlice";

const UserCard = ({ user, connectLoading, setConnectLoading }) => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFollow = async () => {
    try {
      const { data } = await api.post(
        "/api/user/follow",
        { id: user._id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchUser(await getToken()));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConnectionRequest = async () => {
    if (currentUser.connections.includes(user._id)) {
      return navigate("/messages/" + user._id);
    }
    try {
      setConnectLoading(true);
      const { data } = await api.post(
        "/api/user/connect",
        { id: user._id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      setConnectLoading(false);
    } catch (error) {
      toast.error(error.message);
      setConnectLoading(false);
    }
  };

  const isFollowing = currentUser?.following.includes(user._id);
  const isConnected = currentUser?.connections.includes(user._id);

  return (
    <div
      key={user._id}
      className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 w-full max-w-md"
    >
      <div className="flex items-start gap-4">
        {/* Profile Picture */}
        <div
          className="relative flex-shrink-0 cursor-pointer"
          onClick={() => navigate(`/profile/${user._id}`)}
        >
          <img
            src={user.profile_picture}
            alt={user.full_name}
            className="rounded-full w-16 h-16 object-cover ring-2 ring-zinc-800 group-hover:ring-pink-500/50 transition-all duration-300 shadow-lg hover:scale-105"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-900"></div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-white text-lg mb-0.5 truncate cursor-pointer hover:text-pink-400 transition-colors"
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            {user.full_name}
          </h3>
          {user.username && (
            <p className="text-gray-400 text-sm mb-2">@{user.username}</p>
          )}

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
            {user.location && (
              <div className="flex items-center gap-1 bg-zinc-800/50 rounded-full px-2.5 py-1 border border-zinc-700/50">
                <MapPin className="w-3 h-3" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1 bg-zinc-800/50 rounded-full px-2.5 py-1 border border-zinc-700/50">
              <span className="font-semibold text-white">
                {user.followers.length}
              </span>
              <span>Followers</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Follow Button */}
            <button
              onClick={handleFollow}
              disabled={isFollowing}
              className={`flex-1 px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-300 active:scale-95 ${
                isFollowing
                  ? "bg-zinc-800 text-gray-300 border border-zinc-700 cursor-default"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
              }`}
            >
              {isFollowing ? (
                <>
                  <Check className="w-4 h-4" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Follow
                </>
              )}
            </button>

            {/* Connection/Message Button */}
            <button
              onClick={handleConnectionRequest}
              disabled={connectLoading}
              className={`flex-shrink-0 w-12 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95 ${
                isConnected
                  ? "bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/50"
                  : "bg-zinc-800 border border-zinc-700 text-gray-400 hover:bg-zinc-700 hover:border-zinc-600 hover:text-white"
              }`}
            >
              {connectLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isConnected ? (
                <MessageCircle className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
