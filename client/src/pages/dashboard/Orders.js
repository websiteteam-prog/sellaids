import React, { useEffect, useState } from "react";
import OrderTable from "../../components/OrderTable";
import useWishlistStore from "../../stores/useWishlistStore";
import axios from "axios";

const Orders = () => {
  const { user } = useWishlistStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/user/${user.id}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-2 sm:mb-4">My Orders</h1>
      <p className="text-gray-600 mb-4 sm:mb-6">Here are your recent orders.</p>

      {orders.length === 0 ? (
        <div className="bg-white shadow rounded p-6 text-center text-gray-500">
          Your order list is empty.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <OrderTable orders={orders} />
        </div>
      )}
    </div>
  );
};

export default Orders;
