import React, { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, MapPin, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CART_API_URL = "https://mern-stack-project-1-ahdo.onrender.com/api/cart";
const PLACE_ORDER_URL = "https://mern-stack-project-1-ahdo.onrender.com/api/orders";
const PROFILE_URL = "https://mern-stack-project-1-ahdo.onrender.com/api/auth/profile";

const CheckoutSection = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [loading, setLoading] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);

  const token = Cookies.get("token");

  // ================= FETCH PROFILE =================
  const fetchUserProfile = async () => {
    if (!token) return navigate("/login");
    try {
      const res = await fetch(PROFILE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        const { address, city, state } = json.data;
        setAddress([address, city, state].filter(Boolean).join(", "));
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      navigate("/login");
    }
  };

  // ================= FETCH CART =================
  const fetchCart = async () => {
    if (!token) return navigate("/login");
    try {
      setLoading(true);
      const res = await fetch(CART_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to fetch cart");
      setCartItems(json.data || []);
    } catch (err) {
      console.error("Cart fetch error:", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchCart();
  }, []);

  // ================= UPDATE QUANTITY =================
  const updateQuantity = async (itemId, change) => {
    try {
      setUpdatingItem(itemId);
      const res = await fetch(`${CART_API_URL}/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ change }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setCartItems(json.data || []);
    } catch (err) {
      alert(err.message || "Failed to update quantity.");
    } finally {
      setUpdatingItem(null);
    }
  };

  // ================= REMOVE ITEM =================
  const removeItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      setUpdatingItem(itemId);
      const res = await fetch(`${CART_API_URL}/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setCartItems(json.data || []);
    } catch (err) {
      alert(err.message || "Failed to remove item.");
    } finally {
      setUpdatingItem(null);
    }
  };

  // ================= PLACE ORDER =================
  const placeOrder = async () => {
    if (!token) return navigate("/login");
    if (!address.trim()) return alert("Enter delivery address.");
    if (cartItems.length === 0) return alert("Your cart is empty.");

    try {
      setLoading(true);
      const orderItems = cartItems.map((item) => ({
        menuItemId: item.menuItemId || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const res = await fetch(`${PLACE_ORDER_URL}/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderItems, address, paymentMethod }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      // Clear cart
      await fetch(`${CART_API_URL}/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems([]);
      navigate(`/order-confirm/${json.data._id}`);
    } catch (err) {
      alert(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading && cartItems.length === 0) return <p className="text-center mt-20">Loading cart...</p>;
  if (cartItems.length === 0) return <p className="text-center mt-20">Cart is empty.</p>;

  return (
    <section className="min-h-screen bg-green-50 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <button onClick={() => navigate("/cart")} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 mb-6">
          <ArrowLeft className="w-5 h-5" /> Back to Cart
        </button>

        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Checkout</h2>

        {/* Cart Items */}
        <div className="mb-10 divide-y border rounded-2xl overflow-hidden">
          {cartItems.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between p-4 hover:bg-green-50">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  <p className="text-gray-500 text-sm">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 sm:mt-0">
                <div className="flex items-center border rounded-full">
                  <button onClick={() => updateQuantity(item._id, -1)} disabled={item.quantity === 1 || updatingItem === item._id} className="p-2 hover:bg-green-100 rounded-full disabled:opacity-50">
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)} disabled={updatingItem === item._id} className="p-2 hover:bg-green-100 rounded-full disabled:opacity-50">
                    <Plus size={16} />
                  </button>
                </div>

                <span className="text-green-700 font-semibold text-lg">₹{(item.price * item.quantity).toFixed(2)}</span>

                <button onClick={() => removeItem(item._id)} disabled={updatingItem === item._id} className="text-red-500 hover:text-red-700 disabled:opacity-50">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <MapPin className="text-green-600" /> Delivery Address
          </h3>
          <textarea rows="3" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded-lg px-4 py-3" placeholder="Enter address..." />
        </div>

        {/* Payment */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <CreditCard className="text-green-600" /> Payment Method
          </h3>
          <div className="flex gap-4 flex-wrap">
            {["Card", "UPI", "Cash on Delivery"].map((method) => (
              <button key={method} onClick={() => setPaymentMethod(method)} className={`px-5 py-2 rounded-full border ${paymentMethod === method ? "bg-green-600 text-white border-green-600" : "border-gray-300 hover:bg-green-100"}`}>
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
          <p className="mb-4">Total: <span className="font-bold text-green-700">₹{totalPrice.toFixed(2)}</span></p>
          <button onClick={placeOrder} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 disabled:opacity-50">
            {loading ? "Placing Order..." : "Confirm & Place Order"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSection;
