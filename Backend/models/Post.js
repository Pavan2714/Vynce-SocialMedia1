import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "User", required: true },
    content: { type: String },
    image_urls: [{ type: String }],
    post_type: {
      type: String,
      enum: ["text", "image", "text_with_image"],
      required: true,
    },
    likes_count: [{ type: String, ref: "User" }],
  },
  { timestamps: true, minimize: false }
);

// Add virtual field for comments count
postSchema.virtual("comments_count", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true,
});

// Ensure virtual fields are included in JSON
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

const Post = mongoose.model("Post", postSchema);

export default Post;
