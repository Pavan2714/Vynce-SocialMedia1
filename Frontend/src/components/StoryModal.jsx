import { useAuth } from "@clerk/clerk-react";
import { X, Image as ImageIcon, Video, Type } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#f59e0b",
    "#14b8a6",
  ];

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { getToken } = useAuth();

  const MAX_VIDEO_DURATION = 60;
  const MAX_VIDEO_SIZE_MB = 50;

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video")) {
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
          toast.error(`Video file size cannot exceed ${MAX_VIDEO_SIZE_MB}MB.`);
          setMedia(null);
          setPreviewUrl(null);
          return;
        }
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > MAX_VIDEO_DURATION) {
            toast.error("Video duration cannot exceed 1 minute.");
            setMedia(null);
            setPreviewUrl(null);
          } else {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
            setText("");
            setMode("media");
          }
        };
        video.src = URL.createObjectURL(file);
      } else if (file.type.startsWith("image")) {
        setMedia(file);
        setPreviewUrl(URL.createObjectURL(file));
        setText("");
        setMode("media");
      }
    }
  };

  const handleCreateStory = async () => {
    const media_type =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : "text";

    if (media_type === "text" && !text) {
      throw new Error("Please enter some text");
    }

    let formData = new FormData();
    formData.append("content", text);
    formData.append("media_type", media_type);
    formData.append("media", media);
    formData.append("background_color", background);

    const token = await getToken();
    try {
      const { data } = await api.post("/api/story/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setShowModal(false);
        toast.success("Story created successfully");
        fetchStories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-110 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Create Story</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Area */}
        <div className="p-6">
          <div
            className="rounded-xl h-80 flex items-center justify-center relative overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: mode === "text" ? background : "#18181b",
            }}
          >
            {mode === "text" ? (
              <textarea
                className="bg-transparent text-white w-full h-full p-6 text-xl resize-none focus:outline-none placeholder:text-white/40 font-medium"
                placeholder="Share your moment..."
                onChange={(e) => setText(e.target.value)}
                value={text}
                maxLength={200}
              />
            ) : previewUrl ? (
              media?.type.startsWith("image") ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-contain max-h-full rounded-lg"
                />
              ) : (
                <video
                  src={previewUrl}
                  className="object-contain max-h-full rounded-lg"
                  controls
                />
              )
            ) : (
              <div className="text-center text-gray-500">
                <Upload size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Upload a photo or video</p>
              </div>
            )}
          </div>

          {/* Color Palette - Only show for text mode */}
          {mode === "text" && (
            <div className="flex items-center gap-3 mt-4 px-2">
              <span className="text-xs text-gray-400 font-medium">
                Background:
              </span>
              <div className="flex gap-2">
                {bgColors.map((color) => (
                  <button
                    key={color}
                    className={`w-7 h-7 transition-all duration-200 ${
                      background === color
                        ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBackground(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mode Selector */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setMode("text");
                setMedia(null);
                setPreviewUrl(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 ${
                mode === "text"
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
              }`}
            >
              <Type size={18} />
              <span>Text</span>
            </button>

            <label
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                mode === "media"
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
              }`}
            >
              <input
                onChange={handleMediaUpload}
                type="file"
                accept="image/*, video/*"
                className="hidden"
              />
              {media?.type.startsWith("image") ? (
                <ImageIcon size={18} />
              ) : (
                <Video size={18} />
              )}
              <span>Media</span>
            </label>
          </div>

          {/* Create Button */}
          <button
            onClick={() =>
              toast.promise(handleCreateStory(), {
                loading: "Creating story...",
                success: "Story created!",
                error: (err) => err.message,
              })
            }
            className="w-full py-3.5 mt-4 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            Share Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
