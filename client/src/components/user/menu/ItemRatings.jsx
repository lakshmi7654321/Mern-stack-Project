import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Cookies from "js-cookie";

const ORDER_API_URL = "http://localhost:5000/api/orders";
const REVIEW_API_URL = "http://localhost:5000/api/reviews";

const ItemRatings = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [order, setOrder] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ⭐ Star Rating UI
  const RatingStars = ({ value, onChange }) => {
    const steps = Array.from({ length: 5 }, (_, i) => i + 1);
    return (
      <div className="flex gap-1">
        {steps.map((num) => (
          <span key={num} className="cursor-pointer" onClick={() => onChange(num)}>
            <Star
              size={22}
              className={`${
                value >= num ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
              }`}
            />
          </span>
        ))}
      </div>
    );
  };

  // ================= FETCH ORDER & REVIEWS =================
  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) return navigate("/login");
      try {
        setLoading(true);

        const res = await fetch(`${ORDER_API_URL}/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        if (!data?.data) throw new Error("Order not found");

        const orderData = data.data;
        setOrder(orderData);

        // Fetch existing reviews if delivered
        if (orderData.status === "Delivered") {
          const reviewRes = await fetch(`${REVIEW_API_URL}/order/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const reviewData = await reviewRes.json();
          const existingReviews = reviewData.data || [];

          const ratingsState = orderData.orderItems.map((item) => {
            const existing = existingReviews.find(
              (r) => r.menuItemId?.toString() === item.menuItemId?.toString()
            );
            return {
              menuItemId: item.menuItemId,
              rating: existing?.rating || 0,
              overallRating: existing?.overallRating || 0,
              feedback: existing?.feedback || "",
            };
          });

          setRatings(ratingsState);
        }
      } catch (err) {
        console.error(err);
        alert(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, navigate]);

  const updateField = (menuItemId, field, value) => {
    setRatings((prev) =>
      prev.map((r) =>
        r.menuItemId?.toString() === menuItemId?.toString()
          ? { ...r, [field]: value }
          : r
      )
    );
  };

  const submitRatings = async () => {
    if (!token) return navigate("/login");
    try {
      setSubmitting(true);

      await Promise.all(
        ratings.map((r) =>
          fetch(`${REVIEW_API_URL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId, ...r }),
          })
        )
      );

      alert("Ratings submitted successfully!");
      navigate(`/order-confirm/${orderId}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit ratings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!order || order.status !== "Delivered")
    return (
      <p className="text-center mt-20 text-red-600">
        You can rate items only after delivery.
      </p>
    );

  return (
    <section className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white p-8 rounded-3xl max-w-3xl w-full shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Rate Your Order</h2>

        <div className="space-y-4">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="border p-4 rounded-xl bg-gray-50">
              {/* ITEM INFO */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <p className="font-semibold">{item.name}</p>
              </div>

              {/* ITEM RATING */}
              <div className="mb-3">
                <label className="font-medium">Item Rating:</label>
                <RatingStars
                  value={ratings[idx]?.rating}
                  onChange={(v) => updateField(item.menuItemId, "rating", v)}
                />
              </div>

              {/* OVERALL RATING */}
              <div className="mb-3">
                <label className="font-medium">Overall Rating:</label>
                <RatingStars
                  value={ratings[idx]?.overallRating}
                  onChange={(v) => updateField(item.menuItemId, "overallRating", v)}
                />
              </div>

              {/* FEEDBACK */}
              <div>
                <label className="font-medium">Feedback:</label>
                <textarea
                  value={ratings[idx]?.feedback}
                  onChange={(e) =>
                    updateField(item.menuItemId, "feedback", e.target.value)
                  }
                  className="border p-2 rounded w-full mt-1"
                  placeholder="Write your feedback..."
                />
              </div>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={submitRatings}
            disabled={submitting}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Ratings"}
          </button>

          <button
            onClick={() => navigate(`/order-confirm/${orderId}`)}
            className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default ItemRatings;
