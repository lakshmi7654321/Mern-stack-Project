import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MENU_API = `${import.meta.env.VITE_API_BASE_URL}/menu`;


const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  // Fetch menu items to extract unique categories
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await fetch(MENU_API);
        const data = await res.json();

        const items = data.data || [];

        const uniqueCats = [...new Set(items.map((item) => item.category))];
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Error loading menu categories:", err);
      }
    };

    loadMenu();
  }, []);

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={() => setShowResults(!showResults)}
        className="text-black hover:text-green-600 transition"
      >
        <Search className="w-6 h-6" />
      </button>

      {/* Dropdown */}
      {showResults && (
        <div className="absolute right-0 top-10 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-80 z-50">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Results */}
          <div className="max-h-60 overflow-y-auto mt-3">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => {
                    // IMPORTANT: encode URL parameter
                    navigate(`/menu?category=${encodeURIComponent(category)}`);
                    setShowResults(false);
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-green-100 rounded-md"
                >
                  <p className="font-medium text-gray-800">{category}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-3">
                No categories found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
