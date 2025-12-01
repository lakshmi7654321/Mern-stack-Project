import React, { useEffect, useState } from "react";

const MenuAddForm = ({ item = null, onCancel, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
    ingredients: "",
    features: "",
    keyword: "common",
  });

  useEffect(() => {
    if (item) {
      // Remove rating if it exists in item
      const { rating, ...rest } = item;
      setForm(rest);
    } else {
      setForm({
        name: "",
        category: "",
        price: "",
        image: "",
        description: "",
        ingredients: "",
        features: "",
        keyword: "common",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) {
      alert("Name and Category are required.");
      return;
    }
    onSave(item ? { ...form, _id: item._id } : { ...form });
  };

  return (
    <form onSubmit={submit} className="bg-white p-5 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-semibold">
        {item ? "Edit Menu Item" : "Add Menu Item"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border px-3 py-2 rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option>North Indian</option>
          <option>South Indian</option>
          <option>Dessert</option>
          <option>Fast Foods</option>
          <option>Ice Cream</option>
          <option>Veg</option>
          <option>Non Veg</option>
        </select>

        <select
          name="keyword"
          value={form.keyword}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="popular">Popular</option>
          <option value="special">Special</option>
          <option value="regular">Regular</option>
          <option value="common">Common</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          name="ingredients"
          type="text"
          value={form.ingredients}
          onChange={handleChange}
          className="border p-2 w-full rounded-lg"
          placeholder="Ingredients"
          required
        />

        <input
          name="features"
          type="text"
          value={form.features}
          onChange={handleChange}
          className="border p-2 w-full rounded-lg"
          placeholder="Features"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border px-3 py-2 rounded"
          required
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="border px-3 py-2 rounded"
        />
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={3}
        placeholder="Short description"
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white"
        >
          {item ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </form>
  );
};

export default MenuAddForm;
