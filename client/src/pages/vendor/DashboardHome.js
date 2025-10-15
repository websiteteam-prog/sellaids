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
import { useVendorStore } from "../../stores/useVendorStore";

const colorMap = {
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
};

const DashboardHome = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalEarnings: "₹0",
    thisMonthSales: "₹0",
    salesOverview: [],
    ordersOverview: [],
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Zustand store se vendor aur token access
  const { vendor, token, logout } = useVendorStore();

  const vendorName = vendor?.name || "Vendor";
  const vendorInitials = vendorName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      try {
        setLoading(true);

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const baseURL = import.meta.env.VITE_API_BASE_URL;

        const [summaryRes, productsRes] = await Promise.all([
          axios.get(`${baseURL}/api/vendor/dashboard-summary`, config),
          axios.get(`${baseURL}/api/vendor/recent-products?limit=4`, config),
        ]);

        setSummary({
          totalProducts: summaryRes.data.totalProducts,
          pendingOrders: summaryRes.data.pendingOrders,
          totalEarnings: summaryRes.data.totalEarnings,
          thisMonthSales: summaryRes.data.thisMonthSales,
          salesOverview: summaryRes.data.salesOverview,
          ordersOverview: summaryRes.data.ordersOverview,
        });

        setRecentProducts(productsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (err.response?.status === 401) {
          logout();
          navigate("/vendor/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, logout, navigate]);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Vendor Dashboard</h1>
        <div className="flex items-center space-x-3">
          <span className="text-gray-600 text-sm sm:text-base">
            Welcome back, <span className="font-semibold">{vendorName}</span>
          </span>
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm sm:text-base">
            {vendorInitials}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          { label: "Total Products", value: summary.totalProducts, icon: <FaBox className="text-blue-500 text-xl" />, bg: "bg-blue-100" },
          { label: "Pending Orders", value: summary.pendingOrders, icon: <FaClock className="text-yellow-500 text-xl" />, bg: "bg-yellow-100" },
          { label: "Total Earnings", value: summary.totalEarnings, icon: <FaRupeeSign className="text-green-500 text-xl" />, bg: "bg-green-100" },
          { label: "This Month Sales", value: summary.thisMonthSales, icon: <FaChartLine className="text-purple-500 text-xl" />, bg: "bg-purple-100" },
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-4 sm:p-5 rounded-xl shadow flex items-center justify-between">
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
        <div className="mb-4">
          <h2 className="font-bold">Sales Overview</h2>
        </div>

        <div className="h-64">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-500">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.salesOverview}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#FF6A00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Recent Products</h2>
          <button onClick={() => navigate("/vendor/all-products")} className="text-sm text-blue-600 hover:underline">View All</button>
        </div>
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2">Product ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Price</th>
                <th className="p-2">Status</th>
                <th className="p-2">Added Date</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length > 0 ? (
                recentProducts.map((product, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{product.id}</td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2">{product.price}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 text-xs rounded ${colorMap[product.color]?.bg || "bg-gray-100"} ${colorMap[product.color]?.text || "text-gray-700"}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-2">{product.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">No products found</td>
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