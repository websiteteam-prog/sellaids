// src/pages/DashboardHome.jsx
import React, { useState } from "react";
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

// Dummy data
const salesData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 5000 },
  { name: "Mar", value: 6000 },
  { name: "Apr", value: 4800 },
  { name: "May", value: 6200 },
  { name: "Jun", value: 5400 },
  { name: "Jul", value: 6700 },
  { name: "Aug", value: 6100 },
  { name: "Sep", value: 4900 },
  { name: "Oct", value: 5200 },
  { name: "Nov", value: 7000 },
  { name: "Dec", value: 7600 },
];

const ordersData = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 150 },
  { name: "Mar", value: 180 },
  { name: "Apr", value: 140 },
  { name: "May", value: 200 },
  { name: "Jun", value: 170 },
  { name: "Jul", value: 210 },
  { name: "Aug", value: 190 },
  { name: "Sep", value: 160 },
  { name: "Oct", value: 175 },
  { name: "Nov", value: 220 },
  { name: "Dec", value: 240 },
];

const DashboardHome = () => {
  const [activeTab, setActiveTab] = useState("sales");

  const chartData = activeTab === "sales" ? salesData : ordersData;

  // Summary values
  const summary = {
    sales: [
      { label: "Total Revenue", value: "₹1,24,580" },
      { label: "Total Orders", value: "342" },
      { label: "Avg. Order Value", value: "₹364" },
    ],
    orders: [
      { label: "Total Orders", value: "1,245" },
      { label: "Pending Orders", value: "78" },
      { label: "Completed Orders", value: "1,167" },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <div className="flex items-center space-x-3">
          <span className="text-gray-600">
            Welcome back, <span className="font-semibold">Rajesh Kumar</span>
          </span>
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            RK
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Total Products</h2>
            <p className="text-2xl font-bold">156</p>
            <p className="text-green-600 text-sm">+12% from last month</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <FaBox className="text-blue-500 text-xl" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Pending Orders</h2>
            <p className="text-2xl font-bold">23</p>
            <p className="text-green-600 text-sm">+5% from last month</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <FaClock className="text-yellow-500 text-xl" />
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Total Earnings</h2>
            <p className="text-2xl font-bold">₹1,24,580</p>
            <p className="text-green-600 text-sm">+18% from last month</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <FaRupeeSign className="text-green-500 text-xl" />
          </div>
        </div>

        {/* This Month Sales */}
        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">This Month Sales</h2>
            <p className="text-2xl font-bold">₹45,230</p>
            <p className="text-green-600 text-sm">+25% from last month</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <FaChartLine className="text-purple-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Sales Overview</h2>
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

        {/* Chart Added */}
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

        <div className="flex justify-around mt-4">
          {summary[activeTab].map((item, idx) => (
            <div key={idx} className="text-center">
              <p className="font-bold">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">Recent Orders</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Product</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">#ORD001</td>
              <td className="p-2">Priya Sharma</td>
              <td className="p-2">Wireless Headphones</td>
              <td className="p-2">₹2,999</td>
              <td className="p-2">
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded">
                  Pending
                </span>
              </td>
              <td className="p-2">Dec 15, 2024</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">#ORD002</td>
              <td className="p-2">Amit Singh</td>
              <td className="p-2">Smart Watch</td>
              <td className="p-2">₹8,999</td>
              <td className="p-2">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                  Delivered
                </span>
              </td>
              <td className="p-2">Dec 14, 2024</td>
            </tr>
            <tr>
              <td className="p-2">#ORD003</td>
              <td className="p-2">Neha Gupta</td>
              <td className="p-2">Bluetooth Speaker</td>
              <td className="p-2">₹1,599</td>
              <td className="p-2">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                  Processing
                </span>
              </td>
              <td className="p-2">Dec 13, 2024</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardHome;
