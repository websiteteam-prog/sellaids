import React, { useState } from "react";
import { Link } from "react-router-dom";

const productsData = [
  { id: 1, image: "https://via.placeholder.com/50?text=Headphones", name: "Wireless Bluetooth Headphones", sku: "WBH001", category: "Electronics", price: 2999, stock: 24, featured: true, status: "Active" },
  { id: 2, image: "https://via.placeholder.com/50?text=Watch", name: "Smart Watch Pro", sku: "SWP002", category: "Electronics", price: 8999, stock: 15, featured: true, status: "Active" },
  { id: 3, image: "https://via.placeholder.com/50?text=Speaker", name: "Portable Bluetooth Speaker", sku: "PBS003", category: "Electronics", price: 1599, stock: 32, featured: false, status: "Active" },
  { id: 4, image: "https://via.placeholder.com/50?text=Charging", name: "Wireless Charging Pad", sku: "WCP004", category: "Electronics", price: 899, stock: 18, featured: false, status: "Active" },
  { id: 5, image: "https://via.placeholder.com/50?text=Case", name: "Premium Phone Case", sku: "PPC005", category: "Electronics", price: 599, stock: 45, featured: true, status: "Active" },
];

export default function Products() {
  const [category, setCategory] = useState("All Categories");
  const [searchName, setSearchName] = useState("");
  const [searchSKU, setSearchSKU] = useState("");

  const categories = ["All Categories", "Electronics"];

  const filteredProducts = productsData.filter((product) => {
    const matchCategory = category === "All Categories" || product.category === category;
    const matchName = product.name.toLowerCase().includes(searchName.toLowerCase());
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
      <h1 className="text-2xl font-bold mb-3">Products</h1>
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
          <label className="block font-semibold mb-1">Product Name</label>
          <input
            type="text"
            placeholder="Product Name"
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
          <button className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700 flex items-center mb-2 sm:mb-0">
            Search
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800 flex items-center mb-2 sm:mb-0"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="min-w-[900px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-orange-600 text-white">
              <th className="py-3 px-4 text-left">SR.</th>
              <th className="py-3 px-4 text-left">IMAGE</th>
              <th className="py-3 px-4 text-left">NAME</th>
              <th className="py-3 px-4 text-left">SKU</th>
              <th className="py-3 px-4 text-left">CATEGORY</th>
              <th className="py-3 px-4 text-left">PRICE</th>
              <th className="py-3 px-4 text-left">STOCK</th>
              <th className="py-3 px-4 text-left">FEATURED</th>
              <th className="py-3 px-4 text-left">STATUS</th>
              <th className="py-3 px-4 text-left">EDIT</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                <td className="py-4 px-4 font-semibold">{index + 1}</td>
                <td className="py-4 px-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded" />
                </td>
                <td className="py-4 px-4 font-semibold">{product.name}</td>
                <td className="py-4 px-4 text-orange-600 cursor-pointer">{product.sku}</td>
                <td className="py-4 px-4">{product.category}</td>
                <td className="py-4 px-4 font-bold">₹{product.price.toLocaleString()}</td>
                <td className="py-4 px-4">{product.stock}</td>
                <td className="py-4 px-4">{product.featured ? "Yes" : "No"}</td>
                <td className="py-4 px-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">{product.status}</span>
                </td>
                <td className="py-4 px-4">
                  <Link to={`/edit-product/${product.id}`} className="text-orange-600 hover:text-orange-800 cursor-pointer p-1 rounded">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
