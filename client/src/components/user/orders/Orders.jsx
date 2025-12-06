import React, { useEffect, useState } from "react";
import { Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ORDERS_API_URL = "https://mern-stack-project-1-ahdo.onrender.com/api/orders";
const MENU_API_URL = "https://mern-stack-project-1-ahdo.onrender.com/api/menu";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const cleanPrice = (p) => (p ? Number(String(p).replace(/[^\d.]/g, "")) || 0 : 0);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    if (!token) {
      setError("You must be logged in to view your orders.");
      navigate("/login");
      return;
    }

    try {
      // 1️⃣ Fetch menu items
      const menuRes = await fetch(MENU_API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const menuData = await menuRes.json();
      const menuList = menuData.data || [];

      // 2️⃣ Fetch orders
      const res = await fetch(ORDERS_API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setError("Session expired. Please login again.");
        Cookies.remove("token");
        navigate("/login");
        return;
      }

      if (res.status === 403) {
        setError("You do not have permission to access orders.");
        return;
      }

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Failed to fetch orders");

      const ordersData = result.data || [];

      // 3️⃣ Merge menu details directly using fetched menuList
      const mergedOrders = ordersData.map((order) => {
        const updatedItems = (order.orderItems || []).map((item) => {
          const menuItem = menuList.find((m) => m.name === item.name) || {};
          return {
            ...menuItem,
            ...item,
            price: cleanPrice(menuItem.price) || cleanPrice(item.price),
            image: menuItem.image || item.image || "",
            quantity: item.quantity || 1,
          };
        });

        return {
          ...order,
          cartItems: updatedItems,
          date: order.createdAt || new Date().toISOString(),
          orderId: order._id,
        };
      });

      mergedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(mergedOrders);
    } catch (err) {
      console.error("Order fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, navigate]);

  if (loading) return <p className="text-center mt-20">Loading orders...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (orders.length === 0)
    return (
      <p className="text-center mt-20 text-gray-600">
        You haven’t placed any orders yet.
      </p>
    );

  const recentOrders = orders.slice(0, 3);
  const olderOrders = orders.slice(3);

  return (
    <section className="min-h-screen bg-gray-50 pt-4 px-2">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-5 text-green-700 flex items-center gap-2">
          <Package className="w-7 h-7 text-green-600" /> Your Orders
        </h2>

        <h3 className="text-xl font-bold text-gray-800 mb-3">Recent Orders</h3>
        <div className="space-y-6 pb-10">
          {recentOrders.map((order, index) => {
            const totalAmount = order.cartItems.reduce(
              (sum, item) => sum + cleanPrice(item.price) * item.quantity,
              0
            );

            return (
              <div
                key={order.orderId}
                className="bg-white p-6 rounded-2xl shadow border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-green-700">
                    Order #{index + 1}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-sm mb-2 text-gray-700">
                  <span className="font-semibold">Tracking ID:</span> {order.orderId}
                </p>

                <p className="font-semibold text-gray-900 flex justify-between border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-green-700 font-bold">₹{totalAmount.toFixed(2)}</span>
                </p>

                <div className="mt-4 text-right">
                  <button
                    onClick={() =>
                      navigate(`/order-details/${order.orderId}`, { state: { order } })
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 ml-auto hover:bg-blue-700"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {olderOrders.length > 0 && (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Older Orders</h3>
            {olderOrders.map((order, index) => {
              const totalAmount = order.cartItems.reduce(
                (sum, item) => sum + cleanPrice(item.price) * item.quantity,
                0
              );
              return (
                <div
                  key={order.orderId}
                  className="bg-white p-6 rounded-2xl shadow border border-gray-200 mb-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-green-700">
                      Order #{index + 4}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm mb-2 text-gray-700">
                    <span className="font-semibold">Tracking ID:</span> {order.orderId}
                  </p>
                  <p className="font-semibold text-gray-900 flex justify-between border-t pt-2">
                    <span>Total Amount:</span>
                    <span className="text-green-700 font-bold">₹{totalAmount.toFixed(2)}</span>
                  </p>
                  <div className="mt-4 text-right">
                    <button
                      onClick={() =>
                        navigate(`/order-details/${order.orderId}`, { state: { order } })
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 ml-auto hover:bg-blue-700"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
};

export default Orders;
