import { useAuth } from "@clerk/clerk-react";
import { X, Image as ImageIcon, Video, Type, Upload } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const StoryModal = ({ setShowModal, onStoryUploaded }) => {
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
  const [isUploading, setIsUploading] = useState(false);

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
    if (isUploading) return;

    const media_type =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : "text";

    if (media_type === "text" && !text.trim()) {
      throw new Error("Please enter some text");
    }

    if (mode === "media" && !media) {
      throw new Error("Please select a photo or video");
    }

    setIsUploading(true);

    try {
      let formData = new FormData();
      formData.append("content", text);
      formData.append("media_type", media_type);
      if (media) {
        formData.append("media", media);
      }
      formData.append("background_color", background);

      const token = await getToken();
      const { data } = await api.post("/api/story/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        // Close modal first for better UX
        setShowModal(false);

        // Show success message
        toast.success("Story created successfully!");

        // Trigger refresh callback after a short delay for smooth UX
        setTimeout(() => {
          if (onStoryUploaded) {
            onStoryUploaded();
          }
        }, 300);
      } else {
        throw new Error(data.message || "Failed to create story");
      }
    } catch (error) {
      console.error("Story creation error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create story"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Create Story</h2>
          <button
            onClick={() => setShowModal(false)}
            disabled={isUploading}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="w-full h-full relative">
                <textarea
                  className="bg-transparent text-white w-full h-full p-6 text-xl resize-none focus:outline-none placeholder:text-white/40 font-medium"
                  placeholder="Share your moment..."
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  maxLength={200}
                  disabled={isUploading}
                />
                <div className="absolute bottom-4 right-4 text-white/60 text-sm">
                  {text.length}/200
                </div>
              </div>
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
                  muted
                  playsInline
                />
              )
            ) : (
              <div className="text-center text-gray-500">
                <Upload size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Upload a photo or video</p>
                <p className="text-xs text-gray-600 mt-1">
                  Max: {MAX_VIDEO_SIZE_MB}MB, {MAX_VIDEO_DURATION}s for videos
                </p>
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
                    disabled={isUploading}
                    className={`w-7 h-7 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
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
              disabled={isUploading}
              onClick={() => {
                setMode("text");
                setMedia(null);
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }
                setPreviewUrl(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
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
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              } ${
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
                disabled={isUploading}
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
                success: "Story created successfully!",
                error: (err) => err.message,
              })
            }
            disabled={
              isUploading ||
              (mode === "text" && !text.trim()) ||
              (mode === "media" && !media)
            }
            className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:opacity-60 text-white font-semibold transition-all duration-200 active:scale-[0.98] disabled:active:scale-100"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Story...</span>
              </div>
            ) : (
              "Share Story"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
