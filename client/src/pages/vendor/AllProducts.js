import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All Categories"]);
  const [category, setCategory] = useState("All Categories");
  const [searchName, setSearchName] = useState("");
  const [searchSKU, setSearchSKU] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo"));
  const vendorId = vendorInfo?.id;

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/vendor/products/${vendorId}`, {
        withCredentials: true,
      });
      setProducts(res.data);

      // Extract unique categories for dropdown
      const uniqueCategories = [
        "All Categories",
        ...new Set(res.data.map((p) => p.productCategory)),
      ];
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [vendorId]);

  // Refresh products when navigating back from AddProductForm
  useEffect(() => {
    if (location.state?.refresh) {
      fetchProducts();
    }
  }, [location.state]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchCategory =
      category === "All Categories" || product.productCategory === category;
    const matchName = product.modelName.toLowerCase().includes(searchName.toLowerCase());
    const matchSKU = product.sku.toLowerCase().includes(searchSKU.toLowerCase());
    return matchCategory && matchName && matchSKU;
  });

  const resetFilters = () => {
    setCategory("All Categories");
    setSearchName("");
    setSearchSKU("");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-3">My Products</h1>
      <nav className="text-sm mb-4 text-gray-600">
        Home &gt; <span className="text-orange-600 cursor-pointer">Products</span>
      </nav>

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
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block font-semibold mb-1">Model Name</label>
          <input
            type="text"
            placeholder="Model Name"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block font-semibold mb-1">SKU</label>
          <input
            type="text"
            placeholder="SKU"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={searchSKU}
            onChange={(e) => setSearchSKU(e.target.value)}
          />
        </div>

        <div className="flex space-x-2 mt-4 sm:mt-6 flex-wrap">
          <button className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700 mb-2 sm:mb-0">
            Search
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800 mb-2 sm:mb-0"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="py-3 px-4 text-left">SR.</th>
                <th className="py-3 px-4 text-left">SKU</th>
                <th className="py-3 px-4 text-left">MODEL</th>
                <th className="py-3 px-4 text-left">BRAND</th>
                <th className="py-3 px-4 text-left">PRICE</th>
                <th className="py-3 px-4 text-left">STATUS</th>
                <th className="py-3 px-4 text-left">VIEW</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id || product.id} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                  <td className="py-4 px-4 font-semibold">{index + 1}</td>
                  <td className="py-4 px-4 text-orange-600 cursor-pointer">{product.sku}</td>
                  <td className="py-4 px-4 font-semibold">{product.modelName}</td>
                  <td className="py-4 px-4">{product.brand}</td>
                  <td className="py-4 px-4 font-bold">₹{product.price.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        product.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : product.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Link
                      to={`/vendor/view-product/${product._id || product.id}`}
                      className="text-orange-600 hover:text-orange-800 cursor-pointer p-1 rounded"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-10 text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}