// src/pages/Payments.jsx
import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState(""); // Single search input for order_id or transaction_id
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [triggerFetch, setTriggerFetch] = useState(false); // Trigger search

  // Fetch payments
  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/management/payment`,
        {
          params: {
            search: search || undefined, // backend should handle search by transaction_id
            status: statusFilter !== "all" ? statusFilter.toLowerCase() : undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            page,
            limit,
          },
          withCredentials: true,
        }
      );

      const { success, data, message } = res.data;

      if (success) {
        setPayments(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        toast.success(message);
      } else {
        setPayments([]);
        toast.error(message || "Failed to fetch payments");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage, triggerFetch, statusFilter, startDate, endDate]);

  const handleSearch = () => {
    setCurrentPage(1);
    setTriggerFetch(prev => !prev);
  };

  const exportExcel = () => {
    if (!payments.length) return;

    const worksheet = XLSX.utils.json_to_sheet(
      payments.map((p, idx) => ({
        SR: (currentPage - 1) * limit + idx + 1,
        "Payment ID": p.id,
        "Order ID": p.order_id,
        Vendor: p.vendor_id,
        Amount: p.amount,
        Commission: p.platform_fee,
        "Vendor Payout": p.vendor_earning,
        Status: p.status,
        Method: p.payment_method,
        "Transaction ID": p.transaction_id,
        "Payment Date": p.payment_date,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "Payments_Report.xlsx");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Payments & Transactions</h2>
        <button
          onClick={exportExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center bg-white shadow-sm p-4 rounded-lg w-full flex-wrap">
        <input
          type="text"
          placeholder="Search by Transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-auto"
        />
        <select
          className="border rounded-lg px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
        <input
          type="date"
          className="border rounded-lg px-3 py-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border rounded-lg px-3 py-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-[#FF6A00] text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <div className="text-center p-6 text-gray-500">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="text-center p-6 text-gray-500">No transactions available.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-3 border">SR.</th>
                <th className="p-3 border">Payment ID</th>
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">Vendor ID</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Commission</th>
                <th className="p-3 border">Vendor Payout</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Method</th>
                <th className="p-3 border">Transaction ID</th>
                <th className="p-3 border">Payment Date</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, index) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 border">{(currentPage - 1) * limit + index + 1}</td>
                  <td className="p-3 border text-blue-600">{p.id}</td>
                  <td className="p-3 border">{p.order_id}</td>
                  <td className="p-3 border">{p.vendor_id}</td>
                  <td className="p-3 border font-bold">{p.amount}</td>
                  <td className="p-3 border text-green-600">{p.platform_fee}</td>
                  <td className="p-3 border text-blue-600">{p.vendor_earning}</td>
                  <td className="p-3 border capitalize">{p.status}</td>
                  <td className="p-3 border">{p.payment_method}</td>
                  <td className="p-3 border">{p.transaction_id}</td>
                  <td className="p-3 border">
                    {p.payment_date
                      ? new Date(p.payment_date).toISOString().split("T")[0]
                      : "-"}
                  </td>
                  <td className="p-3 border text-center">
                    <Eye
                      className="h-4 w-4 text-blue-600 cursor-pointer inline-block"
                      onClick={() => setSelectedPayment(p)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Payment Modal */}
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
            {Object.entries(selectedPayment).map(([key, value]) => (
              <p key={key} className="text-sm mb-1">
                <strong className="capitalize">{key}:</strong> {value?.toString()}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
