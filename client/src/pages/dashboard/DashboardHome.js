// src/pages/dashboard/DashboardHome.jsx
import React, { useEffect, useState } from "react";
import useWishlistStore from "../../stores/useWishlistStore";
import axios from "axios";

const DashboardHome = () => {
  const { user } = useWishlistStore();
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    pendingDeliveries: 0,
    wishlistCount: 0,
    supportTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/user/${user.id}/dashboard`);
      setDashboardData({
        totalOrders: res.data.totalOrders || 0,
        pendingDeliveries: res.data.pendingDeliveries || 0,
        wishlistCount: res.data.wishlistCount || 0,
        supportTickets: res.data.supportTickets || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cards array for easy mapping
  const cards = [
    { title: "Total Orders", value: dashboardData.totalOrders },
    { title: "Pending Deliveries", value: dashboardData.pendingDeliveries },
    { title: "Wishlist Items", value: dashboardData.wishlistCount },
    { title: "Support Tickets", value: dashboardData.supportTickets },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
      <p className="text-gray-700 mb-6">Welcome, {user?.full_name || "User"}! Manage your account here.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded shadow flex flex-col justify-between items-center"
          >
            <h3 className="text-gray-700 font-semibold mb-2">{card.title}</h3>
            <p className="text-3xl font-bold">
              {loading ? "0" : card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
