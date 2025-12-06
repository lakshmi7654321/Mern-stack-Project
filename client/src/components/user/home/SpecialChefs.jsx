import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SpecialChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_URL = "https://mern-stack-project-1-ahdo.onrender.com/api/chefs";

  const chefsPerPage = 3;

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setChefs(data);
      } catch (error) {
        console.error("Error fetching chefs:", error);
      }
    };
    fetchChefs();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(chefs.length - chefsPerPage, 0) : prev - chefsPerPage
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + chefsPerPage >= chefs.length ? 0 : prev + chefsPerPage
    );
  };

  const visibleChefs = chefs.slice(currentIndex, currentIndex + chefsPerPage);

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-14">
          Our Special Chefs
        </h2>

        <div className="flex items-center justify-center relative">

          {/* LEFT ARROW */}
          <button
            onClick={handlePrev}
            className="hidden md:flex items-center justify-center bg-green-600 text-white hover:bg-green-700 rounded-full w-14 h-14 shadow-lg transition absolute -left-40 z-10"
          >
            <ChevronLeft size={30} />
          </button>

          {/* CHEF CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full place-items-center">
            {visibleChefs.map((chef) => (
              <div
                key={chef._id}
                className="bg-white border border-gray-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl 
                           transition-transform transform hover:-translate-y-1 w-[500px]"
              >
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="w-full h-72 object-cover rounded-2xl mb-5"
                />

                <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
                  {chef.name}
                </h3>

                <p className="text-gray-700 leading-relaxed text-sm text-center px-2">
                  {chef.description}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={handleNext}
            className="hidden md:flex items-center justify-center bg-green-600 text-white 
                     hover:bg-green-700 rounded-full w-14 h-14 shadow-lg transition absolute -right-40 z-10"
          >
            <ChevronRight size={30} />
          </button>

        </div>
      </div>
    </section>
  );
};

export default SpecialChefs;
