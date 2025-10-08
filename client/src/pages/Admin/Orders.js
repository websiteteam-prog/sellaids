// src/pages/Orders.jsx
import React from "react";
import { Download, Eye, Edit, Trash2, Truck } from "lucide-react";

const Orders = () => {
  const stats = [
    { label: "Total Orders", value: "8,901", icon: "🛒", color: "bg-blue-100 text-blue-600" },
    { label: "Pending", value: "234", icon: "⏱", color: "bg-yellow-100 text-yellow-600" },
    { label: "Shipped", value: "1,456", icon: "🚚", color: "bg-purple-100 text-purple-600" },
    { label: "Delivered", value: "6,789", icon: "✅", color: "bg-green-100 text-green-600" },
    { label: "Cancelled", value: "422", icon: "❌", color: "bg-red-100 text-red-600" },
  ];

  const orders = [
    {
      id: "#12345",
      customer: "Ahmad Ali",
      location: "Karachi, Pakistan",
      vendor: "Tech Store",
      products: "2 items",
      amount: "Rs. 45,000",
      status: "Completed",
      payment: "Paid",
      date: "2024-03-15",
    },
    {
      id: "#12346",
      customer: "Fatima Khan",
      location: "Lahore, Pakistan",
      vendor: "Fashion Hub",
      products: "1 items",
      amount: "Rs. 12,500",
      status: "Pending",
      payment: "Pending",
      date: "2024-03-14",
    },
    {
      id: "#12347",
      customer: "Hassan Ahmed",
      location: "Islamabad, Pakistan",
      vendor: "Electronics Plus",
      products: "3 items",
      amount: "Rs. 78,900",
      status: "Processing",
      payment: "Paid",
      date: "2024-03-14",
    },
    {
      id: "#12348",
      customer: "Ayesha Malik",
      location: "Faisalabad, Pakistan",
      vendor: "Beauty Corner",
      products: "4 items",
      amount: "Rs. 8,750",
      status: "Shipped",
      payment: "Paid",
      date: "2024-03-13",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Orders Management</h2>
          <p className="text-sm text-gray-500">Track and manage all orders on your platform</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700">
          Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl border bg-white shadow-sm p-4 flex flex-col items-center">
            <div className={`text-2xl mb-2 ${s.color}`}>{s.icon}</div>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white shadow-sm p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search orders..."
          className="border rounded-lg px-3 py-2 w-64"
        />
        <select className="border rounded-lg px-3 py-2">
          <option>All Status</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Shipped</option>
        </select>
        <input type="date" className="border rounded-lg px-3 py-2" />
        <div className="ml-auto flex gap-2">
          <button className="flex items-center px-4 py-2 rounded-lg border bg-white shadow-sm hover:bg-gray-100">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </button>
          <button className="flex items-center px-4 py-2 rounded-lg border bg-white shadow-sm hover:bg-gray-100">
            <Download className="h-4 w-4 mr-2" /> Export Excel
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Products</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3 text-blue-600">{o.id}</td>
                <td className="p-3">
                  {o.customer}
                  <div className="text-xs text-gray-500">{o.location}</div>
                </td>
                <td className="p-3">{o.vendor}</td>
                <td className="p-3">{o.products}</td>
                <td className="p-3 font-bold">{o.amount}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      o.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : o.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : o.status === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      o.payment === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {o.payment}
                  </span>
                </td>
                <td className="p-3">{o.date}</td>
                <td className="p-3 flex gap-2">
                  <Eye className="h-4 w-4 text-blue-600 cursor-pointer" />
                  <Edit className="h-4 w-4 text-green-600 cursor-pointer" />
                  <Truck className="h-4 w-4 text-purple-600 cursor-pointer" />
                  <Trash2 className="h-4 w-4 text-red-600 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
