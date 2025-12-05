import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const ProfileSection = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);

  const token = Cookies.get("token");
  const userCookie = Cookies.get("user");
  const loggedUser = userCookie ? JSON.parse(userCookie) : null;
  const loggedUserId = loggedUser?._id || loggedUser?.id;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PROFILE_URL  = `${BASE_URL}/auth/profile`;
const ORDERS_URL   = `${BASE_URL}/orders`;
const CONTACTS_URL = `${BASE_URL}/contacts`;


  // Fetch profile
  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(PROFILE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setAvatar(data.data.avatar || null);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch orders and messages
  const fetchData = async () => {
    if (!token) return;
    try {
      const ordersRes = await fetch(ORDERS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();
      const userOrders = (ordersData.data || []).filter(
        (o) => o.user === loggedUserId || o.userId === loggedUserId || o.createdBy === loggedUserId
      );
      setOrders(userOrders);

      const messagesRes = await fetch(CONTACTS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const messagesData = await messagesRes.json();
      setMessages(messagesData.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchData();
  }, [token]);

  // Avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:5000/api/auth/profile/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAvatar(data.data.avatar);
        alert("Avatar uploaded successfully");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    try {
      const res = await fetch(PROFILE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setIsEditing(false);
        alert("Profile updated successfully");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAccount = () => alert("Delete Account Clicked");
  const logout = () => onLogout();

  const total = orders.length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const pending = total - delivered;

  return (
    <div className="min-h-screen bg-black flex justify-center py-6 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatar || "https://www.w3schools.com/howto/img_avatar.png"}
                className="w-28 h-28 rounded-xl border shadow-lg object-cover"
              />
              <label className="absolute -bottom-2 right-1 bg-green-700 text-white px-3 py-1 text-xs rounded-md cursor-pointer shadow">
                Change
                <input type="file" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.name || "User"}</h1>
              <p className="text-gray-500 mt-1">{profile.email || "No email saved"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800"
              >
                Edit Details
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-300 text-black rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* Dashboard Buttons */}
        <div className="flex gap-3">
          <button
            onClick={deleteAccount}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Delete Account
          </button>
          <button
            onClick={logout}
            className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-900"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          {["profile", "stats", "messages"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === tab
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-black hover:bg-green-100 hover:text-green-700"
              }`}
            >
              {tab === "profile" && "Profile"}
              {tab === "stats" && "Orders & Stats"}
              {tab === "messages" && "Messages"}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["name", "email", "phone", "address", "city", "state"].map((f) => (
              <div key={f} className="bg-gray-50 p-4 rounded-xl border shadow-sm">
                <label className="text-gray-600 text-sm font-medium">{f}</label>
                <input
                  type="text"
                  name={f}
                  disabled={!isEditing}
                  value={profile[f]}
                  onChange={handleChange}
                  className="mt-2 w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-600"
                />
              </div>
            ))}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-green-50 p-6 rounded-xl shadow flex flex-col items-center">
              <p className="text-gray-500">Total Orders</p>
              <h2 className="text-3xl font-bold text-green-700">{total}</h2>
            </div>
            <div className="bg-green-50 p-6 rounded-xl shadow flex flex-col items-center">
              <p className="text-gray-500">Delivered</p>
              <h2 className="text-3xl font-bold text-green-700">{delivered}</h2>
            </div>
            <div className="bg-green-50 p-6 rounded-xl shadow flex flex-col items-center">
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-bold text-orange-500">{pending}</h2>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
            {messages.filter(msg => msg.email === profile.email).length === 0 ? (
              <p className="text-gray-400 text-center">No messages yet</p>
            ) : (
              messages
                .filter(msg => msg.email === profile.email) // Only show messages of logged-in user
                .map((msg) => (
                  <div
                    key={msg._id}
                    className="bg-green-50 border border-green-200 p-4 rounded-xl shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-green-900 font-semibold">{msg.name}</p>
                      {msg.replied && (
                        <span className="px-3 py-1 text-xs bg-green-700 text-white rounded-md">
                          Replied
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">{msg.email}</p>
                    <p className="mt-2 text-gray-800">{msg.message}</p>
                    {msg.replyText && (
                      <div className="mt-3 bg-white border-l-4 border-green-600 p-3 rounded">
                        <p className="text-sm text-green-800 font-semibold">Admin Reply:</p>
                        <p className="text-gray-800">{msg.replyText}</p>
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
