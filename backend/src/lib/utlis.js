import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  // Generate the JWT token
  const token = jwt.sign({ userId }, process.env.SECRETKEY, {
    expiresIn: "7d", // Token expiration time
  });

  // Set the JWT token in a secure HTTP-only cookie
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // Prevent XSS attacks
    sameSite: "strict", // Prevent CSRF attacks
    secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS in production
  });

  return token; // Return the token (optional, if needed elsewhere)
};

export default generateToken;
