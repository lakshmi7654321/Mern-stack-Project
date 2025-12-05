import React, { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import Cookies from "js-cookie";

const REVIEWS_API = "http://localhost:5000/api/reviews"; // Admin route

const AdminRatings = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token"); // JWT token

  // Fetch all reviews for admin
  const fetchReviews = async () => {
    try {
      const res = await fetch(REVIEWS_API, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      setReviews(data.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      alert("Failed to fetch reviews. Make sure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-gray-600">Loading reviews...</p>;

  const totalReviews = reviews.length;

  // Average Item Rating (only for reviews with menuItemId)
  const avgItemRating =
    totalReviews > 0
      ? (
          reviews
            .filter((r) => r.menuItemId) // item ratings only
            .reduce((acc, r) => acc + (r.rating || 0), 0) /
          (reviews.filter((r) => r.menuItemId).length || 1)
        ).toFixed(1)
      : 0;

  // Average Overall Rating (reviews without menuItemId or with overallRating)
  const avgOverallRating =
    totalReviews > 0
      ? (
          reviews
            .filter((r) => r.overallRating !== undefined) // overall rating
            .reduce((acc, r) => acc + (r.overallRating || 0), 0) /
          (reviews.filter((r) => r.overallRating !== undefined).length || 1)
        ).toFixed(1)
      : 0;

  const cards = [
    {
      title: "Total Reviews",
      value: totalReviews,
      icon: <MessageSquare size={34} />,
      color: "bg-blue-500",
    },
    {
      title: "Average Item Rating",
      value: avgItemRating,
      icon: <Star size={34} />,
      color: "bg-yellow-500",
    },
    {
      title: "Average Overall Rating",
      value: avgOverallRating,
      icon: <Star size={34} />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Manage Reviews & Ratings
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

      {/* Reviews Table */}
      <div className="bg-white p-6 shadow rounded-xl overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Item & Overall Ratings</h2>

        <table className="w-full table-auto">
          <thead>
            <tr className="border-b font-semibold text-left text-gray-700">
              <th className="py-2 px-2">Order ID</th>
              <th className="py-2 px-2">Item Rating</th>
              <th className="py-2 px-2">Overall Rating</th>
              <th className="py-2 px-2">User</th>
              <th className="py-2 px-2">Feedback</th>
            </tr>
          </thead>

          <tbody>
            {totalReviews === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((r) => {
                const orderId = r.orderId?.trackingId || r.orderId?._id || "N/A";
                const itemRating = r.menuItemId ? (r.rating || 0).toFixed(1) : "-";
                const overallRating =
                  r.overallRating !== undefined ? (r.overallRating || 0).toFixed(1) : "-";
                const userName = r.userId?.name || "Anonymous";
                const feedback = r.feedback || "-";

                return (
                  <tr key={r._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">{orderId}</td>
                    <td className="py-3 px-2 text-center">{itemRating} ⭐</td>
                    <td className="py-3 px-2 text-center">{overallRating} ⭐</td>
                    <td className="py-3 px-2">{userName}</td>
                    <td className="py-3 px-2">{feedback}</td>
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

export default AdminRatings;
