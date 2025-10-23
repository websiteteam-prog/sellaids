import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../stores/useCartStore';
import { useUserStore } from '../../stores/useUserStore';
import useWishlistStore from '../../stores/useWishlistStore';
import axios from 'axios';

export default function Cart() {
  const { cart, fetchCart, removeFromCart } = useCartStore();
  const { user, isAuthenticated, isUserLoading } = useUserStore();
  const { addToWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressFields, setAddressFields] = useState({ address_line: '', city: '', pincode: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoading) return;
    if (!isAuthenticated || !user?.id) {
      console.log('Redirecting to UserLogin due to auth failure');
      navigate('/UserLogin', { state: { from: window.location.pathname } });
    } else {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/user/profile/list`, { withCredentials: true })
        .then((response) => {
          const { data } = response.data;
          if (data.address_line && data.city && data.pincode) {
            setShippingAddress(`${data.address_line}, ${data.city}, ${data.pincode}`);
            setAddressFields({
              address_line: data.address_line,
              city: data.city,
              pincode: data.pincode,
            });
          }
        })
        .catch((err) => console.error('Failed to fetch user profile:', err))
        .finally(() => {
          fetchCart()
            .then(() => console.log('Cart fetched', cart))
            .catch((err) => console.error('FetchCart error', err))
            .finally(() => setLoading(false));
        });
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
      await fetchCart();
      alert('Quantity updated successfully!');
    } catch (err) {
      console.error('Failed to update quantity:', err);
      alert(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleMoveToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/wishlist`,
        { product_id: productId },
        { withCredentials: true }
      );
      await addToWishlist(productId);
      await removeFromCart(productId);
      alert(response.data.action === "added" ? 'Added to wishlist!' : 'Already in wishlist!');
      navigate('/user/cart');
    } catch (err) {
      console.error('Failed to move to wishlist:', err);
      alert(err.response?.data?.message || 'Failed to move to wishlist');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      alert('Item removed from cart!');
      navigate('/user/cart');
    } catch (err) {
      console.error('Failed to remove item:', err);
      alert('Failed to remove item from cart');
    }
  };

  const handleContinue = async () => {
    if (!shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment/create-order`,
        { cartItems: cart, shippingAddress },
        { withCredentials: true }
      );
      navigate('/user/user-payments', { state: { orderData: response.data.data } });
    } catch (err) {
      console.error('Failed to create order:', err);
      alert(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const handleEditAddress = () => {
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    try {
      const { address_line, city, pincode } = addressFields;
      const newAddress = `${address_line}, ${city}, ${pincode}`;
      setShippingAddress(newAddress);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/profile/edit`,
        { address_line, city, pincode },
        { withCredentials: true }
      );
      setIsEditingAddress(false);
      alert('Address updated successfully!');
    } catch (err) {
      console.error('Failed to update address:', err);
      alert(err.response?.data?.message || 'Failed to update address');
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/150x150'; // Fallback image
  };

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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-200"
              >
                <div className="mb-4 text-center sm:text-left w-full">
                  <img
                    src={item.product?.image || 'https://placehold.co/150x150'}
                    alt={item.product?.name || 'Product Image'}
                    className="w-32 h-32 object-cover rounded-md mx-auto sm:mx-0 mb-2"
                    onError={handleImageError}
                  />
                  <p className="font-semibold text-lg text-gray-900">
                    {item.product?.name || 'Unknown Product'}
                  </p>
                  <p className="text-gray-700">₹{item.product?.price || 'N/A'}</p>
                  <div className="flex items-center mt-2 justify-center">
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
                <div className="w-full mt-4 flex justify-between">
                  <button
                    onClick={() => handleRemove(item.product_id)}
                    className="flex items-center justify-center bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 transition-colors w-1/2 mr-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove
                  </button>
                  <button
                    onClick={() => handleMoveToWishlist(item.product_id)}
                    className="flex items-center justify-center bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-1/2 ml-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Move to Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Shipping Address</label>
              {isEditingAddress ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <input
                      type="text"
                      name="address_line"
                      value={addressFields.address_line}
                      onChange={handleAddressChange}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Address Line"
                      required
                    />
                    <input
                      type="text"
                      name="city"
                      value={addressFields.city}
                      onChange={handleAddressChange}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="City"
                      required
                    />
                    <input
                      type="text"
                      name="pincode"
                      value={addressFields.pincode}
                      onChange={handleAddressChange}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Pincode"
                      required
                    />
                  </div>
                  <button
                    onClick={handleSaveAddress}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save Address
                  </button>
                </>
              ) : (
                <>
                  <p className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700">
                    {shippingAddress || 'No address provided'}
                  </p>
                  <button
                    onClick={handleEditAddress}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit Address
                  </button>
                </>
              )}
            </div>
            <div className="text-right">
              <button
                onClick={handleContinue}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Continue
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}