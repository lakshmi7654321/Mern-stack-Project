import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, IndianRupee, User } from "lucide-react";
import Cookies from "js-cookie";

const ORDERS_API_URL = "http://localhost:5000/api/orders";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = Cookies.get("token"); // get JWT token

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cleanPrice = (p) => (p ? Number(String(p).replace(/[^\d.]/g, "")) || 0 : 0);

  const fetchOrder = async () => {
    setError("");
    setLoading(true);

    if (!token) {
      setError("You must be logged in to view this order.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${ORDERS_API_URL}/${id}`, {
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
        setError("You do not have permission to access this order.");
        return;
      }

      const data = await res.json();
      if (!data.success || !data.data) throw new Error("Order not found");

      setOrder(data.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Invalid order ID");
      setLoading(false);
      return;
    }
    fetchOrder();
  }, [id]);

  if (loading)
    return <p className="text-center mt-20 text-gray-600">Loading order…</p>;
  if (error)
    return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!order) return <p className="text-center mt-20">No order found</p>;

  const items = order.orderItems?.length
    ? order.orderItems
    : order.cartItems?.length
    ? order.cartItems
    : [];

  const totalAmount = items.reduce(
    (sum, item) => sum + cleanPrice(item.price) * (item.quantity || 1),
    0
  );

  return (
    <section className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-gray-700 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <h2 className="text-2xl font-bold text-green-700 mb-4">Order Details</h2>

        {/* Show Customer Name */}
        {order.user?.name && (
          <p className="text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <strong>Customer:</strong> {order.user.name}
          </p>
        )}

        <p className="text-gray-700 mb-2">
          <strong>Tracking ID:</strong> {order.trackingId || order._id}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Status:</strong>{" "}
          <span className="font-semibold text-blue-700">
            {order.status || "N/A"}
          </span>
        </p>

        <p className="text-gray-700 flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-gray-600" />
          <strong>Delivery Address:</strong> {order.address || "N/A"}
        </p>

        <p className="text-gray-700 flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <strong>Payment Method:</strong> {order.paymentMethod || "N/A"}
        </p>

        <h3 className="text-xl font-semibold mb-2">Items Ordered</h3>
        <div className="divide-y border rounded-xl overflow-hidden">
          {items.length > 0 ? (
            items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between p-4 hover:bg-gray-50 text-gray-700"
              >
                <div>
                  {item.name} × {item.quantity}
                </div>
                <div className="font-semibold">
                  ₹{(cleanPrice(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 p-4">
              No items in this order.
            </p>
          )}
        </div>

        <div className="text-right text-lg font-bold mt-4">
          Total: <IndianRupee className="inline w-4 h-4 mr-1" />
          {totalAmount.toFixed(2)}
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
