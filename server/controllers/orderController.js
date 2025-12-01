import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import mongoose from "mongoose";

// ===================== PLACE ORDER =====================
export const placeOrder = async (req, res) => {
  try {
    const { address, paymentMethod, orderItems } = req.body;
    const user = req.user;

    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!orderItems?.length)
      return res.status(400).json({ success: false, message: "Order items required" });

    if (!address || !paymentMethod)
      return res.status(400).json({ success: false, message: "Address and payment method required" });

    const formattedItems = orderItems.map(item => ({
      menuItemId: item._id || item.menuItemId,
      name: item.name,
      price: Number(item.price) || 0,
      quantity: item.quantity || 1,
      image: item.image,
    }));

    const totalPrice = formattedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const trackingId = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    const order = new Order({
      user: user._id,
      orderItems: formattedItems,
      totalPrice,
      paymentMethod,
      address,
      status: "Pending",
      trackingId,
    });

    await order.save();
    await Cart.deleteMany({ user: user._id }); // clear cart

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== GET ALL ORDERS =====================
export const getOrders = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    let orders;
    if (user.role === "admin") {
      // admin can see all orders
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      // regular user sees only their orders
      orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    }

    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== GET ORDER BY ID =====================
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid order ID" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (user.role !== "admin" && !order.user.equals(user._id))
      return res.status(403).json({ success: false, message: "Forbidden" });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== UPDATE ORDER STATUS =====================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["Pending","Confirmed","Preparing","Out for Delivery","Delivered","Cancelled"];

    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Status updated", data: order });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== CART FUNCTIONS =====================
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, name, price, image, quantity } = req.body;
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!menuItemId || !name || price === undefined)
      return res.status(400).json({ success: false, message: "menuItemId, name, price required" });

    const existingItem = await Cart.findOne({ menuItemId, user: user._id });
    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
    } else {
      await Cart.create({ user: user._id, menuItemId, name, price: Number(price), image, quantity: quantity || 1 });
    }

    const items = await Cart.find({ user: user._id });
    res.status(201).json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const items = await Cart.find({ user: user._id });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { change } = req.body;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid cart item ID" });

    const item = await Cart.findOne({ _id: id, user: user._id });
    if (!item) return res.status(404).json({ success: false, message: "Cart item not found" });

    item.quantity = Math.max(1, item.quantity + change);
    await item.save();

    const items = await Cart.find({ user: user._id });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid cart item ID" });

    await Cart.findOneAndDelete({ _id: id, user: user._id });
    const items = await Cart.find({ user: user._id });
    res.json({ success: true, message: "Item removed", data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    await Cart.deleteMany({ user: user._id });
    res.json({ success: true, message: "Cart cleared", data: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
