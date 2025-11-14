import React, { useState, useEffect } from "react";
import { X, Send, MessageSquare, ChevronDown } from "lucide-react";
import Comment from "./Comment";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const CommentsSection = ({ postId, isOpen, onClose, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { getToken } = useAuth();
  const currentUser = useSelector((state) => state.user.value);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/comment/${postId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setComments(data.comments);
        if (onCommentCountChange) {
          onCommentCountChange(data.totalComments);
        }
      }
    } catch (error) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const { data } = await api.post(
        "/api/comment/add",
        { postId, content: newComment },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setComments([data.comment, ...comments]);
        setNewComment("");
        toast.success("Comment added successfully");
        if (onCommentCountChange) {
          onCommentCountChange(comments.length + 1);
        }
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((comment) => comment._id !== commentId));
    if (onCommentCountChange) {
      onCommentCountChange(comments.length - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Bottom Sheet Modal */}
      <div className="fixed bottom-0 left-0 right-0 h-[50vh] sm:h-[55vh] z-[70]">
        <div className="h-full flex flex-col bg-zinc-900 rounded-t-3xl shadow-2xl border-t border-x border-zinc-800">
          {/* Header */}
          <div className="flex-shrink-0">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-zinc-700 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between px-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Comments</h3>
                  <p className="text-gray-400 text-xs">
                    {comments.length}{" "}
                    {comments.length === 1 ? "comment" : "comments"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-xl"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
            <div className="h-px bg-zinc-800"></div>
          </div>

          {/* Comments List */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#3b82f6 transparent",
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-blue-500"></div>
                  <p className="text-gray-400 text-sm font-medium">
                    Loading comments...
                  </p>
                </div>
              </div>
            ) : comments.length > 0 ? (
              <div>
                {comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                    onUpdate={fetchComments}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full px-6">
                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <MessageSquare className="w-10 h-10 text-blue-400" />
                </div>
                <h4 className="text-white text-lg font-bold mb-2">
                  No comments yet
                </h4>
                <p className="text-gray-400 text-center text-sm">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="flex-shrink-0 border-t border-zinc-800 bg-zinc-900">
            <form onSubmit={handleSubmitComment} className="p-4">
              <div className="flex gap-3 items-center">
                {currentUser?.profile_picture && (
                  <img
                    src={currentUser.profile_picture}
                    alt={currentUser.full_name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-800"
                  />
                )}
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitComment(e);
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[52px]"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentsSection;
