import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Add Post
export const addPost = async (req, res) => {
  try {
    const { userId } = req.auth();
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
    const { userId } = req.auth();
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

// Like Post
export const likePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (post.likes_count.includes(userId)) {
      post.likes_count = post.likes_count.filter((user) => user !== userId);
      await post.save();
      res.json({ success: true, message: "Post unliked" });
    } else {
      post.likes_count.push(userId);
      await post.save();
      res.json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.auth?.userId; // Clerk user ID
    const { postId } = req.params;

    if (!userId) {
      return res.json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const toggleSavePost = async (req, res) => {
  try {
    const { postId } = req.body;

    // Get userId from protect middleware (it should set req.userId)
    // If your protect middleware uses req.auth(), get userId from there
    let userId;
    try {
      const auth = await req.auth();
      userId = auth.userId;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
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

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize saved_posts array if it doesn't exist
    if (!user.saved_posts) {
      user.saved_posts = [];
    }

    // Check if post is already saved
    const isSaved = user.saved_posts.includes(postId);

    if (isSaved) {
      // Unsave the post
      user.saved_posts = user.saved_posts.filter(
        (id) => id.toString() !== postId.toString()
      );
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Post removed from saved",
        isSaved: false,
      });
    } else {
      // Save the post
      user.saved_posts.push(postId);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Post saved successfully",
        isSaved: true,
      });
    }
  } catch (error) {
    console.error("Error in toggleSavePost:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all saved posts for current user
export const getSavedPosts = async (req, res) => {
  try {
    // Get userId from protect middleware
    let userId;
    try {
      const auth = await req.auth();
      userId = auth.userId;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Find user and populate saved posts
    const user = await User.findById(userId).populate({
      path: "saved_posts",
      populate: {
        path: "user",
        select: "username full_name profile_picture",
      },
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Filter out any null posts (in case some were deleted)
    const savedPosts = user.saved_posts?.filter((post) => post !== null) || [];

    return res.status(200).json({
      success: true,
      savedPosts,
      count: savedPosts.length,
    });
  } catch (error) {
    console.error("Error in getSavedPosts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
