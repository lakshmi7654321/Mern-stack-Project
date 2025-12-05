import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, ShoppingBag, MapPin, Calendar, IndianRupee } from "lucide-react";
import Cookies from "js-cookie";

const ORDERS_API = "http://localhost:5000/api/orders";
const USERS_API = "http://localhost:5000/api/auth/users";

const OrderView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const token = Cookies.get("token");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        // Fetch all users
        const usersRes = await fetch(USERS_API, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const usersData = await usersRes.json();
        const map = {};
        usersData.data?.forEach((u) => {
          map[u._id] = { name: u.name, phone: u.phone || "N/A" };
        });
        setUsersMap(map);

        // Fetch the order
        const orderRes = await fetch(`${ORDERS_API}/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (orderRes.status === 403) {
          setErrorMsg("You do not have permission to view this order.");
          setLoading(false);
          return;
        }
        if (orderRes.status === 401) {
          setErrorMsg("You are not logged in. Please log in first.");
          setLoading(false);
          return;
        }

        if (orderRes.ok) {
          const data = await orderRes.json();
          setOrder(data.data);
        } else {
          setErrorMsg(`Failed to fetch order: ${orderRes.statusText}`);
        }
      } catch (err) {
        console.error("Backend fetch failed:", err);
        setErrorMsg("Backend is unreachable.");
      }

      setLoading(false);
    };

    loadData();
  }, [id, token]);

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading order...</p>;

  if (!order)
    return (
      <div className="p-8 text-center">
        <Link
          to="/admin/orders"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          <ArrowLeft className="inline-block w-5 h-5 mr-1" /> Back to Orders
        </Link>
        <p className="text-red-600 font-semibold text-lg">{errorMsg || "Order not found."}</p>
      </div>
    );

  const totalAmount = order.orderItems?.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  ) || 0;

  const customer = usersMap[order.user] || {};
  const customerName = customer.name || order.customerName || "N/A";
  const customerPhone = customer.phone || order.customerPhone || "N/A";
  const customerAddress = order.address || "N/A";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        to="/admin/orders"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Orders
      </Link>

      <div className="bg-white shadow-xl rounded-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold">Order #{order.orderId || order._id}</h1>
          <span
            className={`px-4 py-2 rounded-full font-medium ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {order.status || "Confirmed"}
          </span>
        </div>

        {/* Customer Details */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-blue-500" /> Customer Details
          </h2>
          <p><strong>Name:</strong> {customerName}</p>
          <p><strong>Phone:</strong> {customerPhone}</p>
          <p className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" /> {customerAddress}
          </p>
        </section>

        {/* Order Info */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
            <ShoppingBag className="w-5 h-5 text-green-500" /> Order Information
          </h2>
          <p className="flex items-center">
            <IndianRupee className="w-4 h-4 mr-1" /> Total: ₹{totalAmount.toFixed(2)}
          </p>
          <p className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" /> Placed on:{" "}
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
          </p>
        </section>

        {/* Items List */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Items Ordered</h2>
          <div className="divide-y border rounded-xl overflow-hidden">
            {order.orderItems?.length > 0 ? (
              order.orderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between p-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 p-4">No items in this order.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderView;
