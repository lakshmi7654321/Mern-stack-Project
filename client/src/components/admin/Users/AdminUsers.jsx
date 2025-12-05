import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = Cookies.get("token"); // JWT token from login

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    if (!token) {
      setError("You are not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= TOGGLE USER STATUS =================
  const toggleStatus = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/users/${id}/status`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      fetchUsers(); // refresh list
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      fetchUsers(); // refresh list
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ================= DASHBOARD CARDS =================
  const cards = [
    { title: "Users", value: users.length, color: "bg-blue-500" },
    {
      title: "Active",
      value: users.filter((u) => u.active).length,
      color: "bg-green-500",
    },
    {
      title: "Inactive",
      value: users.filter((u) => !u.active).length,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`p-6 rounded-xl text-white shadow-lg flex justify-between items-center transition-transform transform hover:scale-105 ${c.color}`}
          >
            <div>
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p className="text-3xl mt-2 font-bold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl shadow p-6">
        {loading ? (
          <p className="text-center text-gray-600 py-6">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-6">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No users found.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b font-semibold text-left">
                <th className="py-2">User ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3">#{user._id}</td>
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    {user.active ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                  </td>
                  <td className="py-3 text-center space-x-3">
                    <button
                      onClick={() => toggleStatus(user._id)}
                      className={`px-3 py-1 rounded text-white ${
                        user.active ? "bg-yellow-500" : "bg-green-600"
                      }`}
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
