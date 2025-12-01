import React from "react";
import { ShoppingCart, X } from "lucide-react";

const ItemPopup = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const {
    image = "",
    name = "Unnamed Item",
    description = "Delicious and freshly prepared!",
    price = 0,
    ingredients = [],
    features = [],
  } = item;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 backdrop-blur-sm overflow-y-auto flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative p-8">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-red-600 transition"
        >
          <X size={32} />
        </button>

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">

          {/* Image */}
          <div className="md:w-1/2 w-full flex justify-center">
            <img
              src={image}
              alt={name}
              className="w-full h-full max-h-[550px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Content */}
          <div className="md:w-1/2 w-full">

            <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4 text-center md:text-left">
              {name}
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6 text-lg text-center md:text-left">
              {description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              {/* Ingredients */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-3">🥘 Ingredients</h3>
                {ingredients.length > 0 ? (
                  <ul className="list-disc list-inside text-green-700 space-y-1">
                    {ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No ingredients provided</p>
                )}
              </div>

              {/* Features */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-3">⭐ Features</h3>
                {features.length > 0 ? (
                  <ul className="list-disc list-inside text-red-700 space-y-1">
                    {features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No features provided</p>
                )}
              </div>
            </div>

            {/* Price + Add to Cart */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-6">
              <span className="text-green-700 font-bold border border-gray-200 px-6 py-3 rounded-full bg-green-50 text-2xl">
                Price
                <div>₹{price}</div>
              </span>

              <button
                onClick={() => onAddToCart(item)}
                className="flex items-center gap-3 bg-red-500 text-white px-8 py-3 mt-4 sm:mt-0 rounded-full hover:bg-green-600 transition font-semibold text-lg shadow-md"
              >
                <ShoppingCart size={24} /> Add to Cart
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPopup;
