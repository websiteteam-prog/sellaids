// src/pages/admin/VendorManagement.jsx
import React, { useState } from "react";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([
    { id: 1, name: "Vendor A", email: "vendora@example.com", phone: "9876543210", status: "Active" },
    { id: 2, name: "Vendor B", email: "vendorb@example.com", phone: "8765432109", status: "Pending" },
    { id: 3, name: "Vendor C", email: "vendorc@example.com", phone: "7654321098", status: "Suspended" },
  ]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vendor Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          + Add Vendor
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search vendors..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
        />
        <select className="w-full md:w-1/4 px-4 py-2 border rounded-lg">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Vendor Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3 border">ID</th>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border">Phone</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border">{vendor.id}</td>
                <td className="px-4 py-3 border font-medium">{vendor.name}</td>
                <td className="px-4 py-3 border">{vendor.email}</td>
                <td className="px-4 py-3 border">{vendor.phone}</td>
                <td className="px-4 py-3 border">
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
                <td className="px-4 py-3 border space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">Showing 1-3 of 3 vendors</p>
        <div className="space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-100">&lt;</button>
          <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-100">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default VendorManagement;
