import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../stores/useCartStore';
import { useUserStore } from '../../stores/useUserStore';
import axios from 'axios';

export default function Cart() {
  const { cart, fetchCart, removeFromCart } = useCartStore();
  const { user, isAuthenticated, isUserLoading } = useUserStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect triggered', { isUserLoading, isAuthenticated, user });
    if (isUserLoading) return;
    if (!isAuthenticated || !user?.id) {
      console.log('Redirecting to UserLogin due to auth failure');
      navigate('/UserLogin', { state: { from: window.location.pathname } });
    } else {
      setLoading(true);
      fetchCart()
        .then(() => console.log('Cart fetched', cart))
        .catch((err) => console.error('FetchCart error', err))
        .finally(() => setLoading(false));
    }
  }, [user, isAuthenticated, isUserLoading, navigate, fetchCart]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/cart/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      await fetchCart(); // Fetch updated cart after quantity update
      alert('Quantity updated successfully!');
    } catch (err) {
      console.error('Failed to update quantity:', err);
      alert(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  console.log('Rendering Cart', { cart, user, isAuthenticated, loading });

  if (isUserLoading) return <p className="text-center mt-10">Loading user...</p>;
  if (loading) return <p className="text-center mt-10">Loading cart...</p>;
  if (!isAuthenticated || !user?.id) return <p className="text-center mt-10">Please log in to view your cart.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">My Cart</h1>
      {cart.length === 0 ? (
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
          <p className="text-xl font-semibold">Your cart is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((item) => (
            <div
              key={item.product_id}
              className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center sm:flex-row sm:items-start justify-between hover:shadow-xl transition-shadow duration-200"
            >
              <div className="mb-4 sm:mb-0 sm:mr-4 text-center sm:text-left">
                <p className="font-semibold text-lg text-gray-900">
                  {item.product?.name || 'Unknown Product'}
                </p>
                <p className="text-gray-700">₹{item.product?.price || 'N/A'}</p>
                <div className="flex items-center mt-2">
                  <p className="text-gray-600 mr-2">Quantity:</p>
                  <button
                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-gray-100">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    transition: 'background-color 0.2s',
                    width: '100%',
                    maxWidth: '10rem',
                  }}
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