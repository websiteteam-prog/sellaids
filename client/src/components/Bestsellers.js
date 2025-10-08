import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Bestsellers() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/bestsellers");
        setProducts(res.data); // assuming API returns array of products
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">Loading bestsellers...</div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        No bestseller products available right now.
      </div>
    );
  }

  return (
    <div className="bg-white py-6 px-4 sm:px-8 lg:px-16">
      <h2 className="text-5xl font-heading text-black leading-tight text-center mt-0 mb-6 md:mb-12">
        Bestseller
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="relative bg-white border border-gray-200 shadow-sm rounded overflow-hidden cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative">
              <img
                src={product.image || product.imgUrl}
                alt={product.title}
                className="w-full h-[400px] object-cover"
              />

              {/* Hover Icons */}
              <div
                className={`absolute top-1/2 right-0 py-5 transform -translate-y-1/2 bg-white border-l border-gray-300 px-2 flex flex-col space-y-4 shadow-md transition-transform duration-300 ${
                  hoveredIndex === index ? "translate-x-0" : "translate-x-full"
                }`}
                style={{ borderRadius: 0, width: "44px", zIndex: 10 }}
              >
                {[
                  {
                    label: "Add to Wishlist",
                    Icon: Heart,
                    onClick: () =>
                      alert(`Added "${product.title}" to wishlist!`),
                  },
                  {
                    label: "Add to Cart",
                    Icon: ShoppingCart,
                    onClick: () => navigate("/AddToCart"),
                  },
                  {
                    label: "View Details",
                    Icon: Eye,
                    onClick: () => navigate(`/product/${product.id}`),
                  },
                ].map(({ label, Icon, onClick }) => (
                  <button
                    key={label}
                    aria-label={label}
                    onClick={onClick}
                    className="text-black hover:text-orange-600 transition-colors"
                    style={{ padding: 0 }}
                  >
                    <Icon size={24} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-800">
                <a
                  href={`/product/${product.id}`}
                  className="hover:text-orange-600 transition-colors"
                >
                  {product.title}
                </a>
              </h3>
              <p className="text-base font-semibold text-black mt-2">
                ₹{product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bestsellers;
