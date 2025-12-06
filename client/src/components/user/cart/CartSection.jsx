import React, { useEffect, useState } from "react";

const CartSection = () => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      const res = await fetch( "https://mern-stack-project-1-ahdo.onrender.com/api/cart");
      const data = await res.json();

      if (res.ok) {
        setCartItems(data.data || []);
      }
    } catch (error) {
      console.log("Error loading cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity for a specific item
  const handleQuantityChange = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Aggregate duplicate items
  const aggregatedCartItems = cartItems.reduce((acc, item) => {
    const existingItem = acc.find(i => i._id === item._id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  // Calculate total amount
  const totalAmount = aggregatedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <section className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {aggregatedCartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {aggregatedCartItems.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">Price: ₹{item.price}</p>

                    {/* Quantity controls (now shows actual quantity) */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>

                      {/* Showing actual quantity */}
                      <span className="font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total for this item */}
                <p className="text-xl font-bold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Cart total */}
          <div className="mt-6 flex justify-end items-center gap-4">
            <h2 className="text-2xl font-semibold">Total:</h2>
            <p className="text-2xl font-bold text-green-700">₹{totalAmount}</p>
          </div>
        </>
      )}
    </section>
  );
};

export default CartSection;
