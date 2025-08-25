import express from "express";
import { getMe, followUser } from "../controller/userController.js";
import { protect } from "../utils/protect.js";

const router = express.Router();

/*
  User Routes for the Social Media API

  GET /api/users/
    - Gets the logged-in user's profile
    - Requires authentication
    - Returns: user info, followers/following, and user's posts

  PUT /api/users/:id/follow
    - Follow or unfollow another user
    - Requires authentication
    - :id = target user's ID
    - Returns: success message
*/

router.get("/", protect, getMe);
router.put("/:id/follow", protect, followUser);

export default router;
