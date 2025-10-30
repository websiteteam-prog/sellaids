// src/components/ProductDetails.js
import { useState, useEffect } from "react";
import {
  Star,
  StarHalf,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import api from "../api/axiosInstance"; // Correct path after moving api/ inside src/

const ProductDetails = ({ productId = 2 }) => {
  // ==================== MOCK REVIEWS (API not available) ====================
  const [allReviews, setAllReviews] = useState([
    { author: "Sarah Johnson", date: "2 weeks ago", rating: 5, text: "Absolutely stunning quality! The leather is incredibly soft and the craftsmanship is exceptional. Worth every penny!" },
    { author: "Michael Chen", date: "1 month ago", rating: 5, text: "Perfect everyday bag. Great size, beautiful design, and very durable." },
    { author: "Emma Davis", date: "1 month ago", rating: 4, text: "Love the bag but the strap could be a bit longer. Otherwise perfect!" },
    { author: "James Lee", date: "1 week ago", rating: 5, text: "Premium quality! Looks even better in person." },
    { author: "Priya Sharma", date: "3 weeks ago", rating: 5, text: "Best purchase ever. Highly recommend!" },
    { author: "Alex Kim", date: "2 months ago", rating: 4, text: "Good, but shipping was slow." },
    { author: "Nina Patel", date: "1 month ago", rating: 5, text: "Luxurious feel. Worth the price." },
    { author: "Tom Brown", date: "5 days ago", rating: 3, text: "Average. Expected better stitching." },
    { author: "Lisa Wong", date: "1 week ago", rating: 5, text: "Gifted it. She loved it!" },
    { author: "Rahul Verma", date: "2 weeks ago", rating: 4, text: "Nice, but color slightly different." },
  ]);

  const relatedProducts = [
    { id: 1, name: "Leather Wallet", price: 89, oldPrice: 120, rating: 4.7 },
    { id: 2, name: "Crossbody Bag", price: 149, oldPrice: 200, rating: 4.8 },
    { id: 3, name: "Leather Belt", price: 59, oldPrice: 80, rating: 4.6 },
    { id: 4, name: "Tote Bag", price: 179, oldPrice: 250, rating: 4.9 },
    { id: 5, name: "Card Holder", price: 39, oldPrice: 60, rating: 4.5 },
    { id: 6, name: "Sling Bag", price: 99, oldPrice: 150, rating: 4.7 },
  ];

  // ==================== API STATE ====================
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==================== UI STATE ====================
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImgIdx, setMainImgIdx] = useState(0);

  // Review Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);
  const paginatedReviews = allReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // Add Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ author: "", rating: 5, text: "" });

  // ==================== FETCH PRODUCT ====================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/product/products/${productId}`);
        
        if (response.data.success) {
          const apiProduct = response.data.data.product;
          setProduct(apiProduct);

          // Set default color & size after load
          if (apiProduct.colors && apiProduct.colors.length > 0) {
            setSelectedColor(apiProduct.colors[0]);
          }
          if (apiProduct.sizes && apiProduct.sizes.length > 0) {
            setSelectedSize(apiProduct.sizes[0]);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ==================== HANDLE ADD REVIEW ====================
  const handleAddReview = () => {
    if (newReview.author && newReview.text) {
      const updatedReviews = [
        { ...newReview, date: "Just now" },
        ...allReviews,
      ];
      setAllReviews(updatedReviews);
      setNewReview({ author: "", rating: 5, text: "" });
      setShowReviewForm(false);
      setCurrentPage(1);
    }
  };

  // ==================== CAROUSEL LOGIC ====================
  const [carouselStart, setCarouselStart] = useState(0);
  const visibleCount = 4;

  const nextSlide = () => {
    if (carouselStart < relatedProducts.length - visibleCount) {
      setCarouselStart(carouselStart + 1);
    }
  };

  const prevSlide = () => {
    if (carouselStart > 0) {
      setCarouselStart(carouselStart - 1);
    }
  };

  // ==================== RENDER STARS ====================
  const renderStars = (rating, size = "sm") => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star
            key={i}
            className={`${
              size === "sm" ? "w-4 h-4" : "w-5 h-5"
            } fill-orange-500 text-orange-500`}
          />
        ))}

        {half && (
          <StarHalf
            className={`${
              size === "sm" ? "w-4 h-4" : "w-5 h-5"
            } fill-orange-500 text-orange-500`}
          />
        )}

        {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${
              size === "sm" ? "w-4 h-4" : "w-5 h-5"
            } text-gray-400`}
          />
        ))}
      </div>
    );
  };

  // ==================== LOADING & ERROR ====================
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">{error || "Product not found"}</p>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* ==================== PRODUCT SECTION ==================== */}
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-sm">
        {/* ---- Images ---- */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[mainImgIdx]}
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
            />
            <button
              onClick={() =>
                setMainImgIdx((i) => (i - 1 + product.images.length) % product.images.length)
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full hover:bg-white shadow-md transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={() => setMainImgIdx((i) => (i + 1) % product.images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full hover:bg-white shadow-md transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setMainImgIdx(i)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                  mainImgIdx === i ? "border-orange-500 ring-2 ring-orange-300" : "border-gray-300"
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ---- Details ---- */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>

          <div className="flex items-center gap-2">
            {renderStars(product.rating || 0)}
            <span className="text-sm text-gray-600">({product.review_count || 0} reviews)</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-600">
              ₹{product.price?.toFixed(2)}
            </span>
            {product.original_price > product.price && (
              <>
                <span className="text-lg line-through text-gray-400">
                  ₹{product.original_price?.toFixed(2)}
                </span>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                  {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Color */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="font-medium mb-2 text-gray-800">Color</p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor?.hex === c.hex
                        ? "border-orange-500 ring-2 ring-orange-300"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <p className="font-medium mb-2 text-gray-800">Size</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === s
                        ? "bg-orange-600 text-white border-orange-600"
                        : "border-gray-300 hover:border-orange-400 text-gray-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition"
            >
              -
            </button>
            <span className="w-12 text-center font-medium text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition"
            >
              +
            </button>
          </div>

          {/* ADD TO CART + WISHLIST + SHARE */}
          <div className="flex gap-3 mt-4">
            <button className="flex-1 bg-orange-600 text-white py-3 rounded-md font-medium hover:bg-orange-700 transition shadow-sm">
              Add to Cart
            </button>
            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition">
              <Heart className="w-5 h-5 text-gray-700 hover:text-orange-600" />
            </button>
            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition">
              <Share2 className="w-5 h-5 text-gray-700 hover:text-orange-600" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================== CUSTOMER REVIEWS ==================== */}
      <section className="mt-16 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition"
          >
            Write a Review
          </button>
        </div>

        {showReviewForm && (
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3 text-gray-800">Share Your Experience</h3>
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.author}
              onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
              className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
            />
            <div className="mb-3">
              <p className="text-sm text-gray-700 mb-1">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="hover:scale-110 transition"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating
                          ? "fill-orange-500 text-orange-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Write your review..."
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              rows={3}
              className="w-full mb-3 p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddReview}
                className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 flex items-center gap-1 transition"
              >
                <Send className="w-4 h-4" /> Submit
              </button>
              <button
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Rating Summary */}
        <div className="flex items-center gap-6 mb-8">
          <div className="text-5xl font-bold text-orange-600">
            {(allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length).toFixed(1)}
          </div>
          <div>
            {renderStars(allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length, "lg")}
            <p className="text-sm text-gray-600 mt-1">Based on {allReviews.length} reviews</p>
          </div>

          <div className="flex-1 max-w-md space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = allReviews.filter((r) => Math.floor(r.rating) === star).length;
              const percent = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3">{star}</span>
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {paginatedReviews.map((r, i) => (
            <div key={i} className="border-b pb-6 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{r.author}</p>
                  <p className="text-sm text-gray-500">{r.date}</p>
                </div>
                {renderStars(r.rating)}
              </div>
              <p className="text-gray-700">{r.text}</p>
              <button className="text-sm text-orange-600 mt-2 hover:underline">
                Helpful (24)
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
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

      {/* ==================== RELATED PRODUCTS CAROUSEL ==================== */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Products</h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${carouselStart * (100 / visibleCount)}%)` }}
            >
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex-shrink-0 w-full md:w-1/4"
                  style={{ minWidth: `calc(${100 / visibleCount}% - 1.5rem)` }}
                >
                  <div className="group cursor-pointer bg-white rounded-lg shadow-sm p-4 hover:shadow-lg transition-all">
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 aspect-square">
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition" />
                    </div>
                    <h3 className="font-medium text-lg text-gray-900">{p.name}</h3>
                    <div className="flex items-center gap-1 mt-1">{renderStars(p.rating)}</div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg font-bold text-orange-600">
                        ₹{p.price.toFixed(2)}
                      </span>
                      {p.oldPrice && (
                        <span className="text-sm line-through text-gray-400">
                          ₹{p.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button className="mt-3 w-full bg-orange-600 text-white py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            disabled={carouselStart === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition ${
              carouselStart === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            disabled={carouselStart >= relatedProducts.length - visibleCount}
            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition ${
              carouselStart >= relatedProducts.length - visibleCount
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;