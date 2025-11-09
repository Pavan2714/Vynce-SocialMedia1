import React, { useState } from "react";
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
// import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const PostCard = ({ post }) => {
  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-400">$1</span>'
  );
  const [likes, setLikes] = useState(post.likes_count);
  const [showHeart, setShowHeart] = useState(false);
  const currentUser = useSelector((state) => state.user.value);

  const { getToken } = useAuth();

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

  const navigate = useNavigate();

  return (
    <div className="bg-black p-3 space-y-3 w-full max-w-lg relative">
      {/* User Info */}
      <div
        onClick={() => navigate("/profile/" + post.user._id)}
        className="inline-flex items-center gap-2 cursor-pointer"
      >
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-8 h-8 rounded-full shadow"
        />
        <div>
          <div className="flex items-center space-x-1">
            <span className="text-white font-semibold text-sm">
              {post.user.full_name}
            </span>
            <BadgeCheck className="w-3 h-3 text-blue-500" />
          </div>
          <div className="text-gray-400 text-xs">
            @{post.user.username} • {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div
          className="text-white text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {/* Images with Double-tap to like */}
      <div
        className="grid grid-cols-2 gap-1 relative"
        onDoubleClick={handleDoubleTap}
      >
        {post.image_urls.map((img, index) => (
          <img
            src={img}
            key={index}
            className={`w-full h-120 object-cover rounded-md ${
              post.image_urls.length === 1 && "col-span-2 h-48"
            }`}
            alt=""
          />
        ))}

        {/* Heart Animation */}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="w-16 h-16 text-red-500 fill-red-500 animate-ping" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-300 text-xs pt-1 border-t border-gray-700">
        <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
          <Heart
            className={`w-3 h-3 cursor-pointer ${
              likes.includes(currentUser._id) && "text-red-500 fill-red-500"
            }`}
            onClick={handleLike}
          />
          <span>{likes.length}</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
          <MessageCircle className="w-3 h-3" />
          <span>{12}</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
          <Share2 className="w-3 h-3" />
          <span>{7}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
