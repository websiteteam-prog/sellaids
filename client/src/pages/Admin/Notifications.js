// src/pages/NotificationsPage.jsx
import React, { useState } from "react";
import { FaBell, FaShoppingCart, FaEnvelope, FaExclamationCircle, FaUserPlus, FaCog, FaBullhorn } from "react-icons/fa";

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("All");

  const metrics = [
    { title: "Total Notifications", value: 8, icon: <FaBell />, color: "bg-blue-600 text-white" },
    { title: "Unread", value: 5, icon: <FaExclamationCircle />, color: "bg-red-600 text-white" },
    { title: "High Priority", value: 4, icon: <FaExclamationCircle />, color: "bg-yellow-400 text-black" },
    { title: "Messages", value: 4, icon: <FaEnvelope />, color: "bg-green-600 text-white" },
  ];

  const tabs = ["All", "Unread", "Vendors", "Orders", "System"];

  const notifications = [
    {
      id: 1,
      title: "New Vendor Registration",
      description: "Tech Solutions has submitted registration request",
      time: "5 minutes ago",
      type: "Vendors",
      priority: "high",
      icon: <FaUserPlus />,
    },
    {
      id: 2,
      title: "High Value Order Alert",
      description: "Order #12345 worth Rs. 89,000 needs attention",
      time: "15 minutes ago",
      type: "Orders",
      priority: "high",
      icon: <FaShoppingCart />,
    },
    {
      id: 3,
      title: "Payment Failed",
      description: "Payment for order #12346 has failed",
      time: "30 minutes ago",
      type: "System",
      priority: "medium",
      icon: <FaExclamationCircle />,
    },
  ];

  const recentMessages = [
    {
      id: 1,
      sender: "Ahmad Ali (Tech Store)",
      title: "Product Approval Request",
      description: "Please review and approve my new product listings...",
      time: "2 hours ago",
    },
    {
      id: 2,
      sender: "Fatima Khan (Customer)",
      title: "Order Issue",
      description: "I have an issue with my recent order #12346...",
      time: "4 hours ago",
    },
    {
      id: 3,
      sender: "Hassan Ahmed (Electronics Plus)",
      title: "Commission Query",
      description: "I have a question about commission...",
      time: "6 hours ago",
    },
  ];

  return (
    <div className="container mx-auto my-5 px-4">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Notifications & Messages</h2>
          <p className="text-gray-500 mb-4">Stay updated with system alerts and user messages</p>
        </div>
        <div className="flex gap-2 mt-3 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
            <FaCog /> Settings
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FaBullhorn /> Send Announcement
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
            <div className={`rounded-full p-3 mb-2 text-2xl ${m.color}`}>{m.icon}</div>
            <h6 className="text-gray-500">{m.title}</h6>
            <h3 className="text-xl font-bold">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Notifications List */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-4">
          {/* Tabs */}
          <div className="flex border-b mb-4 ">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px font-medium border-b-2 ${
                  activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
                }`}
              >
                {tab} ({notifications.filter((n) => tab === "All" || n.type === tab).length})
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {notifications
              .filter((n) => activeTab === "All" || n.type === activeTab)
              .map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h6 className="font-medium">{n.title}</h6>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          n.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : n.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {n.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{n.description}</p>
                    <small className="text-gray-400">{n.time}</small>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h6 className="font-semibold">Recent Messages</h6>
            <a href="#" className="text-blue-600 text-sm hover:underline">View All</a>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="p-3 bg-gray-50 rounded border">
                <strong>{msg.sender}</strong>
                <p className="font-semibold">{msg.title}</p>
                <p className="text-gray-600 text-sm">{msg.description}</p>
                <small className="text-gray-400">{msg.time}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
