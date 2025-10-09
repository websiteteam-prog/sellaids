// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { Download, Eye, Edit, Trash2, Truck } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [exactDate, setExactDate] = useState("");
  const [monthDate, setMonthDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders"); // backend API
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesExactDate = exactDate ? o.date === exactDate : true;
    const matchesMonth = monthDate ? o.date.startsWith(monthDate) : true;
    return matchesSearch && matchesExactDate && matchesMonth;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Export to Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  // Actions
  const viewOrder = (id) => {
    const order = orders.find((o) => o.id === id);
    alert(JSON.stringify(order, null, 2)); // replace with modal later
  };

  const editOrder = async (id) => {
    const newStatus = prompt("Enter new status (Pending/Shipped/Completed/Cancelled):");
    if (!newStatus) return;
    try {
      await axios.put(`/api/orders/${id}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`/api/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const shipOrder = async (id) => {
    try {
      await axios.put(`/api/orders/${id}`, { status: "Shipped" });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "Shipped" } : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Stats
  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      color: "bg-blue-100 text-blue-600",
      icon: "🛒",
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "Pending").length,
      color: "bg-yellow-100 text-yellow-600",
      icon: "⏱",
    },
    {
      label: "Shipped",
      value: orders.filter((o) => o.status === "Shipped").length,
      color: "bg-purple-100 text-purple-600",
      icon: "🚚",
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status === "Completed").length,
      color: "bg-green-100 text-green-600",
      icon: "✅",
    },
    {
      label: "Cancelled",
      value: orders.filter((o) => o.status === "Cancelled").length,
      color: "bg-red-100 text-red-600",
      icon: "❌",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Orders Management</h2>
          <p className="text-sm text-gray-500">
            Track and manage all orders on your platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border bg-white shadow-sm p-4 flex flex-col items-center"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Exact date */}
        <input
          type="date"
          className="border rounded-lg px-3 py-2"
          value={exactDate}
          onChange={(e) => setExactDate(e.target.value)}
        />
        {/* Month picker */}
        <input
          type="month"
          className="border rounded-lg px-3 py-2"
          value={monthDate}
          onChange={(e) => setMonthDate(e.target.value)}
        />
        <div className="ml-auto flex gap-2">
          <button
            onClick={exportExcel}
            className="flex items-center px-4 py-2 rounded-lg border bg-white shadow-sm hover:bg-gray-100"
          >
            <Download className="h-4 w-4 mr-2" /> Export Excel
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">
                <input type="checkbox" />
              </th>
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
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-500">
                  No Orders
                </td>
              </tr>
            ) : (
              currentOrders.map((o, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
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
                    <Eye
                      className="h-4 w-4 text-blue-600 cursor-pointer"
                      onClick={() => viewOrder(o.id)}
                    />
                    <Edit
                      className="h-4 w-4 text-green-600 cursor-pointer"
                      onClick={() => editOrder(o.id)}
                    />
                    <Truck
                      className="h-4 w-4 text-purple-600 cursor-pointer"
                      onClick={() => shipOrder(o.id)}
                    />
                    <Trash2
                      className="h-4 w-4 text-red-600 cursor-pointer"
                      onClick={() => deleteOrder(o.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 border rounded hover:bg-gray-100 ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
