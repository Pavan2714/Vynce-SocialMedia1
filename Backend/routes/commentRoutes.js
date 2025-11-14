import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  addComment,
  getComments,
  deleteComment,
  likeComment,
  addReply,
} from "../controllers/commentController.js";

const router = express.Router();

// Routes with Clerk protect middleware
router.post("/add", protect, addComment);
router.get("/:postId", protect, getComments);
router.delete("/:commentId", protect, deleteComment);
router.post("/like/:commentId", protect, likeComment);
router.post("/reply", protect, addReply);

export default router;
