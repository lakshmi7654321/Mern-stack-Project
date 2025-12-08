import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ==============================
// PROTECT ROUTE MIDDLEWARE
// ==============================
export const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB and exclude password
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    next(); // user is valid, proceed
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
    });
  }
};

// ==============================
// ADMIN CHECK MIDDLEWARE
// ==============================
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); // user is admin, proceed
  }

  return res.status(403).json({
    success: false,
    message: "Not authorized as admin",
  });
};
