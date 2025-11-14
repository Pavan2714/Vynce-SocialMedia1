import React, { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
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
    }
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="h-full flex flex-col max-w-2xl mx-auto bg-zinc-900 border-x border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
          <h3 className="text-white font-semibold text-lg">
            Comments ({comments.length})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-blue-500"></div>
                <p className="text-gray-400 text-sm">Loading comments...</p>
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
            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <p className="text-lg font-medium mb-2">No comments yet</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <form
          onSubmit={handleSubmitComment}
          className="p-4 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur"
        >
          <div className="flex gap-3">
            {currentUser?.profile_picture && (
              <img
                src={currentUser.profile_picture}
                alt={currentUser.full_name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-zinc-800"
              />
            )}
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="px-5 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center min-w-[60px]"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentsSection;
