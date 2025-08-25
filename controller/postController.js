import Post from "../model/postModel.js"
import Comment from "../model/commentModel.js";

const createPost = async (req, res) => {
    try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Post text is required" });
    }

    // Create new post
    const post = new Post({
      text,
      author: req.user._id,
    });

    const createdPost = await post.save();

    // Populate author and comments (empty for new post)
    const enrichedPost = await Post.findById(createdPost._id)
      .populate("author", "username avatar")
      .populate({
        path: "comments",
        select: "text author createdAt",
        populate: { path: "author", select: "username avatar" },
      });

    res.status(201).json({
      message: "Post created successfully",
      post: {
        _id: enrichedPost._id,
        text: enrichedPost.text,
        author: enrichedPost.author,
        likesCount: enrichedPost.likes.length,
        comments: enrichedPost.comments || [],
        createdAt: enrichedPost.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ message: "Server error while creating post" });
  }
}

const getPosts = async (req, res) => {
   try {
    const posts = await Post.find()
      .populate("author", "username avatar")
      .populate({
        path: "comments",
        select: "text author createdAt",
        populate: { path: "author", select: "username avatar" },
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 });

    const enrichedPosts = posts.map(post => ({
      _id: post._id,
      text: post.text,
      author: post.author,
      likesCount: post.likes.length,
      comments: post.comments || [],
      createdAt: post.createdAt,
    }));

    res.status(200).json(enrichedPosts);
  } catch (error) {
    console.error("getPosts error:", error.message);
    res.status(500).json({ message: "Server error while fetching posts" });
  }
}

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ message: "Server error while fetching post" });
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only post author can delete
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // Delete post
    await post.deleteOne();

    // Optional: delete all comments associated with this post
    await Comment.deleteMany({ post: post._id });

    // Fetch updated posts feed
    const posts = await Post.find()
      .populate("author", "username avatar")
      .populate({
        path: "comments",
        select: "text author createdAt",
        populate: { path: "author", select: "username avatar" },
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 });

    const enrichedPosts = posts.map(post => ({
      _id: post._id,
      text: post.text,
      author: post.author,
      likesCount: post.likes.length,
      comments: post.comments || [],
      createdAt: post.createdAt,
    }));

    res.status(200).json({
      message: "Post deleted successfully",
      posts: enrichedPosts,
    });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ message: "Server error while deleting post" });
  }
};

const toggleLike = async (req, res) => {
   try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    // Populate author and comments
    const enrichedPost = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate({
        path: "comments",
        select: "text author createdAt",
        populate: { path: "author", select: "username avatar" },
        options: { sort: { createdAt: -1 } },
      });

    res.status(200).json({
      message: post.likes.includes(userId) ? "Post liked" : "Post unliked",
      post: {
        _id: enrichedPost._id,
        text: enrichedPost.text,
        author: enrichedPost.author,
        likesCount: enrichedPost.likes.length,
        comments: enrichedPost.comments || [],
        createdAt: enrichedPost.createdAt,
      },
    });
  } catch (error) {
    console.error("Error toggling like:", error.message);
    res.status(500).json({ message: "Server error while toggling like" });
  }
}
 
export {
    createPost, getPosts, getPostById, deletePost, toggleLike
}