import React, { useEffect, useState } from "react";
import { Trash2, ArrowLeft, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const CART_API_URL = `${import.meta.env.VITE_API_BASE_URL}/cart`;


const OrderSection = () => {
  const [cartItems, setCartItems] = useState([]); // FIXED NAME
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const token = Cookies.get("token");

  // Fetch cart
  const fetchCart = async () => {
    if (!token) return navigate("/login");

    try {
      setLoading(true);
      const res = await fetch(CART_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) return navigate("/login");

      const json = await res.json();
      setCartItems(json.success ? json.data : []);
    } catch (err) {
      console.error(err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Toast function
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  // Update quantity (+1 / -1)
  const updateQuantity = async (itemId, change) => {
    // Change MUST be number → FIXED
    const numericChange = Number(change);

    // Optimistic UI
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + numericChange) }
          : item
      )
    );

    try {
      setUpdatingItem(itemId);

      const res = await fetch(`${CART_API_URL}/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ change: numericChange }), // FIXED
      });

      if (res.status === 401) return navigate("/login");

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setCartItems(json.data || []);
      showToast("Quantity updated!");
    } catch (err) {
      console.error(err);
      showToast("Failed! Restoring...");
      fetchCart();
    } finally {
      setUpdatingItem(null);
    }
  };

  // Delete one item
  const removeItem = async (itemId) => {
    if (!window.confirm("Remove this item?")) return;

    try {
      setUpdatingItem(itemId);

      const res = await fetch(`${CART_API_URL}/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) return navigate("/login");

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setCartItems(json.data || []);
      showToast("Item removed!");
    } catch (err) {
      console.error(err);
      showToast("Failed to remove item");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Clear all
  const clearCart = async () => {
    if (!window.confirm("Clear your cart?")) return;

    try {
      setLoading(true);

      const res = await fetch(`${CART_API_URL}/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) return navigate("/login");

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setCartItems([]);
      showToast("Cart cleared!");
    } catch (err) {
      console.error(err);
      showToast("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  // Total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="min-h-screen bg-green-50 py-10 px-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50">
          {toastMessage}
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Your Cart
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-6 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-green-50 p-4 rounded-2xl shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />

                    <div>
                      <h4 className="font-semibold text-lg">{item.name}</h4>
                      <p className="text-gray-500">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    <div className="flex items-center border rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        disabled={item.quantity === 1 || updatingItem === item._id}
                        className="px-3 py-1 bg-white hover:bg-green-100"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="px-4 font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        disabled={updatingItem === item._id}
                        className="px-3 py-1 bg-white hover:bg-green-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <span className="text-green-700 font-bold text-lg">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeItem(item._id)}
                      disabled={updatingItem === item._id}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow mb-6">
              <span className="font-semibold text-lg">Total:</span>
              <span className="text-green-700 font-bold text-xl">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex justify-between flex-wrap gap-4">
              <button
                onClick={clearCart}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700"
              >
                Clear Cart
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OrderSection;
