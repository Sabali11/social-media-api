import User from "../model/userModel.js";
import Post from "../model/postModel.js";
import Comment from "../model/commentModel.js";

// Get logged-in user's profile with posts, likes, and comments
const getMe = async (req, res) => {
   try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // Fetch user info excluding password
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: "posts",
        select: "text likes createdAt",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "comments",       // Populate comments directly
          select: "text author createdAt",
          populate: { path: "author", select: "username avatar" },
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Map posts to include likesCount and comments
    const enrichedPosts = (user.posts || []).map(post => ({
      _id: post._id,
      text: post.text,
      likesCount: post.likes.length,
      comments: post.comments || [],
      createdAt: post.createdAt,
    }));

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
      posts: enrichedPosts,
    });
  } catch (error) {
    console.error("getMe error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Follow or unfollow a user
const followUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = req.user._id;
    const targetUserId = req.params.id;

    if (userId.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user) return res.status(404).json({ message: "Logged-in user not found" });
    if (!targetUser) return res.status(404).json({ message: "Target user not found" });

    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      user.following = user.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId.toString());
    } else {
      // Follow
      user.following.push(targetUserId);
      targetUser.followers.push(userId);
    }

    await user.save();
    await targetUser.save();

    res.json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      followersCount: targetUser.followers.length,
      followingCount: user.following.length,
    });
  } catch (error) {
    console.error("followUser error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getMe,
  followUser,
};
