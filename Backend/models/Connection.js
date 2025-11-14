import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    from_user_id: {
      type: String,
      ref: "User",
      required: true,
    },
    to_user_id: {
      type: String,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique connection between two users
connectionSchema.index({ from_user_id: 1, to_user_id: 1 }, { unique: true });

// Index for faster queries
connectionSchema.index({ to_user_id: 1, status: 1 }); // For pending requests
connectionSchema.index({ from_user_id: 1, status: 1 }); // For sent requests
connectionSchema.index({ status: 1 }); // For status-based queries

// Pre-save middleware to update the updated_at field
connectionSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.updated_at = new Date();
  }
  next();
});

// Static method to find connection between two users
connectionSchema.statics.findConnection = function (userId1, userId2) {
  return this.findOne({
    $or: [
      { from_user_id: userId1, to_user_id: userId2 },
      { from_user_id: userId2, to_user_id: userId1 },
    ],
  });
};

// Static method to check if users are connected
connectionSchema.statics.areConnected = function (userId1, userId2) {
  return this.findOne({
    $or: [
      { from_user_id: userId1, to_user_id: userId2, status: "accepted" },
      { from_user_id: userId2, to_user_id: userId1, status: "accepted" },
    ],
  });
};

// Static method to get user's connections
connectionSchema.statics.getUserConnections = function (userId) {
  return this.find({
    $or: [
      { from_user_id: userId, status: "accepted" },
      { to_user_id: userId, status: "accepted" },
    ],
  }).populate("from_user_id to_user_id");
};

// Static method to get pending requests for a user
connectionSchema.statics.getPendingRequests = function (userId) {
  return this.find({
    to_user_id: userId,
    status: "pending",
  }).populate("from_user_id");
};

// Static method to get sent requests by a user
connectionSchema.statics.getSentRequests = function (userId) {
  return this.find({
    from_user_id: userId,
    status: "pending",
  }).populate("to_user_id");
};

// Instance method to accept connection
connectionSchema.methods.accept = async function () {
  this.status = "accepted";
  this.updated_at = new Date();
  return await this.save();
};

// Instance method to reject connection
connectionSchema.methods.reject = async function () {
  this.status = "rejected";
  this.updated_at = new Date();
  return await this.save();
};

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
