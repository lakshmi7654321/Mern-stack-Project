import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CardsSection = () => {
  const navigate = useNavigate();
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu");
        const result = await res.json();

        const allItems = result.data || [];

        // FIX 1: Match keyword in lowercase
        // FIX 2: Support admin entries like "popular", "Popular", "POPULAR"
        const popular = allItems.filter(
          (item) => item.keyword?.toLowerCase() === "popular"
        );

        setPopularItems(popular);
      } catch (error) {
        console.log("Error loading menu:", error);
      }
    };

    fetchPopular();
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
          Our Popular Dishes
        </h2>

        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
          {popularItems.length === 0 ? (
            <p className="text-gray-500 col-span-3">
              No popular items available.
            </p>
          ) : (
            popularItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-2 p-6 text-center border border-gray-100"
              >
                <div className="flex justify-center mb-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-56 object-cover rounded-xl shadow-sm"
                  />
                </div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {item.name}
                </h3>

                <p className="text-gray-600 text-sm mt-2 px-2">
                  {item.description || "Delicious food at best price"}
                </p>

                <div className="flex justify-center items-center gap-6 mt-5">
                  <span className="text-green-600 font-semibold border border-green-300 px-4 py-1 rounded-full">
                    ₹{item.price}
                  </span>

                  <button
                    onClick={() => navigate("/menu")}
                    className="bg-red-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-green-700 transition duration-300"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CardsSection;
