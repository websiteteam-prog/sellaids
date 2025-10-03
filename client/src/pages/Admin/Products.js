// src/pages/admin/ProductManagement.jsx
import React, { useState } from "react";
import { Eye, Edit, Trash2, Download } from "lucide-react";

const ProductManagement = () => {
  const products = [
    { id: 1, name: "iPhone 15 Pro Max", vendor: "Tech Store", category: "Electronics", price: "Rs. 2,49,000", stock: 25, sales: 145, status: "Active", image: "https://via.placeholder.com/40x40?text=📱" },
    { id: 2, name: "Samsung Galaxy S24 Ultra", vendor: "Mobile Zone", category: "Electronics", price: "Rs. 1,89,000", stock: 18, sales: 98, status: "Active", image: "https://via.placeholder.com/40x40?text=📱" },
    { id: 3, name: "MacBook Air M3", vendor: "Tech Store", category: "Computers", price: "Rs. 1,24,900", stock: 12, sales: 67, status: "Pending", image: "https://via.placeholder.com/40x40?text=💻" },
    { id: 4, name: "Nike Air Jordan 1", vendor: "Sports World", category: "Fashion", price: "Rs. 18,500", stock: 45, sales: 234, status: "Active", image: "https://via.placeholder.com/40x40?text=👟" },
    { id: 5, name: "Dell XPS 13", vendor: "Tech Store", category: "Computers", price: "Rs. 1,04,000", stock: 20, sales: 50, status: "Active", image: "https://via.placeholder.com/40x40?text=💻" },
    { id: 6, name: "Adidas Ultraboost", vendor: "Sports World", category: "Fashion", price: "Rs. 14,500", stock: 30, sales: 150, status: "Pending", image: "https://via.placeholder.com/40x40?text=👟" },
    { id: 7, name: "iPad Pro", vendor: "Tech Store", category: "Electronics", price: "Rs. 89,000", stock: 10, sales: 70, status: "Active", image: "https://via.placeholder.com/40x40?text=📱" },
    { id: 8, name: "Sony WH-1000XM5", vendor: "Mobile Zone", category: "Electronics", price: "Rs. 27,500", stock: 40, sales: 120, status: "Active", image: "https://via.placeholder.com/40x40?text=🎧" },
    { id: 9, name: "HP Spectre x360", vendor: "Tech Store", category: "Computers", price: "Rs. 1,10,000", stock: 15, sales: 35, status: "Pending", image: "https://via.placeholder.com/40x40?text=💻" },
    { id: 10, name: "Puma Running Shoes", vendor: "Sports World", category: "Fashion", price: "Rs. 12,500", stock: 25, sales: 80, status: "Active", image: "https://via.placeholder.com/40x40?text=👟" },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
          <p className="text-gray-500 text-sm">Manage all products across your platform</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex items-center gap-2">
          + Add New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Total Products</p>
          <h3 className="text-2xl font-bold">45,678</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Active Products</p>
          <h3 className="text-2xl font-bold text-green-600">42,156</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Out of Stock</p>
          <h3 className="text-2xl font-bold text-red-600">1,234</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Pending Approval</p>
          <h3 className="text-2xl font-bold text-yellow-600">2,288</h3>
        </div>
      </div>

      {/* Search + Filters + Export */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex gap-4 flex-1">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
          <select className="px-4 py-2 border rounded-lg">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Computers</option>
            <option>Fashion</option>
          </select>
          <select className="px-4 py-2 border rounded-lg">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Out of Stock</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
          <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3 border">Product</th>
              <th className="px-4 py-3 border">Vendor</th>
              <th className="px-4 py-3 border">Category</th>
              <th className="px-4 py-3 border">Price</th>
              <th className="px-4 py-3 border">Stock</th>
              <th className="px-4 py-3 border">Sales</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-3 border flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded" />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500">ID: #{p.id}</p>
                  </div>
                </td>
                <td className="px-4 py-3 border">{p.vendor}</td>
                <td className="px-4 py-3 border">
                  <span className="px-2 py-1 text-xs rounded bg-gray-100">{p.category}</span>
                </td>
                <td className="px-4 py-3 border font-medium">{p.price}</td>
                <td className="px-4 py-3 border text-green-600 font-semibold">{p.stock}</td>
                <td className="px-4 py-3 border">{p.sales}</td>
                <td className="px-4 py-3 border">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      p.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : p.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 border flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Eye size={18} />
                  </button>
                  <button className="text-green-500 hover:text-green-700">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
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

export default ProductManagement;
