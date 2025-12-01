import Review from "../models/reviewModel.js";
import mongoose from "mongoose";

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ================== SUBMIT OR UPDATE REVIEW ==================
export const submitReview = async (req, res) => {
  try {
    const { orderId, menuItemId, rating, overallRating, feedback } = req.body;
    const userId = req.user?._id;

    // Basic validation
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!isValidId(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }
    if (menuItemId && !isValidId(menuItemId)) {
      return res.status(400).json({ success: false, message: "Invalid menu item ID" });
    }
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }
    if (overallRating && (overallRating < 1 || overallRating > 5)) {
      return res.status(400).json({ success: false, message: "Overall rating must be between 1 and 5" });
    }

    // Upsert review
    const existingReview = await Review.findOne({
      userId,
      orderId,
      menuItemId: menuItemId || null,
    });

    if (existingReview) {
      if (rating) existingReview.rating = rating;
      if (overallRating) existingReview.overallRating = overallRating;
      if (feedback) existingReview.feedback = feedback;
      await existingReview.save();

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: existingReview,
      });
    }

    const newReview = await Review.create({
      userId,
      orderId,
      menuItemId: menuItemId || null,
      rating: rating || 0,
      overallRating: overallRating || 0,
      feedback: feedback || "",
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: newReview,
    });

  } catch (err) {
    console.error("Submit Review Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ================== GET REVIEWS FOR AN ORDER ==================
export const getReviewsByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!isValidId(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const reviews = await Review.find({ orderId })
      .populate("menuItemId", "name image")
      .populate("userId", "name email");

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error("Get Reviews By Order Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ================== GET REVIEWS FOR A MENU ITEM ==================
export const getReviewsByMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    if (!isValidId(menuItemId)) {
      return res.status(400).json({ success: false, message: "Invalid menu item ID" });
    }

    const reviews = await Review.find({ menuItemId })
      .populate("userId", "name email");

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error("Get Reviews By Menu Item Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ================== GET ALL REVIEWS (ADMIN) ==================
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("menuItemId", "name image")
      .populate("orderId", "trackingId")
      .populate("userId", "name email");

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error("Get All Reviews Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ================== GET OVERALL REVIEWS (PUBLIC) ==================
export const getOverallReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name")
      .populate("orderId", "trackingId")
      .populate("menuItemId", "name image");

    // Filter reviews without a menuItemId (overall reviews)
    const overallReviews = reviews.filter((r) => !r.menuItemId);

    res.status(200).json({ success: true, data: overallReviews });
  } catch (err) {
    console.error("Get Overall Reviews Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
