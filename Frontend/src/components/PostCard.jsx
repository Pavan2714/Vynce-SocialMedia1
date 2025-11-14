import React, { useState } from "react";
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import StoryViewer from "./StoryViewer";

const PostCard = ({ post }) => {
  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-400">$1</span>'
  );
  const [likes, setLikes] = useState(post.likes_count);
  const [showHeart, setShowHeart] = useState(false);
  const [viewUserStories, setViewUserStories] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [storyLoading, setStoryLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.value);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleLike = async () => {
    try {
      const { data } = await api.post(
        `/api/post/like`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setLikes((prev) => {
          if (prev.includes(currentUser._id)) {
            return prev.filter((id) => id !== currentUser._id);
          } else {
            return [...prev, currentUser._id];
          }
        });
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDoubleTap = () => {
    // Only like if not already liked
    if (!likes.includes(currentUser._id)) {
      handleLike();
      // Show heart animation
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  const fetchUserStories = async (userId) => {
    try {
      setStoryLoading(true);
      const token = await getToken();
      const { data } = await api.get("/api/story/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        // Filter stories for the specific user
        const filteredStories = data.stories.filter(
          (story) => story.user._id === userId
        );

        if (filteredStories.length > 0) {
          setUserStories(filteredStories);
          // update the already-open viewer with stories
          setViewUserStories((prev) =>
            prev
              ? { ...prev, stories: filteredStories }
              : { user: post.user, stories: filteredStories, startIndex: 0 }
          );
        } else {
          toast.error("No stories available for this user");
          setViewUserStories(null);
        }
      } else {
        toast.error(data.message);
        setViewUserStories(null);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to fetch stories");
      setViewUserStories(null);
    } finally {
      setStoryLoading(false);
    }
  };

  const handleProfileImageClick = (e) => {
    e.stopPropagation();
    // open viewer immediately (quick open) and fetch stories in background
    setViewUserStories({ user: post.user, stories: null, startIndex: 0 });
    fetchUserStories(post.user._id);
  };

  const handleUsernameClick = (e) => {
    e.stopPropagation();
    navigate("/profile/" + post.user._id);
  };

  let lastTap = 0;
  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      handleDoubleTap();
    }
    lastTap = now;
  };

  return (
    <>
      <div className="space-y-3 sm:space-y-4 w-150 max-w-[94.5vw] sm:max-w-2xl lg:max-w-4xl">
        {/* User Info Section - With subtle background */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-zinc-700 transition-all duration-300">
          <div className="inline-flex items-center gap-3">
            {/* Profile Image - Opens Story */}
            <img
              src={post.user.profile_picture}
              alt=""
              onClick={handleProfileImageClick}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-zinc-800 hover:ring-blue-500/50 transition-all duration-300 cursor-pointer hover:scale-105"
            />

            {/* Username and Details - Opens Profile */}
            <div onClick={handleUsernameClick} className="cursor-pointer group">
              <div className="flex items-center space-x-1">
                <span className="text-white font-semibold text-sm sm:text-base group-hover:text-blue-400 transition-colors">
                  {post.user.full_name}
                </span>
                <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
              </div>
              <div className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors">
                @{post.user.username} • {moment(post.createdAt).fromNow()}
              </div>
            </div>
          </div>

          {/* Content */}
          {post.content && (
            <div
              className="text-gray-100 text-sm sm:text-base leading-relaxed whitespace-pre-line mt-3"
              dangerouslySetInnerHTML={{ __html: postWithHashtags }}
            />
          )}
        </div>

        {/* Images - Full Width with Double-tap to like */}
        <div
          className="grid grid-cols-2 gap-1 sm:gap-2 relative overflow-hidden rounded-lg sm:rounded-xl"
          onDoubleClick={handleDoubleTap}
          onTouchEnd={handleTouchEnd}
        >
          {post.image_urls.map((img, index) => (
            <img
              src={img}
              key={index}
              className={`w-full object-cover ${
                post.image_urls.length === 1
                  ? "col-span-2 h-[400px] sm:h-[500px]"
                  : "h-48 sm:h-64"
              }`}
              alt=""
            />
          ))}

          {/* Heart Animation */}
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart className="w-20 h-20 sm:w-24 sm:h-24 text-red-500 fill-red-500 animate-ping" />
            </div>
          )}
        </div>

        {/* Actions - With subtle background */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-zinc-700 transition-all duration-300">
          <div className="flex items-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-red-500 transition-colors group/like">
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer transition-all ${
                  likes.includes(currentUser._id)
                    ? "text-red-500 fill-red-500"
                    : "group-hover/like:scale-110"
                }`}
                onClick={handleLike}
              />
              <span className="font-medium">{likes.length}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-blue-400 transition-colors group/comment">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover/comment:scale-110 transition-transform" />
              <span className="font-medium">{12}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-green-400 transition-colors group/share">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover/share:scale-110 transition-transform" />
              <span className="font-medium">{7}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Story Viewer / Loader Overlay */}
      {viewUserStories && (
        <>
          {/* Fade background + simple spinner while stories are loading */}
          {viewUserStories.stories === null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-white"></div>
                <div className="text-sm text-white">Loading stories...</div>
                <button
                  className="mt-2 px-3 py-1 text-sm rounded bg-white/10 text-white"
                  onClick={() => {
                    setViewUserStories(null);
                    setStoryLoading(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* When stories available, open StoryViewer */}
          {viewUserStories.stories && (
            <StoryViewer
              user={viewUserStories.user}
              stories={viewUserStories.stories}
              startIndex={viewUserStories.startIndex}
              setViewStory={() => setViewUserStories(null)}
            />
          )}
        </>
      )}
    </>
  );
};

export default PostCard;
