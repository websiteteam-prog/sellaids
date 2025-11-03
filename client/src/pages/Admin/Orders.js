import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Eye } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/management/order`, {
        params: {
          order_id:search,
          status: statusFilter,
          start_date: startDate,
          end_date: endDate,
          page: currentPage,
          limit: itemsPerPage,
        },
        withCredentials: true,
      });
      const { success, data } = res.data;
      // console.log(data)
      if (success) {
        setCounts(data.counts || {});
        setOrders(data.orders || []);
        setTotalPages(data.pagination?.totalPages || 0);
      } else {
        setOrders([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching orders");
      setOrders([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage, startDate, endDate]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  const exportExcel = () => {
    if (!orders?.length) return toast.error("No orders to export");
    const ws = XLSX.utils.json_to_sheet(
      orders.map((o, i) => ({
        SR_No: (currentPage - 1) * itemsPerPage + i + 1,
        Order_ID: o.id,
        Customer: o.User?.name || "-",
        Vendor: o.Vendor?.name || "-",
        Product: o.product?.product_type || "-",
        Amount: o.total_amount,
        Status: o.order_status,
        Date: o.order_date ? new Date(o.order_date).toISOString().split("T")[0] : "-",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  const stats = [
    { label: "Total Orders", value: counts?.total || 0, icon: "🛒" },
    { label: "Pending", value: counts?.pending || 0, icon: "⏱️" },
    { label: "Shipped", value: counts?.shipped || 0, icon: "🚚" },
    { label: "Delivered", value: counts?.delivered || 0, icon: "✅" },
    { label: "Cancelled", value: counts?.cancelled || 0, icon: "❌" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Orders Management</h2>
          <p className="text-sm text-gray-500">Track and manage all orders</p>
        </div>
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Download size={16} /> Export Excel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl border bg-white shadow-sm p-4 flex flex-col items-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center bg-white shadow-sm p-4 rounded-lg w-full">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg w-full"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#FF6A00] text-white rounded-lg hover:bg-orange-500"
        >
          Search
        </button>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border">SR.</th>
              <th className="px-4 py-3 border">Order ID</th>
              <th className="px-4 py-3 border">Customer Name</th>
              <th className="px-4 py-3 border">Vendor Name</th>
              <th className="px-4 py-3 border">Product Name</th>
              <th className="px-4 py-3 border">Amount</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6">Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6">No data found</td>
              </tr>
            ) : (
              orders.map((o, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td className="px-4 py-3 border text-blue-600 font-medium">{o.id}</td>
                  <td className="px-4 py-3 border">{o.User?.name || "-"}</td>
                  <td className="px-4 py-3 border">{o.Vendor?.name || "-"}</td>
                  <td className="px-4 py-3 border">{o.product?.product_type || "-"}</td>
                  <td className="px-4 py-3 border font-bold">₹{o.total_amount}</td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        o.order_status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : o.order_status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : o.order_status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {o.order_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border">
                    {o.order_date ? new Date(o.order_date).toISOString().split("T")[0] : "-"}
                  </td>
                  <td className="px-4 py-3 border">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
