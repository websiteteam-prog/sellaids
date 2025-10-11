// src/pages/vendor/DashboardHome.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBox, FaClock, FaRupeeSign, FaChartLine } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";

const colorMap = {
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
};

const DashboardHome = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [summary, setSummary] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalEarnings: "₹0",
    thisMonthSales: "₹0",
    salesOverview: [],
    ordersOverview: [],
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Summary and overview data
        const summaryRes = await axios.get("/api/vendor/dashboard-summary");
        const ordersRes = await axios.get("/api/vendor/recent-orders?limit=4");

        setSummary({
          totalProducts: summaryRes.data.totalProducts,
          pendingOrders: summaryRes.data.pendingOrders,
          totalEarnings: summaryRes.data.totalEarnings,
          thisMonthSales: summaryRes.data.thisMonthSales,
          salesOverview: summaryRes.data.salesOverview, // [{name: "Jan", value: 4000}, ...]
          ordersOverview: summaryRes.data.ordersOverview, // [{name: "Jan", value: 120}, ...]
        });

        setRecentOrders(ordersRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = activeTab === "sales" ? summary.salesOverview : summary.ordersOverview;

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Vendor Dashboard</h1>
        <div className="flex items-center space-x-3">
          <span className="text-gray-600 text-sm sm:text-base">
            Welcome back, <span className="font-semibold">Rajesh Kumar</span>
          </span>
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm sm:text-base">
            RK
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          {
            label: "Total Products",
            value: summary.totalProducts,
            icon: <FaBox className="text-blue-500 text-xl" />,
            bg: "bg-blue-100",
          },
          {
            label: "Pending Orders",
            value: summary.pendingOrders,
            icon: <FaClock className="text-yellow-500 text-xl" />,
            bg: "bg-yellow-100",
          },
          {
            label: "Total Earnings",
            value: summary.totalEarnings,
            icon: <FaRupeeSign className="text-green-500 text-xl" />,
            bg: "bg-green-100",
          },
          {
            label: "This Month Sales",
            value: summary.thisMonthSales,
            icon: <FaChartLine className="text-purple-500 text-xl" />,
            bg: "bg-purple-100",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-4 sm:p-5 rounded-xl shadow flex items-center justify-between"
          >
            <div>
              <h2 className="text-sm text-gray-500">{card.label}</h2>
              <p className="text-xl sm:text-2xl font-bold">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.bg}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Sales Overview */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-8 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="font-bold mb-2 sm:mb-0">Sales Overview</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-3 py-1 rounded text-sm ${
                activeTab === "sales"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3 py-1 rounded text-sm ${
                activeTab === "orders"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Orders
            </button>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#FF6A00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Recent Orders</h2>
          <button
            onClick={() => navigate("/vendor/all-products")}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Product</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.customer}</td>
                    <td className="p-2">{order.product}</td>
                    <td className="p-2">{order.amount}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          colorMap[order.color]?.bg || "bg-gray-100"
                        } ${colorMap[order.color]?.text || "text-gray-700"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-2">{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
