import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SpecialMenu = () => {
  const navigate = useNavigate();
  const [specialItems, setSpecialItems] = useState([]);

  useEffect(() => {
    const fetchSpecialMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu");
        const data = await res.json();

        // ✅ FIXED: backend returns { data: [...] }
        const menuList = data.data || [];

        // Filter only items with keyword = "special"
        const filtered = menuList.filter(
          (item) => item.keyword?.toLowerCase() === "special"
        );

        setSpecialItems(filtered);
      } catch (error) {
        console.log("Error fetching special menu:", error);
      }
    };

    fetchSpecialMenu();
  }, []);

  const handleBuyNow = () => navigate("/menu");

  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          SPECIAL MENU
        </h2>
        <p className="text-black-500 max-w-2xl mx-auto">
          Some of our special food menu is given here. These are what people
          order more. If you want, you can order from here.
        </p>
      </div>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {specialItems.length === 0 ? (
          <p className="text-center text-gray-600 col-span-3">
            No special menu items available.
          </p>
        ) : (
          specialItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 p-6 text-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-cover rounded-xl mb-6"
              />

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {item.name}
              </h3>

              <div className="flex justify-center items-center text-yellow-400 mb-2">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" stroke="none" />
                ))}
                <span className="text-gray-500 text-sm ml-2">
                  ({item.rating || 0})
                </span>
              </div>

              <div className="flex justify-center items-center gap-4 mt-2">
                <span className="text-green-600 font-semibold border border-gray-300 px-3 py-1 rounded-full">
                  ₹{item.price}
                </span>

                <button
                  className="bg-red-500 text-white font-semibold px-4 py-1 rounded-full hover:bg-green-600 transition"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default SpecialMenu;
