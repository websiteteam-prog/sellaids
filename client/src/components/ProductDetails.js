// src/components/ProductDetails.js
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Star,
  StarHalf,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import api from "../api/axiosInstance";
import { useUserStore } from "../stores/useUserStore";
import { useCartActions } from "../stores/useCartActions";
import { toast } from "react-hot-toast";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id = parseInt(productId);

  const { isAuthenticated, isUserLoading, user } = useUserStore();
  const { setPendingAdd } = useCartActions();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, text: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;
  const [carouselStart, setCarouselStart] = useState(0);
  const visibleCount = 4;

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, location.key]);

  // Fetch Product + Reviews
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!id) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // === Fetch Product ===
        const productRes = await api.get(`/api/product/products/${id}`);
        if (!productRes.data.success || !productRes.data.product) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        const raw = productRes.data.product;
        const mappedProduct = {
          id: raw.id,
          name: raw.model_name || raw.product_type || "Unnamed Product",
          sku: raw.sku || "N/A",
          price: parseFloat(raw.selling_price) || 0,
          original_price: parseFloat(raw.purchase_price) || null,
          description: raw.additional_info || "No description available.",
          images: [],
          colors: raw.product_color
            ? [{ hex: getColorHex(raw.product_color), name: raw.product_color }]
            : [],
          sizes: raw.size && raw.size !== "Other" ? [raw.size] : [],
          condition: raw.product_condition || "Not specified",
          rating: 0,
          review_count: 0,
        };

        if (raw.front_photo) mappedProduct.images.push(raw.front_photo);
        if (raw.more_images) {
          try {
            const extra = JSON.parse(raw.more_images);
            if (Array.isArray(extra)) {
              mappedProduct.images.push(
                ...extra.map((img) =>
                  img.startsWith("http")
                    ? img
                    : `${process.env.REACT_APP_API_URL}${img}`
                )
              );
            }
          } catch (e) {}
        }

        if (productRes.data.relatedProducts) {
          setRelatedProducts(
            productRes.data.relatedProducts.map((p) => ({
              id: p.id,
              name: p.model_name || p.product_type,
              price: parseFloat(p.selling_price),
              image: p.front_photo || "https://via.placeholder.com/300",
              rating: 4.5,
            }))
          );
        }

        setProduct(mappedProduct);

        // === Fetch Reviews ===
        try {
          const reviewRes = await api.get(`/api/user/review/product/${id}`);
          // console.log("GET Reviews Raw Response:", reviewRes.data);

          if (
            reviewRes.data.success &&
            reviewRes.data.data &&
            Array.isArray(reviewRes.data.data.reviews)
          ) {
            const formatted = reviewRes.data.data.reviews.map((r) => ({
              // YEHI LINE CHANGE KI HAI → user.name ya user_name dono se naam le
              author: r.user?.name?.trim() || r.user_name?.trim() || "Anonymous",
              date: new Date(r.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              rating: parseInt(r.rating),
              text: r.review_text || "",
            }));

            setReviews(formatted);

            const avg = formatted.reduce((s, r) => s + r.rating, 0) / (formatted.length || 1);
            setProduct((p) => ({
              ...p,
              rating: formatted.length ? avg : 0,
              review_count: formatted.length,
            }));
          } else {
            setReviews([]);
          }
        } catch (e) {
          console.error("GET Reviews Failed:", e.response?.data || e);
          setReviews([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id, location.key]);

  // === Helpers ===
  const getColorHex = (c) => {
    const map = {
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#22c55e",
      black: "#000000",
      white: "#ffffff",
      yellow: "#eab308",
      purple: "#a855f7",
      pink: "#ec4899",
    };
    return map[c?.toLowerCase()] || "#6b7280";
  };

  const getUnifiedBadge = (text, bgColor = null) => {
    const v = text?.trim();
    if (bgColor)
      return (
        <span
          className="inline-block px-3 py-1.5 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: bgColor }}
        >
          {v || "N/A"}
        </span>
      );
    if (v && v !== "N/A" && v !== "Not specified")
      return (
        <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
          {v}
        </span>
      );
    return (
      <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        N/A
      </span>
    );
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating || 0);
    const half = (rating || 0) % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) =>
          i < full ? (
            <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
          ) : i === full && half ? (
            <StarHalf key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
          ) : (
            <Star key={i} className="w-4 h-4 text-gray-300" />
          )
        )}
      </div>
    );
  };

  // === Cart / Wishlist / Share ===
  const handleAddToCart = async () => {
    if (isUserLoading) return toast.error("Please wait...");
    if (!isAuthenticated) {
      setPendingAdd({ product, from: location.pathname });
      toast.error("Please log in to add to cart");
      navigate("/UserAuth/UserLogin", {
        state: { from: location.pathname, addToCart: product.id },
      });
      return;
    }
    try {
      await api.post("/api/user/cart", { product_id: product.id, quantity });
      toast.success(`${product.name} added to cart!`);
      navigate("/user/checkout");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (isUserLoading) return;
    if (!isAuthenticated) {
      toast.error("Please log in to add to wishlist");
      navigate("/UserAuth/UserLogin", { state: { from: location.pathname } });
      return;
    }
    try {
      await api.post("/api/user/wishlist", { product_id: product.id });
      toast.success("Added to wishlist!", {
        icon: <Heart className="w-5 h-5 fill-red-500 text-red-500" />,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = product.name;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { fallbackShare(url, title); }
    } else fallbackShare(url, title);
  };
  const fallbackShare = (url, title) => {
    const text = `Check out: ${title} - ${url}`;
    const w = `https://wa.me/?text=${encodeURIComponent(text)}`;
    const f = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    const t = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    const win = window.open("", "_blank", "width=600,height=400");
    win.document.write(`
      <div style="padding:20px;font-family:Arial;text-align:center;">
        <h3>Share Product</h3>
        <a href="${w}" target="_blank" style="display:inline-block;margin:10px;padding:10px 20px;background:#25D366;color:white;border-radius:5px;text-decoration:none;">WhatsApp</a>
        <a href="${f}" target="_blank" style="display:inline-block;margin:10px;padding:10px 20px;background:#1877F2;color:white;border-radius:5px;text-decoration:none;">Facebook</a>
        <a href="${t}" target="_blank" style="display:inline-block;margin:10px;padding:10px 20px;background:#1DA1F2;color:white;border-radius:5px;text-decoration:none;">Twitter</a>
      </div>
    `);
  };

  // === Submit Review ===
  const handleAddReview = async () => {
    if (!newReview.text.trim()) {
      toast.error("Review text is required");
      return;
    }

    try {
      const payload = {
        product_id: id,
        rating: newReview.rating,
        review_text: newReview.text.trim(),
      };

      const res = await api.post("/api/user/review", payload);
      console.log("POST Review Response:", res.data);

      if (res.data.success) {
        const newRev = {
          author: user?.name?.trim() || "You",
          date: "Just now",
          rating: newReview.rating,
          text: newReview.text.trim(),
        };
        setReviews((prev) => [newRev, ...prev]);
        setNewReview({ rating: 5, text: "" });
        setShowReviewForm(false);
        setCurrentPage(1);

        const total = reviews.length + 1;
        const sum = reviews.reduce((s, r) => s + r.rating, 0) + newReview.rating;
        setProduct((p) => ({
          ...p,
          rating: sum / total,
          review_count: total,
        }));

        toast.success("Review submitted!");
      }
    } catch (err) {
      console.error("POST Review Failed:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  // === Carousel ===
  const nextSlide = () => {
    if (carouselStart < relatedProducts.length - visibleCount)
      setCarouselStart((c) => c + 1);
  };
  const prevSlide = () => {
    if (carouselStart > 0) setCarouselStart((c) => c - 1);
  };

  // === Pagination ===
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // === Render ===
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600"></div>
        <p className="mt-4">Loading product...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Product Grid */}
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-sm">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[mainImgIdx] || "https://via.placeholder.com/600x600/f3f3f3/999?text=No+Image"}
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
              onError={(e) => (e.target.src = "https://via.placeholder.com/600x600/f3f3f3/999?text=Error")}
            />
            <button
              onClick={() =>
                setMainImgIdx((i) => (i - 1 + product.images.length) % product.images.length)
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setMainImgIdx((i) => (i + 1) % product.images.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setMainImgIdx(i)}
                className={`flex-shrink-0 w-20 h-20 rounded-md border-2 overflow-hidden ${
                  mainImgIdx === i ? "border-orange-500 ring-2 ring-orange-300" : "border-gray-300"
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>

          <div className="flex items-center gap-2">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600">({product.review_count} reviews)</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-600">
              ₹{product.price.toLocaleString()}
            </span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-lg line-through text-gray-400">
                  ₹{product.original_price.toLocaleString()}
                </span>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                  {Math.round(
                    ((product.original_price - product.price) / product.original_price) * 100
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Info Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 flex-1 justify-center sm:justify-start">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 uppercase font-medium">Condition</p>
                <div className="mt-1.5">{getUnifiedBadge(product.condition)}</div>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-gray-300 self-stretch" />

            <div className="flex items-center gap-3 flex-1 justify-center">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-medium">Color</p>
                <div className="mt-1.5">
                  {getUnifiedBadge(product.colors[0]?.name || "N/A", product.colors[0]?.hex)}
                </div>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-gray-300 self-stretch" />

            <div className="flex items-center gap-3 flex-1 justify-center sm:justify-end">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </div>
              <div className="text-center sm:text-center">
                <p className="text-xs text-gray-500 uppercase font-medium">Size</p>
                <div className="mt-1.5">{getUnifiedBadge(product.sizes[0] || "N/A")}</div>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 border rounded-md hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 border rounded-md hover:bg-gray-50"
            >
              +
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-orange-600 text-white py-3 rounded-md font-medium hover:bg-orange-700"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className="p-3 border rounded-md hover:bg-red-50 transition-all duration-200 group"
              title="Add to Wishlist"
            >
              <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 group-hover:fill-red-500 transition-all duration-200" />
            </button>
            <button
              onClick={handleShare}
              className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5 text-gray-700 hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>

          {isAuthenticated ? (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
            >
              Write a Review
            </button>
          ) : (
            <button
              onClick={() => setShowLoginPrompt(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
            >
              Login to Review
            </button>
          )}
        </div>

        {/* Login Prompt */}
        {showLoginPrompt && !isAuthenticated && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
              <h3 className="text-xl font-bold mb-3">Login Required</h3>
              <p className="text-sm text-gray-600 mb-5">
                You need to be logged in to write a review.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigate("/UserAuth/UserLogin", {
                      state: { from: location.pathname },
                    });
                  }}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 font-medium"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 border py-2 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && isAuthenticated && (
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <div className="mb-3">
              <p className="text-sm mb-1">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setNewReview({ ...newReview, rating: s })}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= newReview.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Share your experience..."
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              rows={3}
              className="w-full mb-3 p-2 border rounded-md resize-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddReview}
                className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm flex items-center gap-1 hover:bg-orange-700"
              >
                <Send className="w-4 h-4" /> Submit
              </button>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setNewReview({ rating: 5, text: "" });
                }}
                className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Review List */}
        <div className="space-y-6">
          {paginatedReviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            paginatedReviews.map((r, i) => (
              <div key={i} className="border-b pb-6 last:border-0">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-medium">{r.author}</p>
                    <p className="text-sm text-gray-500">{r.date}</p>
                  </div>
                  {renderStars(r.rating)}
                </div>
                <p className="text-gray-700">{r.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full font-medium ${
                  currentPage === i + 1
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${carouselStart * 26.5}%)`,
                  width: `${relatedProducts.length * 26.5}%`,
                }}
              >
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex-shrink-0"
                    style={{ width: "calc(25% - 18px)" }}
                  >
                    <div
                      onClick={() => {
                        navigate(`/product-details/${p.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg cursor-pointer transition-shadow h-full flex flex-col"
                    >
                      <div className="bg-gray-100 rounded-xl w-full h-64 mb-3 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">{p.name}</h3>
                      <div className="flex items-center gap-1 mt-1">{renderStars(p.rating)}</div>
                      <p className="text-lg font-bold text-orange-600 mt-2">
                        ₹{p.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              disabled={carouselStart === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md disabled:opacity-50 hover:bg-gray-100 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={carouselStart >= relatedProducts.length - visibleCount}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md disabled:opacity-50 hover:bg-gray-100 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;