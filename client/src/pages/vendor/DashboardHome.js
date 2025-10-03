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

const recentOrders = [
  {
    id: "#ORD001",
    customer: "Priya Sharma",
    product: "Wireless Headphones",
    amount: "₹2,999",
    status: "Pending",
    date: "Dec 15, 2024",
    color: "yellow",
  },
  {
    id: "#ORD002",
    customer: "Amit Singh",
    product: "Smart Watch",
    amount: "₹8,999",
    status: "Delivered",
    date: "Dec 14, 2024",
    color: "green",
  },
  {
    id: "#ORD003",
    customer: "Neha Gupta",
    product: "Bluetooth Speaker",
    amount: "₹1,599",
    status: "Processing",
    date: "Dec 13, 2024",
    color: "blue",
  },
];

const colorMap = {
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
};

const DashboardHome = () => {
  const [activeTab, setActiveTab] = useState("sales");

  const chartData = activeTab === "sales" ? salesData : ordersData;

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
            value: "156",
            percent: "+12%",
            icon: <FaBox className="text-blue-500 text-xl" />,
            bg: "bg-blue-100",
          },
          {
            label: "Pending Orders",
            value: "23",
            percent: "+5%",
            icon: <FaClock className="text-yellow-500 text-xl" />,
            bg: "bg-yellow-100",
          },
          {
            label: "Total Earnings",
            value: "₹1,24,580",
            percent: "+18%",
            icon: <FaRupeeSign className="text-green-500 text-xl" />,
            bg: "bg-green-100",
          },
          {
            label: "This Month Sales",
            value: "₹45,230",
            percent: "+25%",
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
              <p className="text-green-600 text-xs sm:text-sm">
                {card.percent} from last month
              </p>
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

        <div className="flex flex-col sm:flex-row justify-around mt-4 gap-4">
          {summary[activeTab].map((item, idx) => (
            <div key={idx} className="text-center">
              <p className="font-bold">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

     {/* Recent Orders */}
<div className="bg-white p-4 sm:p-6 rounded-xl shadow overflow-x-auto">
  <h2 className="font-bold mb-4">Recent Orders</h2>
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
        {recentOrders.map((order, idx) => (
          <tr key={idx} className="border-b hover:bg-gray-50">
            <td className="p-2">{order.id}</td>
            <td className="p-2">{order.customer}</td>
            <td className="p-2">{order.product}</td>
            <td className="p-2">{order.amount}</td>
            <td className="p-2">
              <span
                className={`px-2 py-1 text-xs rounded ${colorMap[order.color].bg} ${colorMap[order.color].text}`}
              >
                {order.status}
              </span>
            </td>
            <td className="p-2">{order.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default DashboardHome;
