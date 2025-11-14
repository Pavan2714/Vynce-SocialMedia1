import express from "express";
import {
  acceptConnectionRequest,
  discoverUsers,
  followUser,
  getUserConnections,
  getUserData,
  getUserProfiles,
  sendConnectionRequest,
  unfollowUser,
  updateUserData,
  rejectConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";
import { getUserRecentMessages } from "../controllers/messageController.js";

const userRouter = express.Router();

// User data routes
userRouter.get("/data", protect, getUserData);
userRouter.post(
  "/update",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  updateUserData
);

// Discovery and follow routes
userRouter.post("/discover", protect, discoverUsers);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, unfollowUser);

// Connection system routes
userRouter.post("/connect", protect, sendConnectionRequest); // Keep your existing route
userRouter.post("/accept", protect, acceptConnectionRequest); // Keep your existing route
userRouter.post("/reject-request", protect, rejectConnectionRequest);
userRouter.post("/cancel-request", protect, cancelConnectionRequest);
userRouter.post("/remove-connection", protect, removeConnection);

// Other routes
userRouter.get("/connections", protect, getUserConnections);
userRouter.post("/profiles", getUserProfiles);
userRouter.get("/recent-messages", protect, getUserRecentMessages);

export default userRouter;
