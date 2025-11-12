import React, { useState } from "react";
import { Image, X, Send, FileImage, ImagePlus, Menu } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import createpostIcon from "../assets/icons/createpost.png";

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.value);

  const { getToken } = useAuth();

  const handleSubmit = async () => {
    if (!images.length && !content) {
      return toast.error("Please add at least one image or text");
    }
    setLoading(true);

    const postType =
      images.length && content
        ? "text_with_image"
        : images.length
        ? "image"
        : "text";

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("post_type", postType);
      images.map((image) => {
        formData.append("images", image);
      });

      const { data } = await api.post("/api/post/add", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        navigate("/");
      } else {
        console.log(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black pb-safe">
      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-10 bg-black px-4 py-3 sm:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 p-2">
              <img
                src={createpostIcon}
                alt="Create Post"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Create Post</h1>
              <p className="text-xs text-gray-500">Share your thoughts</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 rounded-lg flex items-center justify-center transition-colors active:scale-95"
          >
            <X className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Desktop Header Section */}
        <div className="mb-6 sm:mb-8 hidden sm:block">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 p-2.5">
              <img
                src={createpostIcon}
                alt="Create Post"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-light text-white">Create Post</h1>
              <p className="text-sm text-gray-400 mt-1">
                Share your thoughts with the world
              </p>
            </div>
          </div>
        </div>

        {/* Post Form Card */}
        <div className="bg-black border border-zinc-800 rounded-2xl sm:rounded-lg overflow-hidden shadow-xl">
          {/* User Header */}
          <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-zinc-800">
            <img
              src={user.profile_picture}
              alt={user.full_name}
              className="w-11 h-11 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-zinc-800"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-white text-sm sm:text-sm truncate">
                {user.full_name}
              </h2>
              <p className="text-xs text-gray-400 truncate">@{user.username}</p>
            </div>
          </div>

          {/* Text Area */}
          <div className="p-3 sm:p-4">
            <textarea
              className="w-full resize-none min-h-[140px] sm:min-h-[120px] bg-transparent text-white text-base placeholder-gray-600 focus:outline-none leading-relaxed"
              placeholder="What's on your mind?"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </div>

          {/* Images Preview */}
          {images.length > 0 && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="p-3 sm:p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs sm:text-sm font-medium text-gray-400">
                    {images.length} {images.length === 1 ? "photo" : "photos"}
                  </span>
                  <button
                    onClick={() => setImages([])}
                    className="text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img
                        src={URL.createObjectURL(image)}
                        className="w-full h-full rounded-lg object-cover"
                        alt=""
                      />
                      <button
                        onClick={() =>
                          setImages(images.filter((_, index) => index !== i))
                        }
                        className="absolute top-1 right-1 w-7 h-7 bg-black/80 hover:bg-black rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border-t border-zinc-800 bg-zinc-950/30">
            {/* Image Upload Button */}
            <label
              htmlFor="images"
              className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 sm:py-2 hover:bg-zinc-900 text-gray-300 hover:text-white rounded-xl sm:rounded-lg cursor-pointer transition-colors active:scale-95 border border-zinc-800 sm:border-0"
            >
              <Image className="w-5 h-5" />
              <span className="text-sm font-medium">Add Photo</span>
            </label>

            <input
              type="file"
              id="images"
              accept="image/*"
              hidden
              multiple
              onChange={(e) => setImages([...images, ...e.target.files])}
            />

            {/* Publish Button */}
            <button
              disabled={loading || (!images.length && !content)}
              onClick={() =>
                toast.promise(handleSubmit(), {
                  loading: "Publishing...",
                  success: <p>Post published! 🎉</p>,
                  error: <p>Failed to publish post</p>,
                })
              }
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-zinc-800 disabled:to-zinc-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl sm:rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:shadow-none"
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-4 sm:mt-6 p-4 sm:p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl sm:rounded-lg">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Tips for better engagement
          </h3>
          <ul className="space-y-2.5 sm:space-y-2">
            <li className="flex items-start gap-2.5 sm:gap-2 text-sm text-gray-400">
              <span className="text-blue-500 mt-0.5">•</span>
              <span className="leading-relaxed">
                Add engaging images to increase visibility
              </span>
            </li>
            <li className="flex items-start gap-2.5 sm:gap-2 text-sm text-gray-400">
              <span className="text-blue-500 mt-0.5">•</span>
              <span className="leading-relaxed">
                Keep your content authentic and meaningful
              </span>
            </li>
            <li className="flex items-start gap-2.5 sm:gap-2 text-sm text-gray-400">
              <span className="text-blue-500 mt-0.5">•</span>
              <span className="leading-relaxed">
                Engage with your audience through comments
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
