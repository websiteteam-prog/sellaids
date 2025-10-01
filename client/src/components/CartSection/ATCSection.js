// src/components/CartSection/ATCSection.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ATCSection = () => {
  const navigate = useNavigate();

  // Dummy cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Women's Legacy Oxford Sneaker",
      price: 54.99,
      image: "https://via.placeholder.com/100",
      color: "WHITE/GOLD/GUM",
      size: "6.0",
      quantity: 1,
    },
    {
      id: 2,
      name: "Women's Grotto II Boot",
      price: 84.99,
      image: "https://via.placeholder.com/100",
      color: "PURPLE/WHITE",
      size: "6.0",
      quantity: 1,
    },
  ]);

  // Update quantity
  const updateQuantity = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "inc"
                  ? item.quantity + 1
                  : item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Subtotal per item
  const itemSubtotal = (item) => (item.price * item.quantity).toFixed(2);

  // Grand total
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10 md:mt-20">
      {cartItems.length > 0 ? (
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Product col */}
                  <td className="px-4 py-4 flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Color: {item.color}
                      </p>
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-xs hover:underline mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    ${item.price.toFixed(2)}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-4">
                    <div className="flex items-center border rounded w-fit">
                      <button
                        onClick={() => updateQuantity(item.id, "dec")}
                        className="px-2 py-1"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, "inc")}
                        className="px-2 py-1"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* Subtotal */}
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    ${itemSubtotal(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Coupon + Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-6 border-t">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-1/2">
              <input
                type="text"
                placeholder="Coupon code"
                className="border rounded px-3 py-2 w-full text-sm focus:outline-none"
              />
              <button className="bg-gray-900 text-white px-5 py-2 rounded text-sm font-medium hover:bg-gray-700">
                APPLY
              </button>
            </div>

            <div className="flex gap-2 w-full md:w-auto justify-end">
              <button className="bg-orange-500 text-white px-5 py-2 rounded font-medium hover:bg-orange-600">
                UPDATE CART
              </button>
              <Link
                to="/"
                className="border px-5 py-2 rounded font-medium text-gray-700 hover:bg-gray-100"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end px-4 py-4 border-t">
            <div className="text-right">
              <p className="font-semibold text-lg">
                Total: ${total.toFixed(2)}
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Empty cart
        <div className="flex flex-col items-center justify-center text-center px-6 py-12 bg-white rounded-lg shadow">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="w-28 h-28 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Your Cart is Empty
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            Looks like you haven’t added anything yet.
          </p>
          <Link
            to="/"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default ATCSection;
