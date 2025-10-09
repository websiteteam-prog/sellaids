// src/pages/admin/ProductManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Trash2, Download } from "lucide-react";
import * as XLSX from "xlsx";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // View Product
  const openViewModal = (product) => setViewProduct(product);
  const closeViewModal = () => setViewProduct(null);

  // Edit Product
  const openEditModal = (product) => setEditProduct(product);
  const closeEditModal = () => setEditProduct(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const { id, ...data } = editProduct;
      await axios.put(`http://localhost:5000/api/products/${id}`, data);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
      closeEditModal();
    } catch (err) {
      console.error(err);
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex items-center gap-2"
        >
          <Download size={16} /> Export Excel
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
        />
        <button
          onClick={() => setCurrentPage(1)}
          className="px-4 py-2 bg-[#FF6A00] text-white rounded-lg hover:bg-orange-500"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border">Image</th>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">SKU</th>
              <th className="px-4 py-3 border">Category</th>
              <th className="px-4 py-3 border">Price</th>
              <th className="px-4 py-3 border">Stock</th>
              <th className="px-4 py-3 border">Sales</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  No products
                </td>
              </tr>
            ) : currentProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  No matching products
                </td>
              </tr>
            ) : (
              currentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded" />
                  </td>
                  <td className="px-4 py-3 border font-medium">{p.name}</td>
                  <td className="px-4 py-3 border">{p.sku || "-"}</td>
                  <td className="px-4 py-3 border">{p.category}</td>
                  <td className="px-4 py-3 border">{p.price}</td>
                  <td className="px-4 py-3 border">{p.stock}</td>
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
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openViewModal(p)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => openEditModal(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 size={18} />
                    </button>
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
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded hover:bg-gray-100 ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeViewModal}
            >
              ✕
            </button>
            <img
              src={viewProduct.image}
              alt={viewProduct.name}
              className="w-32 h-32 mx-auto rounded mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{viewProduct.name}</h3>
            <p><strong>SKU:</strong> {viewProduct.sku || "-"}</p>
            <p><strong>Category:</strong> {viewProduct.category}</p>
            <p><strong>Price:</strong> {viewProduct.price}</p>
            <p><strong>Stock:</strong> {viewProduct.stock}</p>
            <p><strong>Sales:</strong> {viewProduct.sales}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  viewProduct.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : viewProduct.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {viewProduct.status}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeEditModal}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={editProduct.name}
                onChange={handleEditChange}
                className="px-3 py-2 border rounded"
                placeholder="Product Name"
              />
              <input
                type="text"
                name="sku"
                value={editProduct.sku || ""}
                onChange={handleEditChange}
                className="px-3 py-2 border rounded"
                placeholder="SKU"
              />
              <input
                type="text"
                name="category"
                value={editProduct.category}
                onChange={handleEditChange}
                className="px-3 py-2 border rounded"
                placeholder="Category"
              />
              <input
                type="text"
                name="price"
                value={editProduct.price}
                onChange={handleEditChange}
                className="px-3 py-2 border rounded"
                placeholder="Price"
              />
              <input
                type="number"
                name="stock"
                value={editProduct.stock}
                onChange={handleEditChange}
                className="px-3 py-2 border rounded"
                placeholder="Stock"
              />
              <input
                type="number"
                name="sales"
                value={editProduct.sales}
                onChange={handleEditChange}
                className="px-3 py-2 border rounded"
                placeholder="Sales"
              />
              <select
                name="status"
                value={editProduct.status}
                onChange={handleEditChange}
                className="px-3 py-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <button
                onClick={handleSaveEdit}
                className="bg-[#FF6A00] text-white px-4 py-2 rounded hover:bg-orange-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
