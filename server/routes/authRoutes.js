import express from "express";
import multer from "multer";

import {
  signup,
  login,
  getProfile,
  updateProfile,
  uploadAvatar,
  getAllUsers,
} from "../controllers/authController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= MULTER FOR FILE UPLOADS =================
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ================= PUBLIC ROUTES =================
router.post("/signup", signup);
router.post("/login", login);

// ================= USER PROTECTED ROUTES =================
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Avatar upload route must have multer upload BEFORE controller
router.post(
  "/profile/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);

// ================= ADMIN ONLY ROUTES =================
router.get("/users", protect, admin, getAllUsers);

export default router;
