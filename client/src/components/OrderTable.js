import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Dummy Orders
const initialOrders = [
  { id: "#1001", date: "2025-09-10", status: "Delivered", total: "₹1,499" },
  { id: "#1002", date: "2025-09-08", status: "Shipped", total: "₹899" },
  { id: "#1003", date: "2025-09-05", status: "Processing", total: "₹2,199" },
  { id: "#1004", date: "2025-09-03", status: "Cancelled", total: "₹499" },
  { id: "#1005", date: "2025-09-01", status: "Delivered", total: "₹1,099" },
];

const OrderTable = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const filteredOrders = initialOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.date.includes(search)
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "orders_export.xlsx");
  };

  return (
    <div className="bg-white p-4 rounded-md shadow">
      {/* Filter and Export */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by Order ID or Date"
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <button
          onClick={handleExport}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full sm:w-auto"
        >
          Export to Excel
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{order.id}</td>
                  <td className="px-4 py-3 border">{order.date}</td>
                  <td className="px-4 py-3 border">{order.status}</td>
                  <td className="px-4 py-3 border">{order.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No matching orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderTable;
