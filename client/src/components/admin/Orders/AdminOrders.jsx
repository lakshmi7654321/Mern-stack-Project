import React, { useEffect, useState } from "react";
import { ShoppingCart, Clock, CheckCircle, Truck, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ORDERS_API = "https://mern-stack-project-1-ahdo.onrender.com/api/orders";
const USERS_API = "https://mern-stack-project-1-ahdo.onrender.com/api/auth/users";


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  // Fetch all users and create a map
  const fetchUsersMap = async () => {
    try {
      const res = await fetch(USERS_API, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      const map = {};
      data.data?.forEach((u) => {
        map[u._id] = { name: u.name, phone: u.phone || "N/A" };
      });
      setUsersMap(map);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(ORDERS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUsersMap(), fetchOrders()]).finally(() =>
      setLoading(false)
    );
  }, [token]);

  const statusOptions = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`${ORDERS_API}/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update status");

      setOrders((prevOrders) =>
        prevOrders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Try again.");
      fetchOrders();
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Dashboard summary
  const summary = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    confirmed: orders.filter((o) => o.status === "Confirmed").length,
    preparing: orders.filter((o) => o.status === "Preparing").length,
    outForDelivery: orders.filter((o) => o.status === "Out for Delivery").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  const cards = [
    { title: "Total Orders", value: summary.total, icon: <ShoppingCart size={34} />, color: "bg-blue-500" },
    { title: "Pending", value: summary.pending, icon: <Clock size={34} />, color: "bg-yellow-500" },
    { title: "Confirmed", value: summary.confirmed, icon: <CheckCircle size={34} />, color: "bg-green-500" },
    { title: "Preparing", value: summary.preparing, icon: <Truck size={34} />, color: "bg-purple-500" },
    { title: "Delivered", value: summary.delivered, icon: <BadgeCheck size={34} />, color: "bg-teal-500" },
    { title: "Cancelled", value: summary.cancelled, icon: <BadgeCheck size={34} />, color: "bg-red-500" },
  ];

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading orders...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">Manage Orders</h1>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl text-white shadow-xl flex items-center justify-between transition-transform transform hover:scale-105 ${card.color}`}
          >
            <div>
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="text-3xl mt-2 font-bold">{card.value}</p>
            </div>
            <div className="opacity-80">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow p-6">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b font-semibold text-left text-gray-700">
              <th className="py-2">Order ID</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Items</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const customer = usersMap[order.user] || { name: "Unknown", phone: "N/A" };
                return (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">#{order.trackingId || order._id}</td>
                    <td className="py-3">
                      <strong>{customer.name}</strong>
                      <br />
                      <span className="text-sm text-gray-600">{customer.phone}</span>
                    </td>
                    <td className="py-3">{order.orderItems?.length || 0} items</td>
                    <td className="py-3 font-bold">₹{order.totalPrice}</td>
                    <td className="py-3 text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</td>
                    <td className="py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border p-2 rounded-lg"
                        disabled={updatingOrderId === order._id}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
