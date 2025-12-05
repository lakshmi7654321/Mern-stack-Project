import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Users, UserPlus, ListChecks } from "lucide-react";
import AddPeopleForm from "./AddPeopleForm";

const CHEF_API = "http://localhost:5000/api/chefs";
const PARTNER_API = "http://localhost:5000/api/partners";

const AdminPeople = () => {
  const [chefs, setChefs] = useState([]);
  const [partners, setPartners] = useState([]);
  const [type, setType] = useState("chef"); // chef | partner
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // ----------------------------
  // LOAD CHEFS
  // ----------------------------
  const loadChefs = async () => {
    try {
      const res = await fetch(CHEF_API);
      const data = await res.json();

      // Accepts backend formats: array | { chefs: [...] } | { data: [...] }
      const chefsArray = Array.isArray(data)
        ? data
        : data.chefs || data.data || [];

      setChefs(chefsArray);
    } catch (err) {
      console.error("Error loading chefs:", err);
    }
  };

  // ----------------------------
  // LOAD PARTNERS
  // ----------------------------
  const loadPartners = async () => {
    try {
      const res = await fetch(PARTNER_API);
      const data = await res.json();

      const partnersArray = Array.isArray(data)
        ? data
        : data.partners || data.data || [];

      setPartners(partnersArray);
    } catch (err) {
      console.error("Error loading partners:", err);
    }
  };

  useEffect(() => {
    loadChefs();
    loadPartners();
  }, []);

  // ----------------------------
  // SAVE (ADD + UPDATE)
  // ----------------------------
  const handleSave = async (item, type) => {
    const isEdit = Boolean(item._id);

    const url = isEdit
      ? `${type === "chef" ? CHEF_API : PARTNER_API}/${item._id}`
      : `${type === "chef" ? CHEF_API : PARTNER_API}`;

    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    loadChefs();
    loadPartners();
    setShowForm(false);
    setEditingItem(null);
  };

  // ----------------------------
  // DELETE
  // ----------------------------
  const deleteItem = async (id, type) => {
    if (!window.confirm("Delete this item?")) return;

    const url = `${type === "chef" ? CHEF_API : PARTNER_API}/${id}`;

    await fetch(url, { method: "DELETE" });

    loadChefs();
    loadPartners();
  };

  // Ensure list is always array
  const list = Array.isArray(type === "chef" ? chefs : partners)
    ? type === "chef"
      ? chefs
      : partners
    : [];

  const cards = [
    {
      title: "Total Chefs",
      value: chefs.length || 0,
      icon: <Users size={34} />,
      color: "bg-blue-600",
    },
    {
      title: "Total Partners",
      value: partners.length || 0,
      icon: <UserPlus size={34} />,
      color: "bg-green-600",
    },
    {
      title: "Total People",
      value: (chefs.length || 0) + (partners.length || 0),
      icon: <ListChecks size={34} />,
      color: "bg-purple-700",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Manage People</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl text-white shadow-xl flex items-center justify-between transition-transform hover:scale-105 ${card.color}`}
          >
            <div>
              <h2 className="text-xl">{card.title}</h2>
              <p className="text-3xl mt-2 font-bold">{card.value}</p>
            </div>
            <div>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Switch Chef / Partner */}
      <div className="flex justify-between items-center">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="chef">Chef</option>
          <option value="partner">Partner</option>
        </select>

        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          ➕ Add {type === "chef" ? "Chef" : "Partner"}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <AddPeopleForm
          item={editingItem}
          type={type}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">
                {type === "chef" ? "Description" : "Role"}
              </th>
              {type === "partner" && (
                <th className="p-4 text-left">Description</th>
              )}
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  No items found
                </td>
              </tr>
            ) : (
              list.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-4">{p.name}</td>

                  <td className="p-4">
                    {type === "chef" ? p.description : p.role}
                  </td>

                  {type === "partner" && (
                    <td className="p-4">{p.description}</td>
                  )}

                  <td className="p-4">
                    <img
                      src={p.image}
                      alt="img"
                      className="h-16 w-16 rounded object-cover"
                    />
                  </td>

                  <td className="p-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditingItem(p);
                        setShowForm(true);
                      }}
                      className="px-3 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </button>

                    <button
                      onClick={() => deleteItem(p._id, type)}
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

export default AdminPeople;
