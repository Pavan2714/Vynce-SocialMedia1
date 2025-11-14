import imagekit from "../configs/imageKit.js";
import { inngest } from "../inngest/index.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import fs from "fs";
import { clerkClient } from "@clerk/express";

// Get User Data using userId
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update User Data
export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    let { username, bio, location, full_name } = req.body;

    const tempUser = await User.findById(userId);

    !username && (username = tempUser.username);

    if (tempUser.username !== username) {
      const user = await User.findOne({ username });
      if (user) {
        // we will not change the username if it is already taken
        username = tempUser.username;
      }
    }

    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };

    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });
      updatedData.profile_picture = url;

      const blob = await fetch(url).then((res) => res.blob());
      await clerkClient.users.updateUserProfileImage(userId, { file: blob });
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname, // Fixed: was using profile.originalname
      });

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
      updatedData.cover_photo = url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Find Users using username, email, location, name
export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });
    const filteredUsers = allUsers.filter(
      (user) => user._id.toString() !== userId
    ); // Fixed: convert ObjectId to string

    res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Follow User
export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // Validate input
    if (!id || id === userId) {
      return res.json({ success: false, message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Convert ObjectId to string for comparison
    if (user.following.some((followId) => followId.toString() === id)) {
      return res.json({
        success: false,
        message: "You are already following this user",
      });
    }

    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    if (!toUser) {
      return res.json({ success: false, message: "Target user not found" });
    }

    toUser.followers.push(userId);
    await toUser.save();

    res.json({ success: true, message: "Now you are following this user" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Unfollow User
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // Validate input
    if (!id || id === userId) {
      return res.json({ success: false, message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Fixed: proper ObjectId comparison
    user.following = user.following.filter(
      (followId) => followId.toString() !== id
    );
    await user.save();

    const toUser = await User.findById(id);
    if (toUser) {
      toUser.followers = toUser.followers.filter(
        (followerId) => followerId.toString() !== userId
      );
      await toUser.save();
    }

    res.json({
      success: true,
      message: "You are no longer following this user",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    console.log(`🔄 Connection request attempt: ${userId} -> ${id}`);

    // Validate input
    if (!id || id === userId) {
      return res.json({ success: false, message: "Invalid user ID" });
    }

    // Check if target user exists
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if users are already connected
    const user = await User.findById(userId);
    if (user.connections.some((connId) => connId.toString() === id)) {
      return res.json({
        success: false,
        message: "Already connected with this user",
      });
    }

    // CHECK FOR EXISTING CONNECTION IN BOTH DIRECTIONS
    const existingConnection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    console.log(`📋 Existing connection check:`, existingConnection);

    if (existingConnection) {
      console.log(
        `⚠️ Found existing connection with status: ${existingConnection.status}`
      );

      if (existingConnection.status === "pending") {
        return res.json({
          success: false,
          message: "Connection request already pending",
        });
      } else if (existingConnection.status === "accepted") {
        return res.json({ success: false, message: "Already connected" });
      } else if (existingConnection.status === "rejected") {
        // If previously rejected, delete old record and allow new request
        console.log(`🗑️ Deleting rejected connection to allow new request`);
        await Connection.deleteOne({ _id: existingConnection._id });
        // Continue to create new request below
      }
    }

    // Rate limiting check - MOVED AFTER REJECTION HANDLING
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentRequests = await Connection.countDocuments({
      from_user_id: userId,
      status: "pending", // Only count pending requests
      createdAt: { $gte: last24Hours },
    });

    if (recentRequests >= 20) {
      return res.json({
        success: false,
        message:
          "You have sent more than 20 connection requests in the last 24 hours",
      });
    }

    // Create new connection request
    const newConnection = await Connection.create({
      from_user_id: userId,
      to_user_id: id,
      status: "pending",
    });

    console.log(`✅ New connection request created: ${newConnection._id}`);

    // Send notification
    try {
      await inngest.send({
        name: "app/connection-request",
        data: { connectionId: newConnection._id },
      });
    } catch (notificationError) {
      console.log("Notification error (non-critical):", notificationError);
    }

    return res.json({
      success: true,
      message: "Connection request sent successfully",
    });
  } catch (error) {
    console.log("❌ Connection request error:", error);
    res.json({ success: false, message: error.message });
  }
};

// FIXED: Accept Connection Request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // Validate input
    if (!id || id === userId) {
      return res.json({ success: false, message: "Invalid user ID" });
    }

    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userId,
      status: "pending", // Make sure it's pending
    });

    if (!connection) {
      return res.json({
        success: false,
        message: "Connection request not found",
      });
    }

    // Add to both users' connections
    const user = await User.findById(userId);
    if (!user.connections.some((connId) => connId.toString() === id)) {
      user.connections.push(id);
      await user.save();
    }

    const fromUser = await User.findById(id);
    if (
      fromUser &&
      !fromUser.connections.some((connId) => connId.toString() === userId)
    ) {
      fromUser.connections.push(userId);
      await fromUser.save();
    }

    // Update connection status
    connection.status = "accepted";
    await connection.save();

    res.json({ success: true, message: "Connection accepted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    console.log(`🚫 Rejecting connection request from: ${id} to: ${userId}`);

    if (!id || id === userId) {
      return res.json({ success: false, message: "Invalid user ID" });
    }

    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userId,
      status: "pending",
    });

    if (!connection) {
      return res.json({
        success: false,
        message: "Connection request not found",
      });
    }

    // DELETE the connection record completely - DON'T update status
    await Connection.deleteOne({ _id: connection._id });

    console.log(
      `🗑️ Connection request DELETED (not marked as rejected): ${connection._id}`
    );

    res.json({ success: true, message: "Connection request rejected" });
  } catch (error) {
    console.log("❌ Reject connection error:", error);
    res.json({ success: false, message: error.message });
  }
};

// FIXED: Cancel Sent Connection Request
export const cancelConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // Validate input
    if (!id || id === userId) {
      return res.json({ success: false, message: "Invalid user ID" });
    }

    const connection = await Connection.findOne({
      from_user_id: userId,
      to_user_id: id,
      status: "pending",
    });

    if (!connection) {
      return res.json({ success: false, message: "No pending request found" });
    }

    // Delete the connection request
    await Connection.deleteOne({ _id: connection._id });

    res.json({ success: true, message: "Connection request cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// FIXED: Remove Connection
export const removeConnection = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // Validate input
    if (!id || id === userId) {
      return res.json({ success: false, message: "Invalid user ID" });
    }

    // Find the accepted connection
    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id, status: "accepted" },
        { from_user_id: id, to_user_id: userId, status: "accepted" },
      ],
    });

    if (!connection) {
      return res.json({ success: false, message: "Connection not found" });
    }

    // Remove from both users' connections arrays
    const user = await User.findById(userId);
    if (user) {
      user.connections = user.connections.filter(
        (connId) => connId.toString() !== id
      );
      await user.save();
    }

    const connectedUser = await User.findById(id);
    if (connectedUser) {
      connectedUser.connections = connectedUser.connections.filter(
        (connId) => connId.toString() !== userId
      );
      await connectedUser.save();
    }

    // Delete the connection record
    await Connection.deleteOne({ _id: connection._id });

    res.json({ success: true, message: "Connection removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// FIXED: Get User Connections
export const getUserConnections = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).populate(
      "connections followers following"
    );

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const connections = user.connections || [];
    const followers = user.followers || [];
    const following = user.following || [];

    // Get pending requests (requests received by the user)
    const pendingConnectionsData = await Connection.find({
      to_user_id: userId,
      status: "pending",
    }).populate("from_user_id");

    const pendingConnections = pendingConnectionsData
      .map((connection) => connection.from_user_id)
      .filter((user) => user !== null); // Filter out null values

    // Get sent requests (requests sent by the user)
    const sentRequestsData = await Connection.find({
      from_user_id: userId,
      status: "pending",
    }).populate("to_user_id");

    const sentRequests = sentRequestsData
      .map((connection) => connection.to_user_id)
      .filter((user) => user !== null); // Filter out null values

    res.json({
      success: true,
      connections,
      followers,
      following,
      pendingConnections,
      sentRequests,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// FIXED: Get User Profiles
export const getUserProfiles = async (req, res) => {
  try {
    const { profileId } = req.body;

    // Validate input
    if (!profileId) {
      return res.json({ success: false, message: "Profile ID is required" });
    }

    const profile = await User.findById(profileId);
    if (!profile) {
      return res.json({ success: false, message: "Profile not found" });
    }

    const posts = await Post.find({ user: profileId })
      .populate("user")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({ success: true, profile, posts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
