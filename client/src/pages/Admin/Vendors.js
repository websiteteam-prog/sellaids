// src/pages/admin/VendorManagement.jsx
import React, { useEffect, useState } from "react";
import { FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/vendors"); // replace with your API
      setVendors(res.data || []);
      setFilteredVendors(res.data || []);
    } catch (err) {
      console.error("Error fetching vendors:", err.response?.data || err.message);
      setVendors([]);
      setFilteredVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(filtered);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 5;
  const indexOfLast = currentPage * vendorsPerPage;
  const indexOfFirst = indexOfLast - vendorsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800 text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Vendor Management</h2>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-4 items-center">
        <div className="flex w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 bg-white text-gray-700 rounded-l-lg px-3 py-2 w-full text-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-[#FF6A00] text-white px-3 py-2 rounded-r-lg hover:bg-orange-500"
          >
            <FaSearch />
          </button>
        </div>

        <select className="border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 w-full md:w-1/6 text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Vendor Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No Vendors
                </td>
              </tr>
            ) : currentVendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No Vendors Found
                </td>
              </tr>
            ) : (
              currentVendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{vendor.id}</td>
                  <td className="p-3 font-medium">{vendor.name}</td>
                  <td className="p-3">{vendor.email}</td>
                  <td className="p-3">{vendor.phone}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        vendor.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : vendor.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                      <FaTrash size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600 text-xs">
          Showing {currentVendors.length > 0 ? indexOfFirst + 1 : 0}-
          {indexOfFirst + currentVendors.length} of {filteredVendors.length} vendors
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-[#FF6A00] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorManagement;
