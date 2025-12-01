import Cart from "../models/cartModel.js";
import mongoose from "mongoose";

// ------------------ ADD TO CART ------------------
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, name, price, image, quantity } = req.body;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!menuItemId || !name || price === undefined)
      return res.status(400).json({ success: false, message: "Missing fields" });

    let existingItem = await Cart.findOne({ menuItemId, userId });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
    } else {
      await Cart.create({
        userId,
        menuItemId,
        name,
        price,
        image,
        quantity: quantity || 1,
      });
    }

    const items = await Cart.find({ userId });
    res.status(201).json({ success: true, message: "Cart updated", data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------ GET CART ITEMS ------------------
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const items = await Cart.find({ userId });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------ UPDATE CART ITEM QUANTITY ------------------
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { change } = req.body;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid item ID" });

    const item = await Cart.findOne({ _id: id, userId });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.quantity = Math.max(1, item.quantity + change);
    await item.save();

    const items = await Cart.find({ userId });
    res.json({ success: true, message: "Quantity updated", data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------ DELETE SINGLE ITEM ------------------
export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid item ID" });

    await Cart.findOneAndDelete({ _id: id, userId });

    const items = await Cart.find({ userId });
    res.json({ success: true, message: "Item removed", data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------ CLEAR CART ------------------
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    await Cart.deleteMany({ userId });
    res.json({ success: true, message: "Cart cleared", data: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
