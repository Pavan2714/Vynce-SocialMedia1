import express from "express";
import auth from "../middlewares/auth.js";
import {
  addComment,
  getComments,
  deleteComment,
  likeComment,
  addReply,
} from "../controllers/commentController.js";

const router = express.Router();

// Add comment
router.post("/add", auth, addComment);

// Get comments for a post
router.get("/:postId", auth, getComments);

// Delete comment
router.delete("/:commentId", auth, deleteComment);

// Like/Unlike comment
router.post("/like/:commentId", auth, likeComment);

// Add reply to comment
router.post("/reply", auth, addReply);

export default router;
