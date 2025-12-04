import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

import useCartStore from "../../stores/useCartStore";
import { useUserStore } from "../../stores/useUserStore";
import { useCartActions } from "../../stores/useCartActions";

const CategoryPage = () => {
  const { "*": slugPath } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const loaderRef = useRef(null);

  const [selectedCondition, setSelectedCondition] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sort, setSort] = useState("default");

  const navigate = useNavigate();
  const location = useLocation();

  const { fetchCart } = useCartStore();
  const { isAuthenticated, isUserLoading } = useUserStore();
  const { setPendingAdd } = useCartActions();

  // Navigate function with productId
  const handleNavigate = (id) => {
    navigate(`/product-details/${id}`);
  };

  // Category + Product Fetch
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/category/product-category?path=${slugPath}`,
          { withCredentials: true }
        );

        const { success, data, message } = res.data;
        console.log(data);
        if (success && data) {
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
        console.error(" API error:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load category"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slugPath]);

  // 🛒 ADD TO CART
  const addToCartDirectly = async (product) => {
    if (isUserLoading || !isAuthenticated) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/cart`,
        { product_id: product._id },
        { withCredentials: true }
      );

      await fetchCart();
      toast.success(`${product.product_name} added to cart! 🛒`);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add to cart";
      toast.error(msg);

      if (error.response?.status === 401) {
        setPendingAdd({ product, from: location.pathname, type: "cart" });
        navigate("/UserAuth/UserLogin", {
          state: { from: location.pathname, addToCart: product._id },
        });
      }
    }
  };

  const handleAddToCart = (product) => {
    if (isUserLoading) {
      toast.error("Please wait...");
      return;
    }

    if (!isAuthenticated) {
      setPendingAdd({ product, from: location.pathname, type: "cart" });
      toast.error("Please log in to add to cart");
      navigate("/UserAuth/UserLogin", {
        state: { from: location.pathname, addToCart: product._id },
      });
      return;
    }

    addToCartDirectly(product);
  };

  // ❤️ ADD TO WISHLIST
  const addToWishlistDirectly = async (product) => {
    if (isUserLoading || !isAuthenticated) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/wishlist`,
        { product_id: product._id },
        { withCredentials: true }
      );
      toast.success(`${product.product_name} added to wishlist! ❤️`);
      navigate("/user/wishlist");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add to wishlist";
      toast.error(msg);

      if (error.response?.status === 401) {
        setPendingAdd({ product, from: location.pathname, type: "wishlist" });
        navigate("/UserAuth/UserLogin", {
          state: { from: location.pathname, addToWishlist: product._id },
        });
      }
    }
  };

  const handleWishlist = (product) => {
    if (isUserLoading) {
      toast.error("Please wait...");
      return;
    }

    if (!isAuthenticated) {
      setPendingAdd({ product, from: location.pathname, type: "wishlist" });
      toast.error("Please log in to add to wishlist");
      navigate("/UserAuth/UserLogin", {
        state: { from: location.pathname, addToWishlist: product._id },
      });
      return;
    }

    addToWishlistDirectly(product);
  };

  // Filtering + Sorting
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

  // Infinite Scroll
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

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-12">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-72 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );

  const availableConditions = [
    "new",
    "almost_new",
    "good",
    "hardly_ever_used",
    "satisfactory",
  ];
  const availableSizes = data?.filters?.sizes || [];

  return (
    <div className="flex flex-col md:flex-row gap-10 px-8 py-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* LEFT FILTER SIDEBAR */}
      <aside className="w-full md:w-1/4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-4 self-start h-fit min-h-screen">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
          Filters
        </h3>

        {/* Condition Filter */}
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
                    onChange={() =>
                      setSelectedCondition((prev) =>
                        prev.includes(cond)
                          ? prev.filter((c) => c !== cond)
                          : [...prev, cond]
                      )
                    }
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span className="capitalize font-medium">
                    {cond.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Size Filter */}
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
                    onChange={() =>
                      setSelectedSizes((prev) =>
                        prev.includes(size)
                          ? prev.filter((s) => s !== size)
                          : [...prev, size]
                      )
                    }
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span className="font-medium">{size}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* PRODUCTS SECTION */}
      <main className="flex-1 overflow-y-auto h-screen pr-3">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:underline text-blue-600">
            Home
          </Link>
          {" / "}
          <Link to="/shop" className="hover:underline text-blue-600">
            Shop
          </Link>
          {slugPath?.split("/").map((seg, i, arr) => {
            const path = arr.slice(0, i + 1).join("/");
            return (
              <span key={i}>
                {" / "}
                <Link
                  to={`/product-category/${path}`}
                  className="capitalize hover:underline text-blue-600"
                >
                  {seg.replace(/-/g, " ")}
                </Link>
              </span>
            );
          })}
        </nav>

        {/* Sort + Count */}
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

        {/* PRODUCT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts?.slice(0, visibleCount).map((product) => {
            // 🧩 Parse product_additionalInfo safely
            let additionalInfo = {};
            try {
              additionalInfo = JSON.parse(
                product?.product_additionalInfo || "{}"
              );
            } catch (err) {
              console.error("Invalid JSON in additionalInfo", err);
            }

            return (
              <div
                key={product._id}
                className="group overflow-hidden border-gray-100 transition-all duration-300"
              >
                <div className="relative bg-gray-50">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${product?.product_img}`}
                    alt={product.product_name}
                    className="object-cover w-full h-80 rounded-t-xl transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />

                  {/* Hover Icons */}
                  <div className="absolute inset-0 flex justify-center items-end gap-3 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out pb-4">
                    <button
                      onClick={() => handleWishlist(product)}
                      className="bg-black p-3 rounded-md text-white hover:bg-orange-500 transition duration-200"
                    >
                      <FaHeart className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-black p-3 rounded-md text-white hover:bg-orange-500 transition duration-200"
                    >
                      <FaShoppingCart className="text-lg" />
                    </button>
                  </div>
                </div>

                <div className="py-5 ps-1 text-start">
                  <h3
                    className="text-base font-normal text-gray-800 hover:text-blue-700 transition cursor-pointer"
                    onClick={() => handleNavigate(product._id)}
                  >
                    {additionalInfo.description}
                  </h3>

                  <div className="mt-2">
                    <span className="text-base font-thin text-gray-900">
                      ₹{product.product_price}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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