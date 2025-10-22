import React, { useEffect, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const { user, isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    wishlistCount: 0,
    supportTickets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      navigate("/UserLogin");
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = `${process.env.REACT_APP_API_URL}/api/user/dashboard`;
      const res = await axios.get(endpoint, { withCredentials: true });
      const { total_orders, pending_orders, wishlist_items, support_tickets } = res.data.data;
      setDashboardData({
        totalOrders: total_orders || 0,
        pendingOrders: pending_orders || 0,
        wishlistCount: wishlist_items || 0,
        supportTickets: support_tickets || 0,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/UserLogin");
      } else {
        setError(err.response?.data?.message || "Failed to fetch dashboard data");
        console.error("Error fetching dashboard data:", err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cards array for easy mapping
  const cards = [
    { title: "Total Orders", value: dashboardData.totalOrders },
    { title: "Pending Orders", value: dashboardData.pendingOrders }, // Fixed typo
    { title: "Wishlist Items", value: dashboardData.wishlistCount },
    { title: "Support Tickets", value: dashboardData.supportTickets },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
      <p className="text-gray-700 mb-6">Welcome, {user?.name || "User"}! Manage your account here.</p>
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow flex flex-col justify-between items-center"
            >
              <h3 className="text-gray-700 font-semibold mb-2">{card.title}</h3>
              <p className="text-3xl font-bold text-red-600">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;