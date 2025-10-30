import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const CategoryPage = () => {
  const { "*": slugPath } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const loaderRef = useRef(null);

  const [selectedCondition, setSelectedCondition] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sort, setSort] = useState("default");

  const pathSegments = slugPath ? slugPath.split("/") : [];

  // 🧠 Category + Product Fetch
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/category/product-category?path=${slugPath}`,
          { withCredentials: true }
        );

        const { success, data, message } = res.data;
        console.log("API Response:", data);

        if (success && data) {
          // toast.success(message || "Category loaded successfully 🎉");
          setData({
            category: data.category || {},
            subCategories: data.subCategories || [],
            products: data.products || [],
            filters: data.filters || {},
          });
        } else {
          toast.error(message || "No data found for this category.");
        }
      } catch (error) {
        console.error("❌ API error:", error);
        if (error.response) {
          toast.error(
            error.response.data?.message ||
              `Server Error (${error.response.status})`
          );
        } else if (error.request) {
          toast.error("No response from server. Please check your connection.");
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slugPath]);

  // 🧠 Filtered + Sorted Products
  const filteredProducts = data?.products?.filter((p) => {
    const conditionMatch =
      selectedCondition.length === 0 ||
      selectedCondition.includes(p.product_condition);

    const sizeValue =
      p.size === "Other" && p.size_other ? p.size_other : p.size;
    const sizeMatch =
      selectedSizes.length === 0 ||
      selectedSizes.includes(sizeValue) ||
      (p.size === "Other" && selectedSizes.includes(p.size_other));

    return conditionMatch && sizeMatch;
  });

  const sortedProducts = filteredProducts?.sort((a, b) => {
    if (sort === "low") return a.product_price - b.product_price;
    if (sort === "high") return b.product_price - a.product_price;
    return 0;
  });

  // 🧠 Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            prev + 10 > sortedProducts.length
              ? sortedProducts.length
              : prev + 10
          );
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [sortedProducts]);

  // Toggle Filters
  const toggleCondition = (cond) => {
    setSelectedCondition((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // 🧱 Loading Skeleton
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-72 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-12">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );

  // 🧩 Available Filters
  const availableConditions = ["new", "like_new", "used", "damaged"];
  const availableSizes = data?.filters?.sizes || [];

  return (
    <div className="flex flex-col md:flex-row gap-10 px-8 py-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Left Filter Sidebar */}
      <aside className="w-full md:w-1/4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-4 self-start h-fit min-h-screen">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
          Filters
        </h3>

        {/* 🔹 Condition Filter */}
        {availableConditions.length > 0 && (
          <div className="mb-8">
            <p className="font-semibold text-gray-700 mb-3 text-lg">
              Condition
            </p>
            <div className="space-y-3 text-base">
              {availableConditions.map((cond) => (
                <label
                  key={cond}
                  className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedCondition.includes(cond)}
                    onChange={() => toggleCondition(cond)}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span className="capitalize font-medium">
                    {cond.replace("_", " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 🔹 Size Filter (Dynamic from backend) */}
        {availableSizes.length > 0 && (
          <div className="mb-8">
            <p className="font-semibold text-gray-700 mb-3 text-lg">Size</p>
            <div className="space-y-3 text-base">
              {availableSizes.map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => toggleSize(size)}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span className="font-medium">{size}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right Products Section */}
      <main className="flex-1 overflow-y-auto h-screen pr-3">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:underline text-blue-600">
            Home
          </Link>
          {" / "}
          <Link to="/shop" className="hover:underline text-blue-600">
            Shop
          </Link>
          {pathSegments.map((seg, i) => {
            const path = pathSegments.slice(0, i + 1).join("/");
            const name = seg.replace(/-/g, " ");
            return (
              <span key={i}>
                {" / "}
                <Link
                  to={`/product-category/${path}`}
                  className="capitalize hover:underline text-blue-600"
                >
                  {name}
                </Link>
              </span>
            );
          })}
        </nav>

        {/* Sort & Count */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <p className="text-gray-700 text-lg font-semibold">
            Showing {Math.min(visibleCount, sortedProducts.length)} of{" "}
            {sortedProducts.length} products
          </p>

          <div className="flex items-center gap-2 text-base">
            <label className="text-gray-600 font-medium">Sort by:</label>
            <select
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="default">Default sorting</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts?.slice(0, visibleCount).map((product) => (
            <div
              key={product._id}
              className="group overflow-hidden border-gray-100 transition-all duration-300"
            >
              <div className="relative bg-gray-50">
                <img
                  src={
                    product?.product_img
                      ? product?.product_img
                      : "https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/2748/2748558.png";
                  }}
                  className="object-cover w-full h-72 rounded-t-xl transition-transform duration-500 ease-in-out group-hover:scale-105"
                />

                {/* Hover Icons */}
                <div className="absolute inset-0 flex justify-center items-end gap-3 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out pb-4">
                  <button className="bg-black p-3 rounded-md text-white hover:bg-orange-500 transition duration-200">
                    <FaHeart className="text-lg" />
                  </button>
                  <button className="bg-black p-3 rounded-md text-white hover:bg-orange-500 transition duration-200">
                    <FaShoppingCart className="text-lg" />
                  </button>
                </div>
              </div>

              <div className="py-5 ps-1 text-start">
                <h3 className="text-base font-semibold text-gray-800 hover:text-blue-700 transition">
                  {product?.product_name}
                </h3>
                <h3 className="text-base font-semibold text-gray-800 hover:text-blue-700 transition">
                  {product?.description}
                </h3>
                <div className="mt-2">
                  {product.original_price && (
                    <span className="line-through text-gray-400 mr-2 text-sm">
                      ₹{product.original_price}
                    </span>
                  )}
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.product_price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite Scroll Loader */}
        {visibleCount < sortedProducts.length && (
          <div ref={loaderRef} className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
