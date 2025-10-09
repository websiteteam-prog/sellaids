// src/pages/Payments.jsx
import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";

const Payments = () => {
  const [summary, setSummary] = useState([]);
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/payments");
        setSummary(res.data.summary || []);
        setPayments(res.data.payments || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayments();
  }, []);

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.order.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    const matchesDate = dateFilter
      ? new Date(p.createdAt).toDateString() === new Date(dateFilter).toDateString()
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Export payments to Excel
  const exportExcel = () => {
    if (!payments.length) return;

    const worksheet = XLSX.utils.json_to_sheet(
      payments.map((p) => ({
        "Payment ID": p.id,
        Order: p.order,
        Vendor: p.vendor,
        Customer: p.customer,
        Amount: p.amount,
        Commission: p.commission,
        "Vendor Payout": p.payout,
        Status: p.status,
        Method: p.method,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "Payments_Report.xlsx");
  };

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
        <button
          onClick={exportExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Export Report
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-64"
        />
        <select
          className="border rounded-lg px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Processing</option>
          <option>Failed</option>
        </select>
        <input
          type="date"
          className="border rounded-lg px-3 py-2"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          No transactions available.
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Order</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Commission</th>
                <th className="p-3">Vendor Payout</th>
                <th className="p-3">Status</th>
                <th className="p-3">Method</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
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
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">{p.method}</td>
                  <td className="p-3">
                    <Eye
                      className="h-4 w-4 text-blue-600 cursor-pointer"
                      onClick={() => setSelectedPayment(p)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-xl"
              onClick={() => setSelectedPayment(null)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Payment Details</h3>
            <p><strong>Payment ID:</strong> {selectedPayment.id}</p>
            <p><strong>Order:</strong> {selectedPayment.order}</p>
            <p><strong>Vendor:</strong> {selectedPayment.vendor}</p>
            <p><strong>Customer:</strong> {selectedPayment.customer}</p>
            <p><strong>Amount:</strong> {selectedPayment.amount}</p>
            <p><strong>Commission:</strong> {selectedPayment.commission}</p>
            <p><strong>Payout:</strong> {selectedPayment.payout}</p>
            <p><strong>Status:</strong> {selectedPayment.status}</p>
            <p><strong>Method:</strong> {selectedPayment.method}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
