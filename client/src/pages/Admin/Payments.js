// src/pages/Payments.jsx
import React, { useState } from "react";
import { Download, Eye, Home, FileText } from "lucide-react";

const Payments = () => {
  const summary = [
    {
      title: "Total Revenue",
      value: "Rs. 12.5M",
      subtitle: "+12% from last month",
      color: "bg-green-100 text-green-700",
      icon: "💰",
    },
    {
      title: "Commission Earned",
      value: "Rs. 1.25M",
      subtitle: "10% commission rate",
      color: "bg-blue-100 text-blue-700",
      icon: "📊",
    },
    {
      title: "Vendor Payouts",
      value: "Rs. 11.25M",
      subtitle: "Pending: Rs. 2.5M",
      color: "bg-purple-100 text-purple-700",
      icon: "🏦",
    },
    {
      title: "Transactions",
      value: "8,901",
      subtitle: "234 pending",
      color: "bg-yellow-100 text-yellow-700",
      icon: "💳",
    },
  ];

  const payments = [
    {
      id: "PAY001",
      order: "#12345",
      vendor: "Tech Store",
      customer: "Ahmad Ali",
      amount: "Rs. 45,000",
      commission: "Rs. 4,500",
      payout: "Rs. 40,500",
      status: "Completed",
      method: "Credit Card",
    },
    {
      id: "PAY002",
      order: "#12346",
      vendor: "Fashion Hub",
      customer: "Fatima Khan",
      amount: "Rs. 12,500",
      commission: "Rs. 1,250",
      payout: "Rs. 11,250",
      status: "Pending",
      method: "Bank Transfer",
    },
    {
      id: "PAY003",
      order: "#12347",
      vendor: "Electronics Plus",
      customer: "Hassan Ahmed",
      amount: "Rs. 78,900",
      commission: "Rs. 7,890",
      payout: "Rs. 71,010",
      status: "Processing",
      method: "Digital Wallet",
    },
    {
      id: "PAY004",
      order: "#12348",
      vendor: "Beauty Corner",
      customer: "Ayesha Malik",
      amount: "Rs. 8,750",
      commission: "Rs. 875",
      payout: "Rs. 7,875",
      status: "Completed",
      method: "Credit Card",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Payments & Transactions</h2>
          <p className="text-sm text-gray-500">
            Monitor revenue, commissions, and vendor payouts
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FileText className="h-4 w-4" /> Financial Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((s, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${s.color}`}>{s.icon}</div>
              <h3 className="text-sm text-gray-600">{s.title}</h3>
            </div>
            <p className="text-lg font-bold mt-2">{s.value}</p>
            <p className="text-xs text-gray-500">{s.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white shadow-sm p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search payments..."
          className="border rounded-lg px-3 py-2 w-64"
        />
        <select className="border rounded-lg px-3 py-2">
          <option>All Status</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Processing</option>
          <option>Failed</option>
        </select>
        <input type="date" className="border rounded-lg px-3 py-2" />
        <div className="ml-auto flex gap-2">
          <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="h-4 w-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">
                <input type="checkbox" />
              </th>
              <th className="p-3">Payment ID</th>
              <th className="p-3">Order</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Commission</th>
              <th className="p-3">Vendor Payout</th>
              <th className="p-3">Status</th>
              <th className="p-3">Method</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3 text-blue-600">{p.id}</td>
                <td className="p-3">{p.order}</td>
                <td className="p-3">{p.vendor}</td>
                <td className="p-3">{p.customer}</td>
                <td className="p-3 font-bold">{p.amount}</td>
                <td className="p-3 text-green-600">{p.commission}</td>
                <td className="p-3 text-blue-600">{p.payout}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      p.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : p.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : p.status === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3">{p.method}</td>
                <td className="p-3 flex gap-2">
                  <Eye className="h-4 w-4 text-blue-600 cursor-pointer" />
                  <Home className="h-4 w-4 text-green-600 cursor-pointer" />
                  <FileText className="h-4 w-4 text-yellow-600 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <p className="text-sm text-gray-500">Showing 1–{payments.length} of {payments.length} payments</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded">Previous</button>
            <button className="px-3 py-1 border rounded bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
