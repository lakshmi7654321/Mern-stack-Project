import express from "express";
import {
  submitReview,
  getReviewsByOrder,
  getReviewsByMenuItem,
  getAllReviews,
  getOverallReviews // <- import the new controller
} from "../controllers/reviewController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================== USER ROUTES ==========================

// Submit or update a review (User must be logged in)
router.post("/", protect, submitReview);

// Get reviews for a specific order (User must be logged in)
router.get("/order/:orderId", protect, getReviewsByOrder);

// Get reviews for a specific menu item
router.get("/item/:menuItemId", getReviewsByMenuItem);

// ======================== PUBLIC ROUTE ==========================
// Get overall reviews (no token needed)
router.get("/overall", getOverallReviews);

// ======================== ADMIN ROUTES ==========================
// Get all reviews (admin only)
router.get("/", protect, admin, getAllReviews);

export default router;
