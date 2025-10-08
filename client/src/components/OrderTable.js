import React, { useEffect, useState } from "react";
import axios from "axios";
import useWishlistStore from "../stores/useWishlistStore";

const OrderTable = () => {
  const user = useWishlistStore(state => state.user); // Zustand user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/orders/${user.id}`);
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <p className="p-4">Loading orders...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (orders.length === 0) return <p className="p-4">No orders found.</p>;

  return (
    <table className="min-w-full text-sm text-left border border-gray-200">
      <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
        <tr>
          <th className="px-4 py-2 border">orderId</th>
          <th className="px-4 py-2 border">productName</th>
          <th className="px-4 py-2 border">price</th>
          <th className="px-4 py-2 border">quantity</th>
          <th className="px-4 py-2 border">status</th>
          <th className="px-4 py-2 border">date</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map(order => (
          <tr key={order?.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 border">{order?.id}</td>
            <td className="px-4 py-2 border">{order?.product_name}</td>
            <td className="px-4 py-2 border">₹{order?.price}</td>
            <td className="px-4 py-2 border">{order?.quantity}</td>
            <td className="px-4 py-2 border font-semibold text-blue-600">{order?.status}</td>
            <td className="px-4 py-2 border">{new Date(order?.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
