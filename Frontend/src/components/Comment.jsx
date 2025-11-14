import React, { useState } from "react";
import { Heart, MessageCircle, Trash2, MoreHorizontal } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const Comment = ({ comment, onDelete, onReply }) => {
  const [likes, setLikes] = useState(comment.likes || []);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();

  const handleLike = async () => {
    try {
      const { data } = await api.post(
        `/api/comment/like/${comment._id}`,
        {},
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setLikes((prev) => {
          if (prev.includes(currentUser._id)) {
            return prev.filter((id) => id !== currentUser._id);
          } else {
            return [...prev, currentUser._id];
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      const { data } = await api.post(
        "/api/comment/reply",
        { commentId: comment._id, content: replyText },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setReplies(data.comment.replies);
        setReplyText("");
        setIsReplying(false);
        setShowReplies(true);
        toast.success("Reply added successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const { data } = await api.delete(`/api/comment/${comment._id}`, {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });

        if (data.success) {
          onDelete(comment._id);
          toast.success("Comment deleted successfully");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex gap-3 p-3 border-b border-zinc-800 last:border-b-0">
      <img
        src={comment.user.profile_picture}
        alt={comment.user.full_name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-white text-sm">
            {comment.user.full_name}
          </span>
          <span className="text-gray-400 text-xs">
            @{comment.user.username}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>

          {comment.user._id === currentUser._id && (
            <button
              onClick={handleDelete}
              className="ml-auto text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-gray-200 text-sm mb-2">{comment.content}</p>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 hover:text-red-400 transition-colors ${
              likes.includes(currentUser._id) ? "text-red-400" : ""
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                likes.includes(currentUser._id) ? "fill-current" : ""
              }`}
            />
            <span>{likes.length}</span>
          </button>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 hover:text-blue-400 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>

          {replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-blue-400 hover:text-blue-300"
            >
              {showReplies ? "Hide" : "Show"} {replies.length} replies
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleReply()}
            />
            <button
              onClick={handleReply}
              className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reply
            </button>
          </div>
        )}

        {showReplies && replies.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-zinc-700 space-y-2">
            {replies.map((reply) => (
              <div key={reply._id} className="flex gap-2">
                <img
                  src={reply.user.profile_picture}
                  alt={reply.user.full_name}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-xs">
                      {reply.user.full_name}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {moment(reply.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-gray-200 text-xs">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
