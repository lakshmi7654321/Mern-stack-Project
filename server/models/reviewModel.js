import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: false, // make optional if overall rating exists
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true, // item rating
    },
    overallRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0, // overall rating for the order
    },
    feedback: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews for the same user, order, and menu item
reviewSchema.index(
  { userId: 1, orderId: 1, menuItemId: 1 },
  { unique: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
