import express from "express";
import {addComment, getComments, deleteComment} from "../controller/commentController.js"
import { protect } from "../utils/protect.js";

const router = express.Router();

router.post("/:postId", protect, addComment);
router.get("/:postId", protect, getComments);
router.delete("/:id", protect, deleteComment);

export default router;
