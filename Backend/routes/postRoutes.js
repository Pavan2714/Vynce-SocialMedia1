import express from "express";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";
import {
  addPost,
  getFeedPosts,
  likePost,
  getPostById, // Add this import
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/add", upload.array("images", 4), protect, addPost);
postRouter.get("/feed", protect, getFeedPosts);
postRouter.post("/like", protect, likePost);

// Add these new routes
postRouter.get("/:postId", protect, getPostById); // Get single post
postRouter.post("/like/:postId", protect, likePost); // Updated like route

export default postRouter;
