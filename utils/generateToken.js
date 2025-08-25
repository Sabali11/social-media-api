import jwt from "jsonwebtoken";


// Utility function to generate a token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default generateToken;
