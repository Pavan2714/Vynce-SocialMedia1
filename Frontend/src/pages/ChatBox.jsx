import React, { useEffect, useRef, useState } from "react";
import { ImageIcon, SendHorizonal, X, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import {
  addMessage,
  fetchMessages,
  resetMessages,
} from "../features/messages/messagesSlice";
import toast from "react-hot-toast";

const ChatBox = () => {
  const { messages } = useSelector((state) => state.messages);
  const { userId } = useParams();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const messagesEndRef = useRef(null);

  const connections = useSelector((state) => state.connections.connections);
  const currentUser = useSelector((state) => state.user.value);

  const fetchUserMessages = async () => {
    try {
      const token = await getToken();
      dispatch(fetchMessages({ token, userId }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async () => {
    try {
      const trimmedText = text.trim();
      if (!trimmedText && !image) return;

      const token = await getToken();
      const formData = new FormData();
      formData.append("to_user_id", userId);
      formData.append("text", trimmedText);
      image && formData.append("image", image);

      setUploadProgress(image ? 0 : null);

      const { data } = await api.post("/api/message/send", formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          if (image) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        },
      });
      setUploadProgress(null);

      if (data.success) {
        setText("");
        setImage(null);
        dispatch(addMessage(data.message));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setUploadProgress(null);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUserMessages();

    return () => {
      dispatch(resetMessages());
    };
  }, [userId]);

  useEffect(() => {
    if (connections.length > 0) {
      const user = connections.find((connection) => connection._id === userId);
      setUser(user);
    }
  }, [connections, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    user && (
      <div className="flex flex-col h-screen bg-black relative overflow-hidden">
        {/* SVG Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="chat-pattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="25" cy="25" r="2" fill="#6366f1" opacity="0.3" />
                <circle cx="75" cy="75" r="2" fill="#8b5cf6" opacity="0.3" />
                <path
                  d="M 0 50 Q 25 45, 50 50 T 100 50"
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#chat-pattern)" />
          </svg>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/10 via-transparent to-purple-950/10 pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-zinc-900/95 to-zinc-900/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-2xl">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => navigate("/messages")}
              className="sm:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>

            <div
              className="relative group cursor-pointer"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
              <img
                src={user.profile_picture}
                alt={user.full_name}
                className="relative w-11 h-11 rounded-full object-cover ring-2 ring-zinc-800 shadow-xl"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-900 shadow-lg"></div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-base truncate">
                {user.full_name}
              </p>
              <p className="text-xs text-gray-400">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 py-6"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          <div className="space-y-3 max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-full flex items-center justify-center mb-4">
                  <SendHorizonal className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500 text-center max-w-sm">
                  Start a conversation by sending a message
                </p>
              </div>
            ) : (
              messages
                .toSorted(
                  (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                )
                .map((message, index) => {
                  const isSentByMe = message.to_user_id === user._id;
                  const time = new Date(message.createdAt).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  );

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isSentByMe ? "justify-end" : "justify-start"
                      } group`}
                    >
                      <div className="flex flex-col max-w-[75%] sm:max-w-md">
                        <div
                          className={`inline-block ${
                            isSentByMe
                              ? "bg-gradient-to-br from-green-600 to-green-700"
                              : "bg-zinc-800"
                          } rounded-2xl shadow-lg overflow-hidden`}
                        >
                          {message.message_type === "image" && (
                            <div className="p-1">
                              <img
                                src={message.media_url}
                                className="w-full max-w-sm rounded-xl"
                                alt=""
                              />
                            </div>
                          )}
                          {message.text && (
                            <p
                              className={`px-3 ${
                                message.message_type === "image"
                                  ? "pb-2 pt-1"
                                  : "py-2"
                              } text-sm text-white leading-relaxed break-words`}
                            >
                              {message.text}
                            </p>
                          )}
                        </div>
                        {/* Timestamp below message */}
                        <span
                          className={`text-[10px] text-gray-500 mt-1 px-2 ${
                            isSentByMe ? "text-right" : "text-left"
                          }`}
                        >
                          {time}
                        </span>
                      </div>
                    </div>
                  );
                })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="relative z-10 px-4 sm:px-6 py-4 bg-gradient-to-r from-zinc-900/95 to-zinc-900/80 backdrop-blur-xl border-t border-zinc-800/50">
          <div className="max-w-4xl mx-auto">
            {/* Image Preview */}
            {image && (
              <div className="mb-3 flex items-center gap-3 p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover ring-2 ring-zinc-800"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 font-medium truncate">
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(image.size / 1024).toFixed(2)} KB
                  </p>
                  {/* Progress Bar */}
                  {uploadProgress !== null && (
                    <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setImage(null)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
                  disabled={uploadProgress !== null}
                >
                  <X className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                </button>
              </div>
            )}

            {/* Input Box */}
            <div className="flex items-end gap-3 p-3 bg-zinc-950/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-xl">
              <textarea
                rows={1}
                className="flex-1 resize-none max-h-32 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none py-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (text.trim() || image) {
                      sendMessage();
                    }
                  }
                }}
                onChange={(e) => {
                  setText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                value={text}
              />

              <div className="flex items-center gap-2">
                {/* Image Upload */}
                <label
                  htmlFor="image"
                  className="p-2.5 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors group"
                >
                  <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>

                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  disabled={!text.trim() && !image}
                  className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-zinc-800 disabled:to-zinc-700 disabled:cursor-not-allowed rounded-lg active:scale-95 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:shadow-none"
                >
                  <SendHorizonal className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Typing Hint */}
            <p className="text-xs text-gray-600 mt-2 text-center">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default ChatBox;
