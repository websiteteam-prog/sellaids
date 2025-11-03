// src/components/ProductSearchOverlayModal.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, X, Package } from "lucide-react";

const ProductSearchOverlayModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Focus input when opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // API Search with Debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/search`,
          {
            params: { search: query },
            withCredentials: true,
          }
        );

        console.log("Search API Response:", res.data); // DEBUG

        if (res.data.success && Array.isArray(res.data.data)) {
          setResults(res.data.data);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search Error:", err.response?.data || err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Search Products</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100 transition-all">
            <Search size={22} className="text-gray-500 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name, category, or SKU..."
              className="flex-1 outline-none text-lg font-medium text-gray-800"
            />
            {loading && (
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Results */}
          {query && (
            <div className="mt-3 max-h-96 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50">
              {results.length > 0 ? (
                results.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-4 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                    onClick={() => {
                      window.location.href = `/product-details/${product.id}`;
                      onClose();
                    }}
                  >
                    {/* Image */}
                    {product.front_photo ? (
                      <img
                        src={product.front_photo}
                        alt={product.model_name || product.product_type}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/48?text=No+Img";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                        <Package size={20} />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {product.model_name || product.product_type || product.sku || "Unnamed Product"}
                      </p>
                      <p className="text-sm text-gray-600">
                        SKU: {product.sku || "N/A"}
                      </p>
                      {product.selling_price && (
                        <p className="text-sm text-gray-800 font-medium">
                          ₹{parseFloat(product.selling_price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-8 text-center text-gray-500">
                  {loading ? "Searching..." : "No products found"}
                </p>
              )}
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
};

export default ProductSearchOverlayModal;