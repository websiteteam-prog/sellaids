import React, { useEffect, useState } from "react";
import useUserStore from "../../stores/useUserStore";
import axios from "axios";

export default function Wishlist() {
  const { user, wishlist, setWishlist, removeFromWishlist } = useUserStore();
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
        <p className="text-gray-500">Your wishlist is empty.</p>
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
