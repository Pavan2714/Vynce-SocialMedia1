import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import CommentsSection from "../components/CommentsSection";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const currentUser = useSelector((state) => state.user.value);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setPost(data.post);
        setLiked(data.post.likes_count?.includes(currentUser._id));
        setLikesCount(data.post.likes_count?.length || 0);
        setCommentsCount(data.post.comments_count || 0); // Using virtual field
      } else {
        toast.error("Post not found");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await api.post(
        `/api/post/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      }
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleShare = async () => {
    try {
      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      toast.success("Post link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const nextImage = () => {
    if (post?.image_urls?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === post.image_urls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (post?.image_urls?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? post.image_urls.length - 1 : prev - 1
      );
    }
  };

  const formatTime = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 604800)}w`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-white mb-2">Post not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-zinc-800 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Post</h1>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <MoreHorizontal className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Desktop Back Button */}
        <div className="hidden md:block p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="md:flex md:bg-zinc-900 md:rounded-lg md:overflow-hidden md:mx-6">
          {/* Image Section */}
          <div className="md:flex-1 md:max-w-2xl relative">
            {/* Image Container */}
            <div className="relative aspect-square bg-black">
              <img
                src={post.image_urls[currentImageIndex]}
                alt="Post"
                className="w-full h-full object-cover"
              />

              {/* Image Navigation - only show if multiple images */}
              {post.image_urls.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {post.image_urls.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-96 flex flex-col">
            {/* Post Header */}
            <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
              <img
                src={post.user.profile_picture}
                alt={post.user.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold text-sm">
                    {post.user.username}
                  </h3>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-400 text-sm">
                    {formatTime(post.createdAt)}
                  </span>
                </div>
              </div>
              <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Post Caption */}
            {post.content && (
              <div className="p-4 border-b border-zinc-800">
                <div className="flex gap-3">
                  <img
                    src={post.user.profile_picture}
                    alt={post.user.full_name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-white font-semibold text-sm mr-2">
                      {post.user.username}
                    </span>
                    <span className="text-white text-sm">{post.content}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section - Desktop Only */}
            <div className="hidden md:block flex-1 overflow-y-auto max-h-60">
              {/* Comments would go here - you can integrate with your Comment component */}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-zinc-800 md:border-t-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className="p-1 hover:bg-zinc-800 rounded transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        liked
                          ? "text-red-500 fill-red-500"
                          : "text-white hover:text-gray-300"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setShowComments(true)}
                    className="p-1 hover:bg-zinc-800 rounded transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 text-white hover:text-gray-300" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-1 hover:bg-zinc-800 rounded transition-colors"
                  >
                    <Send className="w-6 h-6 text-white hover:text-gray-300" />
                  </button>
                </div>
                <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
                  <Bookmark className="w-6 h-6 text-white hover:text-gray-300" />
                </button>
              </div>

              {/* Likes Count */}
              {likesCount > 0 && (
                <p className="text-white text-sm font-semibold mb-2">
                  {likesCount} {likesCount === 1 ? "like" : "likes"}
                </p>
              )}

              {/* View Comments Button - Mobile Only */}
              <button
                onClick={() => setShowComments(true)}
                className="text-gray-400 text-sm md:hidden"
              >
                {commentsCount > 0
                  ? `View all ${commentsCount} comments`
                  : "Add a comment..."}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection
        postId={postId}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        onCommentCountChange={setCommentsCount}
      />
    </div>
  );
};

export default PostDetail;
