import Comment from "../model/commentModel.js"
import Post from "../model/postModel.js"


const addComment = async (req, res) => {
    try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!text) return res.status(400).json({ message: "Comment text is required" });

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      text,
      author: req.user._id,
      post: postId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ message: "Server error while adding comment" });
  }
}

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Fetch all comments for this post, populate author info
    const comments = await Comment.find({ post: postId })
      .populate("author", "username avatar") // include author's name & avatar
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ message: "Server error while fetching comments" });
  }
}

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if requester is comment author or post author
    const post = await Post.findById(comment.post);

    if (
      comment.author.toString() !== req.user._id.toString() &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ message: "Server error while deleting comment" });
  }
}

export {
    addComment,getComments, deleteComment
}