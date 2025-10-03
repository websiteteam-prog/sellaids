// src/pages/AdminDashboard.jsx

import React from "react";
import {
  FaUsers,
  FaStore,
  FaBoxOpen,
  FaShoppingCart,
  FaUserPlus,
  FaBuilding,
  FaPlusSquare,
  FaDownload,
} from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm">Total Users</h3>
            <p className="text-2xl font-bold text-gray-800">12,543</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% vs last month</p>
          </div>
          <div className="bg-[#FF6A00] p-3 rounded-lg text-white">
            <FaUsers size={20} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm">Total Vendors</h3>
            <p className="text-2xl font-bold text-gray-800">1,234</p>
            <p className="text-xs text-green-600 mt-1">↑ 8% vs last month</p>
          </div>
          <div className="bg-green-500 p-3 rounded-lg text-white">
            <FaStore size={20} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm">Total Products</h3>
            <p className="text-2xl font-bold text-gray-800">45,678</p>
            <p className="text-xs text-green-600 mt-1">↑ 15% vs last month</p>
          </div>
          <div className="bg-purple-500 p-3 rounded-lg text-white">
            <FaBoxOpen size={20} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-800">8,901</p>
            <p className="text-xs text-red-600 mt-1">↓ 5% vs last month</p>
          </div>
          <div className="bg-yellow-500 p-3 rounded-lg text-white">
            <FaShoppingCart size={20} />
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Sales Revenue */}
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-gray-700 font-semibold mb-4">
            Monthly Sales Revenue
          </h3>
          {[
            { month: "Jan", value: 45000 },
            { month: "Feb", value: 52000 },
            { month: "Mar", value: 48000 },
            { month: "Apr", value: 61000 },
            { month: "May", value: 55000 },
            { month: "Jun", value: 67000 },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between mb-3">
              <span className="w-12 text-sm">{item.month}</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#FF6A00] h-3 rounded-full"
                  style={{ width: `${(item.value / 70000) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Top Selling Products */}
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-gray-700 font-semibold mb-4">
            Top Selling Products
          </h3>
          {[
            { name: "iPhone 15 Pro", sales: 1250 }, 
            { name: "Samsung Galaxy S24", sales: 980 },
            { name: "MacBook Air M3", sales: 750 },
            { name: "iPad Pro", sales: 650 },
            { name: "AirPods Pro", sales: 580 },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between mb-3">
              <span className="w-28 text-sm">{item.name}</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#FF6A00] h-3 rounded-full"
                  style={{ width: `${(item.sales / 1300) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {item.sales}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-700 font-semibold">Recent Orders</h3>
            <button className="text-sm text-[#FF6A00] font-medium">
              View All
            </button>
          </div>
          {[
            { id: "#12345", status: "Completed", color: "bg-green-100 text-green-700", name: "Ahmad Ali • Tech Store", price: 45000, time: "2 hours ago" },
            { id: "#12346", status: "Pending", color: "bg-yellow-100 text-yellow-700", name: "Fatima Khan • Fashion Hub", price: 12500, time: "4 hours ago" },
            { id: "#12347", status: "Processing", color: "bg-blue-100 text-blue-700", name: "Hassan Ahmed • Electronics Plus", price: 78900, time: "6 hours ago" },
            { id: "#12348", status: "Shipped", color: "bg-purple-100 text-purple-700", name: "Ayesha Malik • Beauty Corner", price: 8750, time: "8 hours ago" },
            { id: "#12349", status: "Completed", color: "bg-green-100 text-green-700", name: "Usman Shah • Sports World", price: 25600, time: "10 hours ago" },
          ].map((order, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3 border-b last:border-none"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {order.id}
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${order.color}`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500">{order.name}</p>
                <p className="text-xs text-gray-400">{order.time}</p>
              </div>
              <div className="font-semibold text-gray-700">
                Rs. {order.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-700 font-semibold">Recent Activity</h3>
            <button className="text-sm text-[#FF6A00] font-medium">
              View All
            </button>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>
              👤 New user registered: <span className="font-medium">Zara Hussain</span>
              <span className="block text-xs text-gray-400">5 minutes ago</span>
            </li>
            <li>
              🏬 Vendor <span className="font-medium">"Mobile Zone"</span> submitted new product
              <span className="block text-xs text-gray-400">15 minutes ago</span>
            </li>
            <li>
              📦 Order <span className="font-medium">#12350</span> marked as delivered
              <span className="block text-xs text-gray-400">30 minutes ago</span>
            </li>
            <li>
              💰 Payment of <span className="font-medium">Rs. 15,000</span> received
              <span className="block text-xs text-gray-400">1 hour ago</span>
            </li>
            <li>
              ✅ System backup completed successfully
              <span className="block text-xs text-gray-400">2 hours ago</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-gray-700 font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200">
            <FaUserPlus className="mb-2" size={20} />
            Add User
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-100 text-green-600 hover:bg-green-200">
            <FaBuilding className="mb-2" size={20} />
            Add Vendor
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200">
            <FaPlusSquare className="mb-2" size={20} />
            Add Product
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200">
            <FaDownload className="mb-2" size={20} />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};
 

export default AdminDashboard;
