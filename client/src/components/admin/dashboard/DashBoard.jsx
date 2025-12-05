import React, { useEffect, useState } from "react";
import {
  Utensils,
  ShoppingCart,
  Mail,
  Star,
  ListCheck,
  UsersIcon,
} from "lucide-react";
import Cookies from "js-cookie";

const MENU_API = "http://localhost:5000/api/menu";
const ORDERS_API = "http://localhost:5000/api/orders";
const CONTACTS_API = "http://localhost:5000/api/contacts";
const USERS_API = "http://localhost:5000/api/auth/users";
const CHEF_API = "http://localhost:5000/api/chefs";
const PARTNER_API = "http://localhost:5000/api/partners";
const REVIEWS_API = "http://localhost:5000/api/reviews";

const Dashboard = () => {
  const [menuCount, setMenuCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [foodCategories, setFoodCategories] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [messagesData, setMessagesData] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [chefsCount, setChefsCount] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);

  const token = Cookies.get("token");

  const getPercentage = (count, total) => (total ? Math.round((count / total) * 100) : 0);

  // ---------------- Fetch Menu & Categories ----------------
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(MENU_API);
        const data = await res.json();
        const menuItems = data.data || [];
        setMenuCount(menuItems.length);

        // Compute categories
        const categoryMap = {};
        menuItems.forEach((item) => {
          const cat = item.category || "Unknown";
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
        const categories = Object.entries(categoryMap).map(([category, count]) => ({
          category,
          count,
        }));
        setCategoryCount(categories.length);
        setFoodCategories(categories);

        // Compute average rating
        let totalRating = 0;
        let ratedItems = 0;
        for (let item of menuItems) {
          const reviewRes = await fetch(`${REVIEWS_API}/item/${item._id}`);
          const reviewData = await reviewRes.json();
          const reviews = reviewData.data || [];
          if (reviews.length) {
            const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            totalRating += avg;
            ratedItems++;
          }
        }
        setAvgRating(ratedItems ? (totalRating / ratedItems).toFixed(1) : 0);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };

    fetchMenu();
  }, []);

  // ---------------- Fetch Orders ----------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(ORDERS_API, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const data = await res.json();
        setOrdersData(data.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [token]);

  // ---------------- Fetch Messages ----------------
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(CONTACTS_API);
        const data = await res.json();
        setMessagesData(data.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, []);

  // ---------------- Fetch Users ----------------
  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    // Users
    fetch(USERS_API, { headers })
      .then((res) => res.json())
      .then((data) => setUsersCount((data.data || []).length))
      .catch(console.error);

    // Chefs and Partners (robust from AdminPeople)
    const fetchChefsAndPartners = async () => {
      try {
        // CHEFS
        const chefRes = await fetch(CHEF_API, { headers });
        const chefData = await chefRes.json();
        const chefsArray = Array.isArray(chefData)
          ? chefData
          : chefData.chefs || chefData.data || [];
        setChefsCount(chefsArray.length);

        // PARTNERS
        const partnerRes = await fetch(PARTNER_API, { headers });
        const partnerData = await partnerRes.json();
        const partnersArray = Array.isArray(partnerData)
          ? partnerData
          : partnerData.partners || partnerData.data || [];
        setPartnersCount(partnersArray.length);
      } catch (err) {
        console.error("Error fetching chefs or partners:", err);
      }
    };
    fetchChefsAndPartners();
  }, [token]);

  // ---------------- Orders stats ----------------
  const ordersStats = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"].map((status) => ({
    status,
    count: ordersData.filter((o) => o.status === status).length,
  }));

  // ---------------- Messages stats ----------------
  const messagesStats = ["Replied", "Unreplied"].map((label, i) => ({
    label,
    count: messagesData.filter((m) => (i === 0 ? m.replied : !m.replied)).length,
  }));

  // ---------------- Dashboard Cards ----------------
  const cards = [
    { title: "Menu Items", value: menuCount, icon: <Utensils size={34} />, color: "bg-blue-500" },
    { title: "Average Rating", value: avgRating, icon: <Star size={34} />, color: "bg-red-500" },
    { title: "Orders", value: ordersData.length, icon: <ShoppingCart size={34} />, color: "bg-pink-500" },
    { title: "Category", value: categoryCount, icon: <ListCheck size={34} />, color: "bg-orange-500" },
    { title: "Messages", value: messagesData.length, icon: <Mail size={34} />, color: "bg-yellow-500" },
    { title: "Users", value: usersCount, icon: <UsersIcon size={34} />, color: "bg-emerald-500" },
    { title: "Chefs", value: chefsCount, icon: <Star size={34} />, color: "bg-purple-500" },
    { title: "Partners", value: partnersCount, icon: <ShoppingCart size={34} />, color: "bg-blue-800" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-10">Dashboard Overview</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl text-white shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 ${card.color}`}
          >
            <div>
              <h2 className="text-lg font-medium opacity-90">{card.title}</h2>
              <p className="text-3xl mt-2 font-bold">{card.value}</p>
            </div>
            <div className="opacity-80">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Orders Status */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Orders Status</h2>
        {ordersStats.map((o, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{o.status}</span>
              <span>{o.count} / {ordersData.length}</span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-full">
              <div
                className="bg-pink-500 h-4 rounded-full"
                style={{ width: `${getPercentage(o.count, ordersData.length)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Messages Status */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Messages Status</h2>
        {messagesStats.map((m, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{m.label}</span>
              <span>{m.count} / {messagesData.length}</span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-full">
              <div
                className="bg-yellow-500 h-4 rounded-full"
                style={{ width: `${getPercentage(m.count, messagesData.length)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Food Categories Status */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Food Categories</h2>
        {foodCategories.map((f, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{f.category}</span>
              <span>{f.count} / {menuCount}</span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-full">
              <div
                className="bg-purple-500 h-4 rounded-full"
                style={{ width: `${getPercentage(f.count, menuCount)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
