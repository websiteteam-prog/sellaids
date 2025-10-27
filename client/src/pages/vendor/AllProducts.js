import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchSKU, setSearchSKU] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const location = useLocation();

  const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo"));
  const vendorId = vendorInfo?.id;

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/product/categories-list", {
        withCredentials: true
      });
      setCategories([{ id: "", name: "All Categories" }, ...res.data.data]);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories. Please try again.");
    }
  }, []);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", 10);

      if (category) params.append("category_id", category);
      if (searchName || searchSKU) params.append("search", searchName || searchSKU);
      if (vendorId) params.append("vendor_id", vendorId);

      const res = await axios.get(
        `http://localhost:5000/api/product/products-list?${params.toString()}`,
        { withCredentials: true }
      );

      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [category, currentPage, searchName, searchSKU, vendorId]);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Refresh products when navigating back
  useEffect(() => {
    if (location.state?.refresh) {
      fetchProducts();
    }
  }, [location.state, fetchProducts]);

  const resetFilters = () => {
    setCategory("");
    setSearchName("");
    setSearchSKU("");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-3">My Products</h1>
      <nav className="text-sm mb-4 text-gray-600">
        Home &gt; <span className="text-orange-600 cursor-pointer">Products</span>
      </nav>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block font-semibold mb-1">Category</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block font-semibold mb-1">Model Name</label>
          <input
            type="text"
            placeholder="Search by model name"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block font-semibold mb-1">SKU</label>
          <input
            type="text"
            placeholder="Search by SKU"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={searchSKU}
            onChange={(e) => setSearchSKU(e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={fetchProducts}
            className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700"
          >
            Search
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading products...</p>
        ) : products.length > 0 ? (
          <>
            <table className="min-w-[1200px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="py-3 px-4 text-left">SR.</th>
                  <th className="py-3 px-4 text-left">SKU</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Group</th>
                  <th className="py-3 px-4 text-left">Brand</th>
                  <th className="py-3 px-4 text-left">Model</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Vendor</th>
                  <th className="py-3 px-4 text-left">Front Photo</th>
                  <th className="py-3 px-4 text-left">View</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                    <td className="py-4 px-4 font-semibold">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="py-4 px-4 text-orange-600 cursor-pointer">{product.sku}</td>
                    <td className="py-4 px-4">{product.category?.name || "N/A"}</td>
                    <td className="py-4 px-4">{product.product_group}</td>
                    <td className="py-4 px-4">{product.brand}</td>
                    <td className="py-4 px-4 font-semibold">{product.model_name}</td>
                    <td className="py-4 px-4 font-bold">
                      ₹{parseFloat(product.selling_price).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          product.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : product.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">{product.vendor?.name || "N/A"}</td>
                    <td className="py-4 px-4">
                      <img
                        src={product.front_photo}
                        alt="Front"
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        to={`/vendor/view-product/${product.id}`}
                        className="text-orange-600 hover:text-orange-800 cursor-pointer p-1 rounded"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t">
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center py-10 text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}