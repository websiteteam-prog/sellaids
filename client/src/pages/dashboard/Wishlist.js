import React, { useEffect, useState } from "react";
import useWishlistStore from "../../stores/useWishlistStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

export default function Wishlist() {
  const { user, wishlist, setWishlist, removeFromWishlist } = useWishlistStore();
  const { loggedInUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/UserLogin"); // Redirect to login if not logged in
    } else if (loggedInUser.id) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/user/${loggedInUser.id}/wishlist`)
        .then((res) => setWishlist(res.data))
        .catch((err) => console.error("Failed to fetch wishlist:", err))
        .finally(() => setLoading(false));
    }
  }, [loggedInUser, navigate, setWishlist]);

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/${loggedInUser.id}/wishlist/${itemId}`);
      removeFromWishlist(itemId);
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Failed to remove item");
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/user/${loggedInUser.id}/cart`, { productId: itemId });
      alert("Item added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add item to cart");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading wishlist...</p>;

  if (!loggedInUser) return null; // Avoid rendering if not logged in (handled by redirect)

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p className="text-xl font-semibold">No products added to your wishlist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center hover:shadow-xl transition-shadow duration-200">
              <div className="mb-3 sm:mb-0">
                <p className="font-semibold text-lg text-gray-900">{item.name}</p>
                <p className="text-gray-700">₹{item.price}</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => handleAddToCart(item.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}