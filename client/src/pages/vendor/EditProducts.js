// src/pages/vendor/EditProduct.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditProducts() {
  const { id } = useParams(); // URL se product ID
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    featured: false,
    status: "Active",
    image: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/vendor/product/${id}`);
        setProduct(res.data);

        // Fetch unique categories for dropdown
        const catRes = await axios.get("/api/vendor/categories");
        setCategories(catRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(`/api/vendor/product/${id}`, product); // update request
      setSaving(false);
      alert("Product updated successfully!");
      navigate("/vendor/all-products");
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert("Something went wrong!");
    }
  };

  if (loading) return <p className="p-4">Loading product...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={product.featured}
              onChange={handleChange}
              className="form-checkbox h-5 w-5"
            />
            Featured
          </label>

          <label className="flex items-center gap-2">
            Status:
            <select
              name="status"
              value={product.status}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block font-semibold mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
