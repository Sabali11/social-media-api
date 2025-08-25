import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
    try {
    const { username, email, password, bio } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //  Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Create user
    const user = await User.create({
      username,
      email,
      bio: bio || undefined,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        bio: bio || undefined,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id), 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export {
    register, login
}