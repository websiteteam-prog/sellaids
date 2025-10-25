import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { user, isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      navigate("/UserAuth/UserLogin");
      return;
    }
    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = `${process.env.REACT_APP_API_URL}/api/user/order/list`;
      const res = await axios.get(endpoint, { withCredentials: true });
      setOrders(res.data.data || []);
      setFilteredOrders(res.data.data || []); // Initialize filtered orders
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/UserAuth/UserLogin");
      } else {
        setError(err.response?.data?.message || "Failed to fetch orders");
        console.error("Failed to fetch orders:", err.response?.data || err.message);
        setOrders([]);
        setFilteredOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Automatic search on input change
  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.productName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [search, orders]);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-2 sm:mb-4">My Orders</h1>
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
      {loading ? (
        <div className="bg-white shadow rounded p-6 text-center text-gray-600">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white shadow rounded p-6 text-center text-gray-500">
          Your order list is empty or no matches found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          {/* Search Bar */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Search by product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-red-500"
            />
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              disabled
            >
              Search
            </button>
          </div>

          {/* Orders Table */}
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Product Name</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{order.id}</td>
                  <td className="px-4 py-2 border">{order.productName}</td>
                  <td className="px-4 py-2 border">₹{order.price || "N/A"}</td>
                  <td className="px-4 py-2 border">{order.quantity || "1"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.order_status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.order_status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{order.order_date}</td>
                  <td className="px-4 py-2 border">
                    {order.front_photo ? (
                      <img
                        src={order.front_photo}
                        alt={order.productName}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;