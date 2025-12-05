import React, { useEffect, useMemo, useState } from "react";
import { Trash2, Edit2, Utensils, Star, ListChecks } from "lucide-react";
import MenuAddForm from "./AddMenuForm";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL;  // backend URL comes from .env

const API_URL = `${BASE_URL}/api/menu`;
const REVIEWS_API = `${BASE_URL}/api/reviews`;


const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const token = Cookies.get("token");

  // Load Menu Items
  const loadItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMenuItems(data.data || []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  };

  // Load Reviews
  const loadReviews = async () => {
    try {
      const res = await fetch(REVIEWS_API, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setReviews(data.data || []);
    } catch (err) {
      console.error("REVIEWS ERROR:", err);
    }
  };

  useEffect(() => {
    loadItems();
    loadReviews();
  }, []);

  // Add / Update Menu Item
  const handleAddOrUpdate = async (item) => {
    const url = item._id ? `${API_URL}/${item._id}` : API_URL;
    const method = item._id ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    loadItems();
    setShowForm(false);
    setEditingItem(null);
  };

  // Delete Menu Item
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadItems();
  };

  // Categories
  const categories = useMemo(
    () => ["All", ...new Set(menuItems.map((m) => m.category))],
    [menuItems]
  );

  const filtered =
    filterCategory === "All"
      ? menuItems
      : menuItems.filter((m) => m.category === filterCategory);

  // Compute average rating per menu item (ONLY overallRating)
  const menuRatingsMap = useMemo(() => {
    const map = {};

    reviews.forEach((r) => {
      const menuId = r.menuId?._id || r.menuId;
      if (!menuId) return;

      if (!map[menuId]) map[menuId] = [];
      map[menuId].push(Number(r.overallRating || 0));
    });

    const avgMap = {};
    Object.entries(map).forEach(([id, arr]) => {
      avgMap[id] = arr.reduce((s, v) => s + v, 0) / (arr.length || 1);
    });

    return avgMap;
  }, [reviews]);

  // Total Items & Avg Rating (ONLY overallRating)
  const totalItems = menuItems.length;

  const avgRating =
    totalItems && reviews.length
      ? (
          reviews.reduce((s, r) => s + Number(r.overallRating || 0), 0) /
          reviews.length
        ).toFixed(2)
      : "0.00";

  const categoryCount = categories.length - 1;

  const cards = [
    {
      title: "Menu Items",
      value: totalItems,
      icon: <Utensils size={34} />,
      color: "bg-blue-500",
    },
    // {
    //   title: "Average Rating",
    //   value: avgRating,
    //   icon: <Star size={34} />,
    //   color: "bg-yellow-500",
    // },
    {
      title: "Categories",
      value: categoryCount,
      icon: <ListChecks size={34} />,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Manage Menu</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
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

      {/* Filter & Add */}
      <div className="flex justify-between items-center">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          ➕ Add Menu
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <MenuAddForm
          item={editingItem}
          onSave={handleAddOrUpdate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Ingredients</th>
              <th className="p-4 text-left">Features</th>
              <th className="p-4 text-left">Keyword</th>
              <th className="p-4 text-left">Price</th>
              {/* <th className="p-4 text-left">Avg Rating</th> */}
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center">
                  No items found
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m._id} className="border-b">
                  <td className="p-4">{m.name}</td>
                  <td className="p-4">{m.category}</td>
                  <td className="p-4">{m.ingredients?.join(", ")}</td>
                  <td className="p-4">{m.features?.join(", ")}</td>
                  <td className="p-4 font-semibold">{m.keyword}</td>
                  <td className="p-4">₹{m.price}</td>
                  <td className="p-4 font-bold">
                    {(menuRatingsMap[m._id] || 0).toFixed(1)} ⭐
                  </td>

                  <td className="p-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditingItem(m);
                        setShowForm(true);
                      }}
                      className="px-3 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(m._id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMenu;
