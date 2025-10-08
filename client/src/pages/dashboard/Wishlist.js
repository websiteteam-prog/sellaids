import React, { useEffect, useState } from "react";
import useWishlistStore from "../../stores/useWishlistStore";
import axios from "axios";

export default function Wishlist() {
  const { user, wishlist, setWishlist, removeFromWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/user/${user.id}/wishlist`)
        .then((res) => setWishlist(res.data))
        .catch((err) => console.error("Failed to fetch wishlist:", err))
        .finally(() => setLoading(false));
    }
  }, [user, setWishlist]);

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${user.id}/wishlist/${itemId}`);
      removeFromWishlist(itemId); // update frontend state
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Failed to remove item");
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      await axios.post(`http://localhost:5000/api/user/${user.id}/cart`, { productId: itemId });
      alert("Item added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add item to cart");
    }
  };

  if (loading) return <p>Loading wishlist...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-2 text-red-500"
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
          <p className="text-lg font-medium">No products added to your wishlist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(item.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
