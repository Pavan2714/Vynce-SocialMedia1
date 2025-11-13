import React from "react";
import { UserPlus, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { fetchUser } from "../features/user/userSlice";

const UserCard = ({ user }) => {
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

  const isFollowing = currentUser?.following.includes(user._id);

  return (
    <div
      key={user._id}
      className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 w-100"
    >
      <div className="flex items-center gap-4">
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
        </div>

        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={isFollowing}
          className={`flex-shrink-0 px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 active:scale-95 ${
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
      </div>
    </div>
  );
};

export default UserCard;
