import express from "express";
import { createPost, getPosts, getPostById, deletePost, toggleLike } from "../controller/postController.js";
import { protect } from "../utils/protect.js";

const router = express.Router();


/*
  Post Routes for the Social Media API

  POST /api/posts/
    - Create a new post
    - Requires authentication
    - Expects: text (and optionally image/video in future)
    - Returns: created post

  GET /api/posts/
    - Get all posts (feed)
    - Requires authentication
    - Returns: array of posts with author, likes, and comments info

  GET /api/posts/:id
    - Get a single post by ID
    - Requires authentication
    - Returns: post details

  DELETE /api/posts/:id
    - Delete a post by ID
    - Requires authentication
    - Only post owner can delete
    - Returns: success message

  POST /api/posts/:id/like
    - Toggle like/unlike on a post
    - Requires authentication
    - Returns: updated likes info
*/

router.post("/", protect, createPost);
router.get("/", protect, getPosts);
router.get("/:id", protect, getPostById);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLike);

export default router;
