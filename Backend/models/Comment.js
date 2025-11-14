import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    post: {
      type: String,
      ref: "Post",
      required: true,
    },
    likes: [
      {
        type: String,
        ref: "User",
      },
    ],
    replies: [
      {
        user: {
          type: String,
          ref: "User",
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: [
          {
            type: String,
            ref: "User",
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", commentSchema);
