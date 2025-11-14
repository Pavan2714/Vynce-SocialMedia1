import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id;

    if (!postId || !content) {
      return res.status(400).json({
        success: false,
        message: "Post ID and content are required",
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create new comment
    const newComment = new Comment({
      content: content.trim(),
      user: userId,
      post: postId,
    });

    await newComment.save();

    // Populate the comment with user details
    await newComment.populate("user", "full_name username profile_picture");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: postId })
      .populate("user", "full_name username profile_picture")
      .populate("replies.user", "full_name username profile_picture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments({ post: postId });

    res.status(200).json({
      success: true,
      comments,
      totalComments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Like/Unlike a comment
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Comment unliked" : "Comment liked",
      likesCount: comment.likes.length,
      isLiked: !isLiked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add reply to comment
export const addReply = async (req, res) => {
  try {
    const { commentId, content } = req.body;
    const userId = req.user.id;

    if (!commentId || !content) {
      return res.status(400).json({
        success: false,
        message: "Comment ID and content are required",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const reply = {
      user: userId,
      content: content.trim(),
      createdAt: new Date(),
      likes: [],
    };

    comment.replies.push(reply);
    await comment.save();

    // Populate the updated comment
    await comment.populate(
      "replies.user",
      "full_name username profile_picture"
    );

    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
