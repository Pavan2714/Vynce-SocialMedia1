import React, { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import Comment from "./Comment";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const CommentsSection = ({ postId, isOpen, onClose, initialCommentsCount }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { getToken } = useAuth();

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
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((comment) => comment._id !== commentId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="h-full flex flex-col max-w-2xl mx-auto bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h3 className="text-white font-semibold text-lg">Comments</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-white"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-gray-400">
              <p>No comments yet</p>
              <p className="text-sm mt-1">Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <form
          onSubmit={handleSubmitComment}
          className="p-4 border-t border-zinc-800"
        >
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
