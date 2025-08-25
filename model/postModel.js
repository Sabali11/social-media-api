import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      maxlength: 500,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

postSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

const Post = mongoose.model("Post", postSchema);
export default Post;
