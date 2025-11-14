import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Add Post
export const addPost = async (req, res) => {
  try {
    const userId = req.user.id; // Using protect middleware
    const { content, post_type } = req.body;
    const images = req.files;

    let image_urls = [];

    if (images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: image.originalname,
            folder: "posts",
          });

          const url = imagekit.url({
            path: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1280" },
            ],
          });
          return url;
        })
      );
    }

    await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });
    res.json({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Posts
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // User connections and followings
    const userIds = [userId, ...user.connections, ...user.following];
    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Single Post by ID - NEW FUNCTION
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("user", "username full_name profile_picture")
      .populate("comments_count"); // Using your virtual field

    if (!post) {
      return res.json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      post: post,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Like Post - UPDATED VERSION
export const likePost = async (req, res) => {
  try {
    const userId = req.user.id;

    // Handle both old route (postId in body) and new route (postId in params)
    const postId = req.params.postId || req.body.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user already liked the post (comparing strings since likes_count uses String type)
    const isLiked = post.likes_count.includes(userId);

    if (isLiked) {
      // Unlike the post
      post.likes_count = post.likes_count.filter((user) => user !== userId);
    } else {
      // Like the post
      post.likes_count.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      message: isLiked ? "Post unliked" : "Post liked",
      liked: !isLiked,
      likesCount: post.likes_count.length,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
