import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const API_URL = "http://localhost:5000/api/reviews/overall"; // Public overall reviews
const reviewsPerPage = 3;

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          console.error("Error fetching reviews:", res.statusText);
          return;
        }
        const data = await res.json();

        // Only overall reviews with feedback
        const overallReviews = (data.data || []).filter(
          (r) => !r.menuItemId && (r.feedback || r.comment)
        );

        // Map userName (if available) and feedback
        const reviewsWithName = overallReviews.map((r) => ({
          ...r,
          userName: r.userId?.name || r.name || null, // null if not available
          feedback: r.feedback || r.comment, // must exist due to filter
        }));

        setReviews(reviewsWithName);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(reviews.length - reviewsPerPage, 0) : prev - reviewsPerPage
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + reviewsPerPage >= reviews.length ? 0 : prev + reviewsPerPage
    );
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + reviewsPerPage);

  return (
    <section id="reviews" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-14">
          What Our Customers Say
        </h2>

        <div className="flex items-center justify-center relative">
          <button
            onClick={handlePrev}
            className="hidden md:flex items-center justify-center bg-green-600 text-white hover:bg-green-700 rounded-full w-14 h-14 shadow-lg transition absolute -left-20 z-10"
          >
            <ChevronLeft size={30} />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
            {visibleReviews.length > 0 ? (
              visibleReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white border border-gray-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1"
                >
                  {/* Feedback */}
                  <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                    “{review.feedback}”
                  </p>

                  {/* User name (if available) */}
                  {review.userName && (
                    <h4 className="font-semibold text-gray-900 text-xl mb-2">
                      {review.userName}
                    </h4>
                  )}

                  {/* Always show stars */}
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={
                          star <= (review.rating || 0)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No reviews yet.
              </p>
            )}
          </div>

          <button
            onClick={handleNext}
            className="hidden md:flex items-center justify-center bg-green-600 text-white hover:bg-green-700 rounded-full w-14 h-14 shadow-lg transition absolute -right-20 z-10"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Review;
