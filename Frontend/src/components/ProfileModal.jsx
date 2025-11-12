import React, { useState } from "react";
import { X, User, MapPin, AtSign, FileText, Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const ProfileModal = ({ setShowEdit }) => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const user = useSelector((state) => state.user.value);
  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    full_name: user.full_name,
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();
      const { full_name, username, bio, location, profile_picture } = editForm;

      userData.append("username", username);
      userData.append("bio", bio);
      userData.append("location", location);
      userData.append("full_name", full_name);
      profile_picture && userData.append("profile", profile_picture);

      const token = await getToken();
      dispatch(updateUser({ userData, token }));

      setShowEdit(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto scrollbar-hide">
      <div className="w-full sm:max-w-2xl bg-zinc-950 sm:bg-gradient-to-br sm:from-zinc-900 sm:to-zinc-900/95 rounded-t-3xl sm:rounded-3xl shadow-2xl border-t border-x sm:border border-zinc-800 sm:border-zinc-800/50 min-h-[90vh] sm:min-h-0 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-zinc-800 bg-zinc-950 sm:bg-gradient-to-r sm:from-zinc-900/95 sm:to-transparent backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white sm:bg-gradient-to-r sm:from-white sm:via-gray-100 sm:to-gray-300 sm:bg-clip-text sm:text-transparent">
                Edit Profile
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
                Update your personal information
              </p>
            </div>
            <button
              onClick={() => setShowEdit(false)}
              className="p-2 sm:p-2.5 hover:bg-zinc-800 rounded-lg sm:rounded-xl transition-colors group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form
          onSubmit={(e) =>
            toast.promise(handleSaveProfile(e), {
              loading: "Saving your profile...",
              success: "Profile updated successfully! 🎉",
              error: "Failed to update profile",
            })
          }
          className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6"
        >
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-zinc-800">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition-opacity"></div>
              <div className="relative">
                <img
                  src={
                    editForm.profile_picture
                      ? URL.createObjectURL(editForm.profile_picture)
                      : user.profile_picture
                  }
                  alt={user.full_name}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-zinc-950 shadow-xl"
                />
                <label
                  htmlFor="profile_picture"
                  className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 p-2.5 sm:p-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full cursor-pointer shadow-lg transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4 sm:w-4 sm:h-4 text-white" />
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    id="profile_picture"
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        profile_picture: e.target.files[0],
                      })
                    }
                  />
                </label>
              </div>
            </div>
            <div className="text-center px-4">
              <p className="text-xs sm:text-sm text-gray-400">
                Click the camera icon to change your profile picture
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 sm:bg-zinc-950/50 border border-zinc-800 rounded-lg sm:rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
                value={editForm.full_name}
              />
            </div>

            {/* Username */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <AtSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">
                  @
                </span>
                <input
                  type="text"
                  className="w-full pl-7 sm:pl-8 pr-3.5 sm:pr-4 py-2.5 sm:py-3 bg-zinc-900 sm:bg-zinc-950/50 border border-zinc-800 rounded-lg sm:rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="username"
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  value={editForm.username}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                Bio
              </label>
              <textarea
                rows={3}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 sm:bg-zinc-950/50 border border-zinc-800 rounded-lg sm:rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about yourself..."
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                value={editForm.bio}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                {editForm.bio?.length || 0} characters
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                Location
              </label>
              <input
                type="text"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-zinc-900 sm:bg-zinc-950/50 border border-zinc-800 rounded-lg sm:rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="City, Country"
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                value={editForm.location}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-5 sm:pt-6 border-t border-zinc-800 sticky bottom-0 bg-zinc-950 sm:bg-transparent pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0 sm:static">
            <button
              type="submit"
              className="w-full px-6 py-3 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95"
            >
              Save Changes
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                setShowEdit(false);
              }}
              type="button"
              className="w-full px-6 py-3 sm:py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-white text-sm sm:text-base font-medium transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
