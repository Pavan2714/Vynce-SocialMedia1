import express from "express";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";
import {
  addPost,
  getFeedPosts,
  likePost,
  deletePost,
  toggleSavePost,
  getSavedPosts,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/add", upload.array("images", 4), protect, addPost);
postRouter.get("/feed", protect, getFeedPosts);
postRouter.post("/like", protect, likePost);
postRouter.delete("/:postId", protect, deletePost);
postRouter.post("/save", protect, toggleSavePost);
postRouter.get("/saved", protect, getSavedPosts);

export default postRouter;
