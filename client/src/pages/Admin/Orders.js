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
  const [totalOrders, setTotalOrders] = useState(0);

  const itemsPerPage = 10;

  // Fetch Orders from API with filters & pagination
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/management/order`, {
        params: {
          search,
          status: statusFilter,
          startDate,
          endDate,
          page: currentPage,
          limit: itemsPerPage,
        },
        withCredentials: true,
      });
      const { success, data, total } = res.data;

      console.log(data)
      if (success) {
        setCounts(data.counts)
        setOrders(data.orders);
        setTotalOrders(data.pagination.totalPages);
      } else {
        setOrders([]);
        setTotalOrders(0);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
      setTotalOrders(0);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage]); // search handled via button

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  const exportExcel = () => {
    if (!orders?.length) return;
    const ws = XLSX.utils.json_to_sheet(
      orders.map((o, index) => ({
        SR_No: (currentPage - 1) * itemsPerPage + index + 1,
        Order_ID: o.id,
        Customer: o.customer,
        Vendor: o.vendor,
        Products: o.products,
        Amount: o.amount,
        Status: o.status,
        Payment: o.payment,
        Date: o.date,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  // Stats Section
  const stats = [
    { label: "Total Orders", value: counts?.total || 0, icon: "🛒" },
    { label: "Pending", value: counts?.pending || 0, icon: "⏱️" },
    { label: "Shipped", value: counts?.shipped || 0, icon: "🚚" },
    { label: "Delivered", value: counts?.delivered || 0, icon: "✅" },
    { label: "Cancelled", value: counts?.cancelled || 0, icon: "❌" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800 space-y-6">
      {/* Header */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl border bg-white shadow-sm p-4 flex flex-col items-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center bg-white shadow-sm p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
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
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Completed">Success</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#FF6A00] text-white rounded-lg hover:bg-orange-500"
        >
          Search
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border">SR.</th>
              <th className="px-4 py-3 border">Order ID</th>
              <th className="px-4 py-3 border">Customer</th>
              <th className="px-4 py-3 border">Vendor</th>
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
                  <td className="px-4 py-3 border">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td className="px-4 py-3 border text-blue-600 font-medium">{o.id}</td>
                  <td className="px-4 py-3 border">{o.User.name}</td>
                  <td className="px-4 py-3 border">{o.Vendor.name}</td>
                  <td className="px-4 py-3 border">{o.product.model_name}</td>
                  <td className="px-4 py-3 border font-bold">{o.total_amount}</td>
                  <td className="px-4 py-3 border">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${o.status === "Completed" ? "bg-green-100 text-green-700" :
                      o.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>{o.order_status}</span>
                  </td>
                  <td className="p-3 border">
                    {o.order_date
                      ? new Date(o.order_date).toISOString().split("T")[0]
                      : "-"}
                  </td>
                  <td className="px-4 py-3 border">
                    <Link to={`/admin/orders/${o.id}`} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      <Eye size={16} /> View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* {totalPages > 1 && ( */}
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
      {/* )} */}
    </div>
  );
};

export default Orders;