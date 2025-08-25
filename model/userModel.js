// models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
      bio: {
      type: String,
      maxlength: 160,
      default: "",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});

const User = mongoose.model("User", userSchema);
export default User;
