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

  const { isAuthenticated, isUserLoading } = useUserStore();
  const { setPendingAdd } = useCartActions();

  // States
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImgIdx, setMainImgIdx] = useState(0);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ author: "", rating: 5, text: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const [carouselStart, setCarouselStart] = useState(0);
  const visibleCount = 4;

  // ==================== FETCH PRODUCT ====================
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/api/product/products/${id}`);
        console.log("API Response:", response.data);

        if (response.data.success && response.data.product) {
          const raw = response.data.product;

          const mappedProduct = {
            id: raw.id,
            name: raw.model_name || raw.product_type || "Unnamed Product",
            sku: raw.sku || "N/A",
            price: parseFloat(raw.selling_price) || 0,
            original_price: parseFloat(raw.purchase_price) || null,
            description: raw.additional_info || "No description available.",
            images: [],
            colors: raw.product_color ? [{ hex: getColorHex(raw.product_color) }] : [],
            sizes: raw.size && raw.size !== "Other" ? [raw.size] : [],
            rating: 4.5,
            review_count: 0,
          };

          if (raw.front_photo) mappedProduct.images.push(raw.front_photo);
          if (raw.more_images) {
            try {
              const extra = JSON.parse(raw.more_images);
              if (Array.isArray(extra)) {
                mappedProduct.images.push(...extra.map(img => img.startsWith("http") ? img : `${process.env.REACT_APP_API_URL}${img}`));
              }
            } catch (e) {}
          }

          if (response.data.relatedProducts) {
            setRelatedProducts(response.data.relatedProducts.map(p => ({
              id: p.id,
              name: p.model_name || p.product_type,
              price: parseFloat(p.selling_price),
              image: p.front_photo || "https://via.placeholder.com/300",
              rating: 4.5
            })));
          }

          setProduct(mappedProduct);
          if (mappedProduct.colors.length > 0) setSelectedColor(mappedProduct.colors[0]);
          if (mappedProduct.sizes.length > 0) setSelectedSize(mappedProduct.sizes[0]);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ==================== COLOR HEX ====================
  const getColorHex = (colorName) => {
    const map = {
      red: "#ef4444", blue: "#3b82f6", green: "#22c55e", black: "#000000",
      white: "#ffffff", yellow: "#eab308", purple: "#a855f7", pink: "#ec4899"
    };
    return map[colorName?.toLowerCase()] || "#6b7280";
  };

  // ==================== ADD TO CART ====================
  const handleAddToCart = async () => {
    if (isUserLoading) return toast.error("Please wait...");
    if (!isAuthenticated) {
      setPendingAdd({ product, from: location.pathname });
      toast.error("Please log in to add to cart");
      navigate("/UserAuth/UserLogin", { state: { from: location.pathname, addToCart: product.id } });
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

  // ==================== ADD TO WISHLIST (TOAST + SAME PAGE) ====================
  const handleAddToWishlist = async () => {
    if (isUserLoading) return;
    if (!isAuthenticated) {
      toast.error("Please log in to add to wishlist");
      navigate("/UserAuth/UserLogin", { state: { from: location.pathname } });
      return;
    }

    try {
      await api.post("/api/user/wishlist", { product_id: product.id });
      
      toast.success("Product added to wishlist!", {
        icon: <Heart className="w-5 h-5 fill-red-500 text-red-500" />,
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #fecaca",
          borderRadius: "8px",
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  // ==================== SHARE ====================
  const handleShare = async () => {
    const url = window.location.href;
    const title = product.name;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        fallbackShare(url, title);
      }
    } else {
      fallbackShare(url, title);
    }
  };

  const fallbackShare = (url, title) => {
    const text = `Check out: ${title} - ${url}`;
    const whatsapp = `https://wa.me/?text=${encodeURIComponent(text)}`;
    const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

    const shareWindow = window.open("", "_blank", "width=600,height=400");
    shareWindow.document.write(`
      <div style="padding:20px;font-family:Arial;text-align:center;">
        <h3>Share Product</h3>
        <a href="${whatsapp}" target="_blank" style="display:inline-block;margin:10px;padding:10px 20px;background:#25D366;color:white;border-radius:5px;text-decoration:none;">WhatsApp</a>
        <a href="${facebook}" target="_blank" style="display:inline-block;margin:10px;padding:10px 20px;background:#1877F2;color:white;border-radius:5px;text-decoration:none;">Facebook</a>
        <a href="${twitter}" target="_blank" style="display:inline-block;margin:10px;padding:10px 20px;background:#1DA1F2;color:white;border-radius:5px;text-decoration:none;">Twitter</a>
      </div>
    `);
  };

  // ==================== ADD REVIEW ====================
  const handleAddReview = async () => {
    if (!newReview.author.trim() || !newReview.text.trim()) return;

    try {
      const res = await api.post(`/api/product/reviews/${id}`, {
        rating: newReview.rating,
        comment: newReview.text
      });

      if (res.data.success) {
        const newRev = {
          author: newReview.author,
          date: "Just now",
          rating: newReview.rating,
          text: newReview.text
        };
        setReviews([newRev, ...reviews]);
        setNewReview({ author: "", rating: 5, text: "" });
        setShowReviewForm(false);
        setCurrentPage(1);
        toast.success("Review submitted!");
      }
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  // ==================== STARS ====================
  const renderStars = (rating) => {
    const full = Math.floor(rating || 0);
    const hasHalf = (rating || 0) % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          i < full ? (
            <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
          ) : i === full && hasHalf ? (
            <StarHalf key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
          ) : (
            <Star key={i} className="w-4 h-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  // ==================== CAROUSEL CONTROLS ====================
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

  // ==================== PAGINATION ====================
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginatedReviews = reviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

  // ==================== LOADING / ERROR ====================
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
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-orange-600 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  if (!product) return null;

  // ==================== MAIN RENDER ====================
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* ==================== PRODUCT GRID ==================== */}
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-sm">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[mainImgIdx] || "https://via.placeholder.com/600x600/f3f3f3/999?text=No+Image"}
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
              onError={(e) => e.target.src = "https://via.placeholder.com/600x600/f3f3f3/999?text=Error"}
            />
            <button
              onClick={() => setMainImgIdx((i) => (i - 1 + product.images.length) % product.images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMainImgIdx((i) => (i + 1) % product.images.length)}
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
                className={`flex-shrink-0 w-20 h-20 rounded-md border-2 overflow-hidden ${mainImgIdx === i ? "border-orange-500 ring-2 ring-orange-300" : "border-gray-300"}`}
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
            <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-600">₹{product.price.toLocaleString()}</span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-lg line-through text-gray-400">₹{product.original_price.toLocaleString()}</span>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                  {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Color */}
          {product.colors.length > 0 && (
            <div>
              <p className="font-medium mb-2">Color</p>
              <div className="flex gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border-2 ${selectedColor === c ? "border-orange-500 ring-2 ring-orange-300" : "border-gray-300"}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes.length > 0 && (
            <div>
              <p className="font-medium mb-2">Size</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${selectedSize === s ? "bg-orange-600 text-white" : "border-gray-300 hover:border-orange-400"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 border rounded-md hover:bg-gray-50">-</button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 border rounded-md hover:bg-gray-50">+</button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button onClick={handleAddToCart} className="flex-1 bg-orange-600 text-white py-3 rounded-md font-medium hover:bg-orange-700">
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

      {/* ==================== REVIEWS SECTION ==================== */}
      <section className="mt-16 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
          >
            Write a Review
          </button>
        </div>

        {showReviewForm && (
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.author}
              onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <div className="mb-3">
              <p className="text-sm mb-1">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })}>
                    <Star className={`w-6 h-6 ${star <= newReview.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Your review..."
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              rows={3}
              className="w-full mb-3 p-2 border rounded-md resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleAddReview} className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm flex items-center gap-1">
                <Send className="w-4 h-4" /> Submit
              </button>
              <button onClick={() => setShowReviewForm(false)} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
            </div>
          </div>
        )}

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

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full font-medium ${currentPage === i + 1 ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ==================== RELATED PRODUCTS — CAROUSEL FIXED ==================== */}
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
                      onClick={() => navigate(`/product-details/${p.id}`)}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg cursor-pointer transition-shadow h-full flex flex-col"
                    >
                      <div className="bg-gray-100 rounded-xl w-full h-64 mb-3 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = "https://via.placeholder.com/300"}
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">{p.name}</h3>
                      <div className="flex items-center gap-1 mt-1">{renderStars(p.rating)}</div>
                      <p className="text-lg font-bold text-orange-600 mt-2">₹{p.price.toLocaleString()}</p>
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