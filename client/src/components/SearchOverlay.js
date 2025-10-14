import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && query.trim()) {
      handleSearch();
    } else if (!isOpen) {
      setQuery("");
      setResults([]);
      setError("");
    }
  }, [isOpen, query]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/search?q=${encodeURIComponent(query)}`
      );
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-start z-50 p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl transform transition-all duration-400 ease-in-out">
        <div className="relative p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <X size={28} />
          </button>

          {/* Search Form */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search products, categories, or keywords..."
              className="w-full sm:w-4/5 px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-200 shadow-md"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-200 flex items-center justify-center disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="w-6 h-6 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v6l4 2m-6-6l-4 2m8-2l-4-2m0 12v-6l4-2m-6 6l4-2"
                  />
                </svg>
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto border-t border-gray-200">
            {loading && (
              <div className="flex justify-center py-8">
                <svg
                  className="w-7 h-7 text-gray-500 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v6l4 2m-6-6l-4 2m8-2l-4-2m0 12v-6l4-2m-6 6l4-2"
                  />
                </svg>
              </div>
            )}
            {error && (
              <p className="text-center text-red-600 py-8 font-medium">{error}</p>
            )}

            {!loading && !error && results.length > 0 && (
              <ul className="divide-y divide-gray-100">
                {results.map((item, index) => (
                  <li
                    key={index}
                    className="py-5 px-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {!loading && !error && results.length === 0 && query.trim() && (
              <p className="text-center text-gray-500 py-8">
                No results found for "{query}".
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;