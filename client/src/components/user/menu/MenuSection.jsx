import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import MenuCard from "./MenuCard";
import ItemPopup from "./ItemPopup";

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("North Indian");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const token = Cookies.get("token"); // JWT token

  // ================= FETCH MENU =================
  const fetchMenu = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/menu");
      if (!res.ok) throw new Error("Failed to fetch menu");
      const data = await res.json();
      setAllItems(data.data || []);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  // ================= FETCH CART COUNT =================
  const fetchCartCount = async () => {
    if (!token) return; // user not logged in
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return navigate("/login"); // redirect if unauthorized
      const data = await res.json();
      if (data.success) {
        const total = data.data.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(total);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCartCount();
  }, []);

  // Handle URL query search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const itemName = params.get("item");
    if (itemName) {
      setSearchTerm(itemName);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  // Toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  // ================= ADD TO CART =================
  const handleAddToCart = async (item, goToCart = false) => {
    if (!token) return navigate("/login"); // redirect if not logged in

    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        }),
      });

      if (res.status === 401) return navigate("/login");

      const data = await res.json();
      if (!data.success) {
        showToast(`Error: ${data.message}`);
        return;
      }

      setCartCount((prev) => prev + 1);
      showToast(`${item.name} added to cart!`);

      if (goToCart) navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Something went wrong while adding to cart.");
    }
  };

  const menuCategories = [
    "North Indian",
    "South Indian",
    "Dessert",
    "Fast Foods",
    "Ice Cream",
    "Veg",
    "Non Veg",
  ];

  const filteredItems = allItems.filter(
    (item) =>
      item.category === selectedCategory &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50">
          {toastMessage}
        </div>
      )}

      {/* Sidebar */}
      <aside className="md:w-1/5 bg-white p-6 border-r border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-green-700 mb-6">🍴 Categories</h2>
        <ul className="space-y-3">
          {menuCategories.map((cat) => (
            <li
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer text-lg font-medium px-4 py-2 rounded-md transition-all ${
                selectedCategory === cat
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-green-100 hover:text-green-700"
              }`}
            >
              {cat}
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center text-gray-700 font-semibold">
          🛒 Cart Items: {cartCount}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">
            {selectedCategory} Dishes
          </h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search your favorite dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-full pl-12 pr-4 py-2 focus:ring-2 focus:ring-green-500 shadow-sm"
            />
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <MenuCard
                key={item._id}
                item={item}
                onSelect={() => setSelectedItem(item)}
                onAddToCart={() => handleAddToCart(item, true)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg mt-20">
            No items found for <strong>{searchTerm}</strong> in{" "}
            <strong>{selectedCategory}</strong>.
          </p>
        )}
      </main>

      {/* Popup */}
      {selectedItem && (
        <ItemPopup
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={() => handleAddToCart(selectedItem, true)}
        />
      )}
    </section>
  );
};

export default MenuSection;
