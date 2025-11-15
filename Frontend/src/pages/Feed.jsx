import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Users, Plus } from "lucide-react";
import logo from "../assets/logo.png";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchFeeds = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const token = await getToken();
        const { data } = await api.get("/api/post/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setFeeds(data.posts);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error?.message || "Failed to fetch feeds");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getToken]
  );

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const handlePostDeleted = (deletedPostId) => {
    setFeeds((prev) => prev.filter((p) => p._id !== deletedPostId));
  };

  // Handle story upload completion
  const handleStoryUploaded = useCallback(() => {
    // Smooth reload with a slight delay for better UX
    setTimeout(() => {
      fetchFeeds(true);
    }, 500);
  }, [fetchFeeds]);

  return !loading ? (
    <div className="min-h-screen overflow-y-auto overflow-x-hidden touch-pan-y scrollbar-hide no-scrollbar pb-[50px] sm:pb-0 bg-black">
      {/* Responsive Header for both mobile and desktop */}
      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-10 bg-black px-4 py-4 sm:hidden border-b border-zinc-800">
        <div className="flex items-center justify-between gap-4">
          {/* Logo on the left */}
          <img src={logo} alt="Logo" className="w-35 h-10 rounded-xl" />

          {/* Mobile Create Post Button - Top Right */}
          <button
            onClick={() => navigate("/create-post")}
            className="bg-zinc-900 hover:bg-zinc-800 text-white w-10 h-10 flex items-center justify-center rounded-lg shadow-lg border border-white/10 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Create Post"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-0 sm:py-0">
        <div className="flex items-start justify-center xl:gap-8 py-4 sm:py-8 xl:pr-0">
          {/* Main Feed Content */}
          <div className="w-full">
            {/* Pass the refresh handler to StoriesBar */}
            <StoriesBar onStoryUploaded={handleStoryUploaded} />

            {/* Refreshing Indicator */}
            {refreshing && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm text-white">Refreshing feed...</span>
                </div>
              </div>
            )}

            <div className="py-4 space-y-6">
              {feeds.length > 0 ? (
                feeds.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onPostDeleted={handlePostDeleted}
                  />
                ))
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center py-20 px-4">
                  <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-zinc-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2 text-center">
                    No posts yet
                  </h3>
                  <p className="text-sm text-gray-400 text-center max-w-md leading-relaxed px-4">
                    Follow people to see their posts in your feed, or create
                    your first post to share with your network
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Desktop Only */}
          <div className="max-xl:hidden sticky top-0 w-full">
            <RecentMessages />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loading />
    </div>
  );
};

export default Feed;
