import express from "express";
import {
  getOrders,
  getOrderById,
  placeOrder,
  updateOrderStatus,
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================== ORDERS ==================
// Authenticated users can see their orders
router.get("/", protect, getOrders); // remove admin middleware
router.get("/:id", protect, getOrderById);
router.post("/place", protect, placeOrder);
router.put("/:id/status", protect, admin, updateOrderStatus); // only admin can update status

// ================== CART ==================
router.post("/cart/add", protect, addToCart);
router.get("/cart/items", protect, getCartItems);
router.patch("/cart/update/:id", protect, updateCartItem);
router.delete("/cart/delete/:id", protect, deleteCartItem);
router.delete("/cart/clear", protect, clearCart);

export default router;
