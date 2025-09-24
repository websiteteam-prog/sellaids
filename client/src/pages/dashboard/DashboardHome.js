// src/pages/dashboard/DashboardHome.jsx
import React from "react";

const DashboardHome = ({ userName = "User" }) => {
  // Replace these with actual data fetched from your API or state
  const totalOrders = 12;
  const pendingDeliveries = 3;
  const wishlistCount = 7;
  const supportTickets = 1;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
    
      {/* Dashboard Overview heading */}
      <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
      <p className="text-gray-700 mb-6">
        Welcome to your dashboard. Manage your account here.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700 font-semibold mb-2">Total Orders</h3>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700 font-semibold mb-2">Pending Deliveries</h3>
          <p className="text-2xl font-bold">{pendingDeliveries}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700 font-semibold mb-2">Wishlist Items</h3>
          <p className="text-2xl font-bold">{wishlistCount}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700 font-semibold mb-2">Support Tickets</h3>
          <p className="text-2xl font-bold">{supportTickets}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
