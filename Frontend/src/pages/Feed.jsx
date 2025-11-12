import React, { useEffect, useState } from "react";
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
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchFeeds = async () => {
    try {
      setLoading(true);
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
    }
  };

  useEffect(() => {
    fetchFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !loading ? (
    <div className="min-h-screen overflow-y-auto overflow-x-hidden touch-pan-y scrollbar-hide no-scrollbar pb-[50px] sm:pb-0 bg-black">
      {/* Responsive Header for both mobile and desktop */}
      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-10 bg-black px-3 py-3 sm:hidden">
        <div className="flex items-center gap-3">
          {/* Logo on the left */}
          <img
            src={logo} // or import logo from '../assets/logo.png' at the top and use src={logo}
            alt="Logo"
            className="w-35 h-10 rounded-xl mt-2.5"
          />
        </div>
      </div>

      {/* Desktop Header Section - match Messages page margin
      <div className="hidden sm:block">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 p-2.5">
              <img
                src={connectionsIcon}
                alt="Feed"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-light text-white">Feed</h1>
              <p className="text-sm text-gray-400 mt-1">
                See posts from your network
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Mobile Create Post Button - Top Right */}
      <button
        onClick={() => navigate("/create-post")}
        className="fixed top-4 right-4 z-40 sm:hidden bg-zinc-900 text-white w-12 h-12 flex items-center justify-center rounded-xl shadow-lg border border-white/10 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-white/20"
        aria-label="Create Post"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-0 sm:py-0">
        <div className="flex items-start justify-center xl:gap-8 py-4 sm:py-8 xl:pr-0">
          {/* Main Feed Content */}
          <div className="w-full">
            <StoriesBar />
            <div className="py-4 space-y-6">
              {feeds.length > 0 ? (
                feeds.map((post) => <PostCard key={post._id} post={post} />)
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
