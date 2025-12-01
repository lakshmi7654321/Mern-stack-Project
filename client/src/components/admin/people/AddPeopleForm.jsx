import React, { useState, useEffect } from "react";

const AddPeopleForm = ({ item, type, onSave, onCancel }) => {
  const initialState = {
    name: "",
    image: "",
    description: "",
    role: "",
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (item) {
      // Only pick required fields
      setForm({
        name: item.name || "",
        image: item.image || "",
        description: item.description || "",
        role: item.role || "",
        _id: item._id || undefined, // keep id for editing
      });
    } else {
      setForm(initialState);
    }
  }, [item, type]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean data before sending
    const data = { ...form };
    if (type === "chef") delete data.role;

    onSave(data, type);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">
          {item ? "Edit" : "Add"} {type === "chef" ? "Chef" : "Partner"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />

          {/* Role only for Partners */}
          {type === "partner" && (
            <input
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          )}

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border p-2 rounded w-full"
            required={type === "chef"} // description mandatory for chef
          />

          {/* Image */}
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              {item ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPeopleForm;
