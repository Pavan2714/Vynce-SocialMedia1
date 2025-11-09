import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

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
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8 bg-black">
      {/* Vibes and post list */}
      <div>
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs text-xs p-4 inline-flex flex-col gap-2">
          <h3 className="text-white font-semibold">Sponsored</h3>
          <img
            src={assets.sponsored_img}
            className="w-75 h-50 rounded-md"
            alt=""
          />
          <p className="text-gray-300">Email marketing</p>
          <p className="text-gray-400">
            Supercharge your marketing with a powerful, easy-to-use platform
            built for results.
          </p>
        </div>
        {/* Uncomment to show recent messages */}
        <RecentMessages />
      </div>
    </div>
  ) : (
    <div className="h-full bg-black flex items-center justify-center">
      <Loading />
    </div>
  );
};

export default Feed;
