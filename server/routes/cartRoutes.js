import express from "express";
import {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js"; // 🔑 auth

const router = express.Router();

// All routes require authentication
router.use(protect);

// Add item to cart
router.post("/", addToCart);

// Get all cart items
router.get("/", getCartItems);

// Update cart item quantity
router.patch("/:id", updateCartItem);

// Delete single item
router.delete("/:id", deleteCartItem);

// Clear entire cart
router.delete("/clear", clearCart);

export default router;
