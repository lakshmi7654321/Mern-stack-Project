import React, { useEffect, useState } from "react";

const Testimonials = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/partners";

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setPartners(data);  // Backend must return array
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-semibold">
        Loading partners...
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          What Our Partners Say
        </h2>

        <div className="cursor-pointer grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {partners.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-8 text-center">
                <p className="italic text-gray-700 mb-4">
                  “{item.description || "No description available"}”
                </p>
                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                <span className="text-sm text-gray-500">{item.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
