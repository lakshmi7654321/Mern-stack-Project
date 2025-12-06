import React, { useEffect, useState } from "react";
import { ShoppingCart, Star } from "lucide-react";
import Cookies from "js-cookie";

const REVIEW_API = "https://mern-stack-project-1-ahdo.onrender.com/api/reviews";


const MenuCard = ({ item, onSelect, onAddToCart }) => {
  const [rating, setRating] = useState(0); // average rating from backend
  const token = Cookies.get("token");

  // ================= FETCH RATING =================
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`${REVIEW_API}/item/${item._id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        const reviews = data.data || []; // backend returns array directly
        const avg = reviews.length
          ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
          : 0;
        setRating(avg);
      } catch (err) {
        console.error("Error fetching item rating:", err);
      }
    };

    fetchRating();
  }, [item, token]);

  // ================= SUBMIT RATING =================
  const handleRate = async (newRating) => {
    if (!token) return alert("Please login to rate items.");

    try {
      // Submit rating
      await fetch(REVIEW_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menuItemId: item._id,
          rating: newRating,
        }),
      });

      // Refresh rating after submission
      const res = await fetch(`${REVIEW_API}/item/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const reviews = data.data || [];
      const avg = reviews.length
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0;
      setRating(avg);
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-2 p-6 text-center border border-gray-100">
      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-56 object-cover rounded-xl mb-4 cursor-pointer"
        onClick={onSelect}
      />

      {/* Name */}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h3>

      {/* Rating */}
      <div className="flex justify-center items-center text-yellow-400 mb-2 gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            fill={star <= Math.round(rating) ? "yellow" : "none"} // round rating for display
            stroke="currentColor"
            className="cursor-pointer"
            onClick={() => handleRate(star)}
          />
        ))}
        <span className="ml-2 text-gray-700 font-semibold">{rating.toFixed(1)}</span>
      </div>

      {/* Price + Cart */}
      <div className="flex justify-center items-center gap-4 mt-3">
        <span className="text-green-700 font-bold border border-gray-200 px-4 py-1 rounded-full bg-green-50">
          ₹{item.price}
        </span>
        <button
          onClick={() => onAddToCart(item)}
          className="bg-red-500 text-white font-semibold px-4 py-1.5 rounded-full hover:bg-green-600 transition flex items-center gap-2"
        >
          <ShoppingCart size={18} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
