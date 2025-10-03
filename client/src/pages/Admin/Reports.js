// src/pages/ReportsDashboard.jsx
import React from "react";
import { FaDollarSign, FaShoppingCart, FaUsers, FaChartLine, FaDownload } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const ReportsDashboard = () => {
  const salesData = [
    { month: "Jan", sales: 450000 },
    { month: "Feb", sales: 520000 },
    { month: "Mar", sales: 480000 },
    { month: "Apr", sales: 610000 },
    { month: "May", sales: 550000 },
    { month: "Jun", sales: 670000 },
  ];

  const usersData = [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1450 },
    { month: "Mar", users: 1680 },
    { month: "Apr", users: 1920 },
    { month: "May", users: 2150 },
    { month: "Jun", users: 2380 },
  ];

  const vendors = [
    { name: "Tech Store", owner: "Ahmad Ali", revenue: "Rs. 2,45,000", orders: 156, growth: "+15%" },
    { name: "Mobile Zone", owner: "Zara Hussain", revenue: "Rs. 1,89,000", orders: 134, growth: "+12%" },
    { name: "Electronics Plus", owner: "Hassan Ahmed", revenue: "Rs. 1,56,000", orders: 98, growth: "+8%" },
    { name: "Fashion Hub", owner: "Fatima Khan", revenue: "Rs. 1,34,000", orders: 87, growth: "+5%" },
    { name: "Sports World", owner: "Usman Shah", revenue: "Rs. 98,000", orders: 65, growth: "+3%" },
  ];

  const categories = [
    { name: "Electronics", revenue: "Rs. 4,56,000", percent: 35, growth: "+18%" },
    { name: "Fashion", revenue: "Rs. 3,21,000", percent: 25, growth: "+12%" },
    { name: "Beauty", revenue: "Rs. 2,45,000", percent: 19, growth: "+8%" },
    { name: "Sports", revenue: "Rs. 1,89,000", percent: 14, growth: "+5%" },
    { name: "Books", revenue: "Rs. 89,000", percent: 7, growth: "+2%" },
  ];

  return (
    <div className="container mx-auto my-5 px-4">
      {/* Top Title + Download Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Reports & Analytics</h2>
          <p className="text-gray-500 mb-4">Comprehensive insights and business analytics</p>
        </div>
        <button className="mt-3 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex items-center gap-2">
          <FaDownload /> Download Report
        </button>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5 text-center">
          <FaDollarSign size={28} className="mx-auto text-blue-600 mb-2" />
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h3 className="text-xl font-bold">Rs. 12.5M</h3>
          <span className="text-green-500 text-sm">+15% vs last month</span>
        </div>
        <div className="bg-white rounded-lg shadow p-5 text-center">
          <FaShoppingCart size={28} className="mx-auto text-yellow-500 mb-2" />
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h3 className="text-xl font-bold">8,901</h3>
          <span className="text-green-500 text-sm">+8% vs last month</span>
        </div>
        <div className="bg-white rounded-lg shadow p-5 text-center">
          <FaUsers size={28} className="mx-auto text-green-500 mb-2" />
          <p className="text-gray-500 text-sm">New Customers</p>
          <h3 className="text-xl font-bold">2,380</h3>
          <span className="text-green-500 text-sm">+12% vs last month</span>
        </div>
        <div className="bg-white rounded-lg shadow p-5 text-center">
          <FaChartLine size={28} className="mx-auto text-red-500 mb-2" />
          <p className="text-gray-500 text-sm">Avg Order Value</p>
          <h3 className="text-xl font-bold">Rs. 1,405</h3>
          <span className="text-green-500 text-sm">+5% vs last month</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <h6 className="font-semibold mb-3">Sales Trend (Last 6 Months)</h6>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4e73df" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h6 className="font-semibold mb-3">User Growth (Last 6 Months)</h6>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#f0f0f0" />
                <Line type="monotone" dataKey="users" stroke="#1cc88a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vendors & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <h6 className="font-semibold mb-3">Top Performing Vendors</h6>
          <table className="w-full text-left border-collapse">
            <tbody>
              {vendors.map((v, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="font-bold pr-3">#{i + 1}</td>
                  <td>
                    <div className="font-medium">{v.name}</div>
                    <small className="text-gray-500">{v.owner}</small>
                  </td>
                  <td className="pr-3">{v.revenue}</td>
                  <td className="pr-3">{v.orders} orders</td>
                  <td className="text-green-500">{v.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h6 className="font-semibold mb-3">Category Performance</h6>
          {categories.map((c, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between mb-1 font-medium">
                <span>{c.name}</span>
                <span>{c.percent}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full mb-1">
                <div className="h-3 bg-blue-600 rounded-full" style={{ width: `${c.percent}%` }}></div>
              </div>
              <small className="text-gray-500">{c.revenue} <span className="text-green-500">{c.growth}</span></small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
