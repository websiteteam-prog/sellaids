import React, { useEffect, useState } from 'react';
import useWishlistStore from '../../stores/useWishlistStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';

export default function Wishlist() {
  const { wishlist, setWishlist, removeFromWishlist } = useWishlistStore();
  const { user, isAuthenticated, isUserLoading } = useUserStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddToWishlist = async (productId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/wishlist`,
        { product_id: productId },
        { withCredentials: true }
      );
      alert(res.data.message || 'Item added to wishlist!');
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/user/wishlist`, { withCredentials: true })
        .then((res) => setWishlist(res.data.data || []));
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
      alert(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  useEffect(() => {
    if (isUserLoading) return;
    if (!isAuthenticated || !user?.id) {
      navigate('/UserLogin', { state: { from: window.location.pathname } });
    } else {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/user/wishlist`, {
          withCredentials: true,
        })
        .then((res) => {
          setWishlist(res.data.data || []);
        })
        .catch((err) => {
          console.error('Failed to fetch wishlist:', {
            status: err.response?.status,
            message: err.response?.data?.message || err.message,
            url: err.config?.url,
          });
          if (err.response?.status === 401) {
            navigate('/UserLogin', { state: { from: window.location.pathname } });
          } else if (err.response?.status === 404) {
            alert('Wishlist endpoint not found. Please check the API URL.');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, isAuthenticated, isUserLoading, navigate, setWishlist]);

  const handleRemove = async (itemId) => {
    try {
      // Optimistically remove the item from the local state immediately
      const updatedWishlist = wishlist.filter((item) => item.product_id !== itemId);
      setWishlist(updatedWishlist);

      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/wishlist/${itemId}`, {
        withCredentials: true,
      });
      alert(res.data.message || 'Item removed from wishlist!');
    } catch (err) {
      console.error('Failed to remove item:', err);
      // Revert to the original wishlist if the API call fails
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/user/wishlist`, { withCredentials: true })
        .then((res) => setWishlist(res.data.data || []));
      alert(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/cart`,
        { product_id: productId },
        { withCredentials: true }
      );
      alert(res.data.message || 'Item added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert(err.response?.data?.message || 'Failed to add item to cart');
    }
  };

  if (isUserLoading) return <p className="text-center mt-10">Loading user...</p>;
  if (loading) return <p className="text-center mt-10">Loading wishlist...</p>;
  if (!isAuthenticated || !user?.id) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">My Wishlist</h1>
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-xl font-semibold">No products added to your wishlist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.product_id}
              className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center sm:flex-row sm:items-start justify-between hover:shadow-xl transition-shadow duration-200"
            >
              <div className="mb-4 sm:mb-0 sm:mr-4 text-center sm:text-left">
                <p className="font-semibold text-lg text-gray-900">Product: {item.product?.name || 'Unknown Product'}</p>
                <p className="text-gray-700">₹{item.product?.price || 'N/A'}</p>
                <p className="text-gray-600">Added by: {item.user?.name || 'Unknown User'}</p>
                {item.user?.age && <p className="text-gray-600">User Age: {item.user.age}</p>}
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => handleAddToCart(item.product_id)}
                  style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', transition: 'background-color 0.2s', width: '100%', maxWidth: '10rem' }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.product_id)}
                  style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', transition: 'background-color 0.2s', width: '100%', maxWidth: '10rem' }}
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