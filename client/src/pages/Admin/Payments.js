// src/pages/Payments.jsx
import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // For triggering search button
  const [searchClicked, setSearchClicked] = useState(false);

  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/management/payment`,
        {
          params: {
            transaction_id: search || undefined,
            status: statusFilter !== "all" ? statusFilter.toLowerCase() : undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            page,
            limit,
          },
          withCredentials: true,
        }
      );

      const { success, data, message, pagination } = res.data;

      if (success) {
        setPayments(data || []);
        setTotalPages(pagination?.totalPages || 1);
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
  }, [currentPage, searchClicked, statusFilter, startDate, endDate]);

  // Export to Excel
  const exportExcel = () => {
    if (!payments.length) return;

    const worksheet = XLSX.utils.json_to_sheet(
      payments.map((p) => ({
        "Payment ID": p.id,
        Order: p.order_id,
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

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchClicked((prev) => !prev);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
      <div className="flex gap-3 items-center bg-white shadow-sm p-4 rounded-lg w-full">
        <input
          type="text"
          placeholder="Search by Transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />

        <button
          onClick={handleSearch}
          className="bg-[#FF6A00] text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>

        <select
          className="border rounded-lg px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="unpaid">Unpaid</option>
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
                <th className="p-3 border">Order</th>
                <th className="p-3 border">Vendor</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Commission</th>
                <th className="p-3 border">Vendor Payout</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Method</th>
                <th className="p-3 border">Transaction ID</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, index) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 border">{index + 1}</td>
                  <td className="p-3 border text-blue-600">{p.id}</td>
                  <td className="p-3 border">{p.order_id}</td>
                  <td className="p-3 border">{p.vendor_id}</td>
                  <td className="p-3 border font-bold">{p.amount}</td>
                  <td className="p-3 border text-green-600">{p.platform_fee}</td>
                  <td className="p-3 border text-blue-600">{p.vendor_earning}</td>
                  <td className="p-3 border capitalize">{p.status}</td>
                  <td className="p-3 border">{p.payment_method}</td>
                  <td className="p-3 border">{p.transaction_id}</td>
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
            className={`px-3 py-2 rounded ${currentPage === 1
              ? "bg-gray-200 text-gray-500"
              : "bg-blue-600 text-white"
              }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 rounded ${currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                }`}
            >
              {i + 1}
            </button>
          )
          )}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded ${currentPage === totalPages
              ? "bg-gray-200 text-gray-500"
              : "bg-blue-600 text-white"
              }`}
          >
            Next
          </button>
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
