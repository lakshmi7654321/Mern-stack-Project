import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const ORDER_API_URL = "http://localhost:5000/api/orders";
const REVIEW_API_URL = "http://localhost:5000/api/reviews";

const OrderConfirm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [order, setOrder] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    if (!token) return navigate("/login");

    try {
      setLoading(true);
      const res = await fetch(`${ORDER_API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) return navigate("/login");
      if (res.status === 403) throw new Error("Forbidden: Access denied");
      if (!res.ok) throw new Error("Failed to fetch order");

      const data = await res.json();
      if (!data?.data) throw new Error("Order not found");
      setOrder(data.data);

      // Fetch reviews only if delivered
      if (data.data.status === "Delivered") {
        const reviewRes = await fetch(`${REVIEW_API_URL}/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reviewData = await reviewRes.json();
        setReviews(reviewData.data || []);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [orderId]);

  const getStatusBadge = (status) => {
    const colors = {
      Pending: "bg-yellow-500",
      Confirmed: "bg-blue-500",
      Preparing: "bg-purple-500",
      "Out for Delivery": "bg-orange-500",
      Delivered: "bg-green-500",
      Cancelled: "bg-red-500",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-white text-lg ${colors[status] || "bg-gray-400"}`}>
        {status}
      </span>
    );
  };

  const getItemReview = (menuItemId) =>
    reviews.find((r) => r.menuItemId?.toString() === menuItemId?.toString());

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!order) return <p className="text-center mt-20">Order not found</p>;

  return (
    <section className="min-h-screen bg-green-50 p-6 flex justify-center">
      <div className="bg-white p-8 rounded-3xl max-w-4xl w-full shadow-lg">
        <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          {getStatusBadge(order.status)}
        </h2>

        {/* Order Details */}
        <div className="border p-6 rounded-2xl shadow-inner bg-gray-50 mb-6">
          <h3 className="text-xl font-semibold mb-2">
            Order #{order.trackingId || order._id}
          </h3>
          <p className="text-gray-700 mt-1"><strong>Total:</strong> ₹{order.totalPrice}</p>
          <p className="text-gray-700 mt-1"><strong>Address:</strong> {order.address}</p>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Items Ordered:</h4>
            <div className="space-y-3">
              {order.orderItems?.map((item, idx) => {
                const review = getItemReview(item.menuItemId);
                return (
                  <div key={idx} className="flex flex-col sm:flex-row items-center justify-between border p-3 rounded-xl bg-white">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-gray-500">{item.quantity} × ₹{item.price}</p>
                        {order.status === "Delivered" && review && (
                          <p className="text-yellow-600 mt-1 text-sm">
                            ⭐ {review.rating} - {review.feedback || "No feedback"}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold mt-2 sm:mt-0">₹{item.quantity * item.price}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-black"
          >
            View My Orders
          </button>
          {order.status === "Delivered" && reviews.length === 0 && (
            <button
              onClick={() => navigate(`/itemratings/${orderId}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Rate Your Order
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default OrderConfirm;
