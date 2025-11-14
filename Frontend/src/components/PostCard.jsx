import React, { useState, useEffect } from "react";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Trash2,
  X,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import StoryViewer from "./StoryViewer";
import CommentsSection from "./CommentsSection";

const PostCard = ({ post, onPostDeleted }) => {
  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-400">$1</span>'
  );
  const [likes, setLikes] = useState(post.likes_count);
  const [showHeart, setShowHeart] = useState(false);
  const [viewUserStories, setViewUserStories] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [storyLoading, setStoryLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const isPostOwner = currentUser._id === post.user._id;

  useEffect(() => {
    fetchCommentsCount();
  }, [post._id]);

  const fetchCommentsCount = async () => {
    try {
      const { data } = await api.get(`/api/comment/${post._id}?limit=1`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCommentsCount(data.totalComments);
      }
    } catch (error) {
      console.error("Failed to fetch comments count");
    }
  };

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

  const handleDeletePost = async () => {
    try {
      setDeleting(true);
      const { data } = await api.delete(`/api/post/${post._id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success("Post deleted successfully");
        setShowDeleteConfirm(false);
        setShowMenu(false);
        if (onPostDeleted) {
          onPostDeleted(post._id);
        }
      } else {
        toast.error(data.message || "Failed to delete post");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const handleDoubleTap = () => {
    if (!likes.includes(currentUser._id)) {
      handleLike();
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
        const filteredStories = data.stories.filter(
          (story) => story.user._id === userId
        );

        if (filteredStories.length > 0) {
          setUserStories(filteredStories);
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
      <div className="space-y-3 sm:space-y-4 w-150 max-w-[94.5vw] sm:max-w-2xl lg:max-w-4xl relative">
        {/* User Info Section */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-zinc-700 transition-all duration-300 relative z-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-3">
              <img
                src={post.user.profile_picture}
                alt=""
                onClick={handleProfileImageClick}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-zinc-800 hover:ring-blue-500/50 transition-all duration-300 cursor-pointer hover:scale-105"
              />

              <div
                onClick={handleUsernameClick}
                className="cursor-pointer group"
              >
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

            {/* Three Dots Menu - Only show if user owns the post */}
            {isPostOwner && (
              <div className="relative z-[500]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors relative z-[500]"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-[400]"
                      onClick={() => setShowMenu(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 z-[500] overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors text-left text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete Post</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {post.content && (
            <div
              className="text-gray-100 text-sm sm:text-base leading-relaxed whitespace-pre-line mt-3"
              dangerouslySetInnerHTML={{ __html: postWithHashtags }}
            />
          )}
        </div>

        {/* Images */}
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

          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <Heart className="w-20 h-20 sm:w-24 sm:h-24 text-red-500 fill-red-500 animate-ping" />
            </div>
          )}
        </div>

        {/* Actions */}
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

            <div
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-blue-400 transition-colors group/comment"
              onClick={() => setShowComments(true)}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover/comment:scale-110 transition-transform" />
              <span className="font-medium">{commentsCount}</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-green-400 transition-colors group/share">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover/share:scale-110 transition-transform" />
              <span className="font-medium">{0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-sm w-full overflow-hidden relative z-[610] shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Delete Post
                </h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
                  disabled={deleting}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <CommentsSection
        postId={post._id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        onCommentCountChange={setCommentsCount}
      />

      {/* Story Viewer */}
      {viewUserStories && (
        <>
          {viewUserStories.stories === null && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60">
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
