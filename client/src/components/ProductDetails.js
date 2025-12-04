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
  const [newReview, setNewReview] = useState({ rating: 5, text: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, location.key]);

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

        const productRes = await api.get(`/api/product/products/${id}`);
        if (!productRes.data.success || !productRes.data.product) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        const raw = productRes.data.product;

        // SMART NAME FIX
        let productName = "Product";
        try {
          if (raw.additional_info) {
            const parsed = JSON.parse(raw.additional_info);
            if (parsed?.description?.trim()) productName = parsed.description.trim();
            else if (parsed?.model_size?.trim()) productName = parsed.model_size.trim();
          }
        } catch (e) {}

        if (productName === "Product") {
          if (raw.model_name?.trim()) productName = raw.model_name.trim();
          else if (raw.product_type?.trim()) productName = raw.product_type.trim();
          else if (raw.product_color && raw.size) productName = `${raw.product_color} - Size ${raw.size}`;
          else if (raw.sku) productName = `Product - ${raw.sku}`;
        }

        let extraInfo = {};
        try {
          if (raw.additional_info) extraInfo = JSON.parse(raw.additional_info);
        } catch (e) {}

        const conditionMap = {
          new: "New",
          almost_new: "Almost New",
          good: "Good",
          hardly_ever_used: "Hardly Ever Used",
          satisfactory: "Satisfactory",
        };

        const mappedProduct = {
          id: raw.id,
          name: productName,
          sku: raw.sku || "N/A",
          price: parseFloat(raw.selling_price) || 0,
          original_price: parseFloat(raw.purchase_price) || null,
          model: extraInfo.model_size,
          fabric: extraInfo.fabric,
          images: [],
          colors: raw.product_color
            ? [{ hex: getColorHex(raw.product_color), name: raw.product_color }]
            : [],
          sizes: raw.size && raw.size !== "Other" ? [raw.size] : [],
          condition: conditionMap[raw.product_condition] || "Not specified",
          rating: 0,
          review_count: 0,
        };

        if (raw.front_photo) mappedProduct.images.push(raw.front_photo);
        if (raw.back_photo) mappedProduct.images.push(raw.back_photo);
        if (raw.label_photo) mappedProduct.images.push(raw.label_photo);
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
        const getRelatedProductInfo = (p) => {
          let name = "Beautiful Product";
          let rating = 0;

          if (p?.additional_info) {
            try {
              const info = JSON.parse(p.additional_info);
              if (typeof info === "object" && info?.description?.trim()) {
                name = info.description.trim();
              }
            } catch (error) {
              console.warn(`Failed to parse additional_info for product ID ${p?.id}`, error);
            }
          }

          if (name === "Beautiful Product") {
            name = p?.model_name?.trim() || p?.product_type?.trim() || "Beautiful Product";
          }

          if (p?.avg_rating != null) {
            rating = parseFloat(p.avg_rating);
            if (isNaN(rating)) rating = 0;
          }

          return {
            name,
            rating: rating > 0 ? Number(rating.toFixed(1)) : 0,
          };
        };
        // RELATED PRODUCTS - Only 4
      if (productRes.data.relatedProducts && Array.isArray(productRes.data.relatedProducts)) {
        const limited = productRes.data.relatedProducts.slice(0, 4);

        setRelatedProducts(
          limited.map((p) => {
            const { name, rating } = getRelatedProductInfo(p);

            return {
              id: p.id,
              name,                                    
              price: parseFloat(p.selling_price) || 0,
              image: p.front_photo || "https://via.placeholder.com/300",
              rating,                            
            };
          })
        );
      }

        setProduct(mappedProduct);

        // Reviews
        try {
          const reviewRes = await api.get(`/api/user/review/product/${id}`);
          if (reviewRes.data.success && reviewRes.data.data && Array.isArray(reviewRes.data.data.reviews)) {
            const formatted = reviewRes.data.data.reviews.map((r) => ({
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
            const avg = formatted.length
              ? formatted.reduce((s, r) => s + r.rating, 0) / formatted.length
              : 0;
            setProduct((p) => ({ ...p, rating: avg, review_count: formatted.length }));
          }
        } catch (e) {
          console.error("Reviews error:", e);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id, location.key]);

  const getColorHex = (c) => {
    const map = {
      red: "#ef4444", blue: "#3b82f6", green: "#22c55e", black: "#000000",
      white: "#ffffff", yellow: "#eab308", purple: "#a855f7", pink: "#ec4899",
    };
    return map[c?.toLowerCase()] || "#6b7280";
  };

  const getUnifiedBadge = (text) => {
    const v = text?.trim();
    if (!v || v === "N/A" || v === "Not specified")
      return <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">N/A</span>;
    return <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{v}</span>;
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating || 0);
    const hasHalf = (rating || 0) % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) =>
          i < full ? (
            <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
          ) : i === full && hasHalf ? (
            <StarHalf key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
          ) : (
            <Star key={i} className="w-4 h-4 text-gray-300" />
          )
        )}
      </div>
    );
  };

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

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add to wishlist");
      navigate("/UserAuth/UserLogin", { state: { from: location.pathname } });
      return;
    }
    try {
      await api.post("/api/user/wishlist", { product_id: product.id });
      toast.success("Added to wishlist!", { icon: <Heart className="w-5 h-5 fill-red-500 text-red-500" /> });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    const title = product.name;
    // const imageUrl = `${process.env.REACT_APP_API_URL}/${product.front_photo}`    
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Check out: ${title} - ${url}`)}`, "_blank");
    }
  };

  const handleAddReview = async () => {
    if (!newReview.text.trim()) return toast.error("Review text is required");
    try {
      const res = await api.post("/api/user/review", {
        product_id: id,
        rating: newReview.rating,
        review_text: newReview.text.trim(),
      });
      if (res.data.success) {
        const newRev = { author: user?.name || "You", date: "Just now", rating: newReview.rating, text: newReview.text.trim() };
        setReviews([newRev, ...reviews]);
        setNewReview({ rating: 5, text: "" });
        setShowReviewForm(false);
        toast.success("Review submitted!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginatedReviews = reviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600"></div><p className="mt-4 text-lg">Loading product...</p></div>;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><p className="text-xl text-red-600">{error}</p><button onClick={() => window.location.reload()} className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Retry</button></div>;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 bg-gray-50 min-h-screen">
   
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white  shadow-sm overflow-hidden">
        {/* Images */}
        <div className="relative">
          <div className="bg-gray-10 overflow-hidden aspect-square">
            <img
              src={`${process.env.REACT_APP_API_URL}/${product.images[mainImgIdx]}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button onClick={() => setMainImgIdx((i) => (i - 1 + product.images.length) % product.images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow-md hover:bg-white">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setMainImgIdx((i) => (i + 1) % product.images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow-md hover:bg-white">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="p-4 bg-white grid grid-cols-5 gap-2">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setMainImgIdx(i)}
                  className={` overflow-hidden border-2 ${mainImgIdx === i ? "border-orange-500 ring-2 ring-orange-200" : "border-gray-300"}`}
                >
                  <img src={`${process.env.REACT_APP_API_URL}/${src}`} alt="" className="w-full aspect-square object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>

            <div className="flex items-center gap-3 mt-3">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-600">({product.review_count} reviews)</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-orange-600">₹{product.price.toLocaleString()}</span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-xl line-through text-gray-400">₹{product.original_price.toLocaleString()}</span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {(product.model || product.fabric) && (
              <div className="mt-4 space-y-1 text-gray-700">
                {product.model && <p><strong>Model Size:</strong> {product.model}</p>}
                {product.fabric && <p><strong>Fabric:</strong> {product.fabric}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-50 p-4 rounded-xl text-center"><p className="text-xs uppercase text-gray-500 font-medium">Condition</p><div className="mt-2">{getUnifiedBadge(product.condition)}</div></div>
              <div className="bg-gray-50 p-4 rounded-xl text-center"><p className="text-xs uppercase text-gray-500 font-medium">Color</p><div className="mt-2">{getUnifiedBadge(product.colors[0]?.name || "N/A")}</div></div>
              <div className="bg-gray-50 p-4 rounded-xl text-center"><p className="text-xs uppercase text-gray-500 font-medium">Size</p><div className="mt-2">{getUnifiedBadge(product.sizes[0] || "N/A")}</div></div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:bg-gray-100">-</button>
                <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 hover:bg-gray-100">+</button>
              </div>
            </div>

            <div className="mt-8">
              <div className="hidden sm:flex items-center gap-4">
                <button onClick={handleAddToCart} className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition">Add to Cart</button>
                <button onClick={handleAddToWishlist} className="p-4 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 group transition"><Heart className="w-6 h-6 text-gray-700 group-hover:text-red-500 group-hover:fill-red-500 transition" /></button>
                <button onClick={handleShare} className="p-4 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition"><Share2 className="w-6 h-6 text-gray-700" /></button>
              </div>
              <div className="sm:hidden space-y-4">
                <button onClick={handleAddToCart} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition">Add to Cart</button>
                <div className="flex gap-4">
                  <button onClick={handleAddToWishlist} className="flex-1 p-4 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 group transition flex items-center justify-center"><Heart className="w-6 h-6 text-gray-700 group-hover:text-red-500 group-hover:fill-red-500 transition" /></button>
                  <button onClick={handleShare} className="flex-1 p-4 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition flex items-center justify-center"><Share2 className="w-6 h-6 text-gray-700" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-12 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {isAuthenticated ? (
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700">
              Write a Review
            </button>
          ) : (
            <button onClick={() => toast.error("Please login to write a review")} className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700">
              Login to Review
            </button>
          )}
        </div>

        {showReviewForm && isAuthenticated && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border">
            <p className="font-medium mb-3">Your Rating</p>
            <div className="flex gap-2 mb-4">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setNewReview({...newReview, rating: s})}>
                  <Star className={`w-8 h-8 ${s <= newReview.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Share your experience..."
              value={newReview.text}
              onChange={e => setNewReview({...newReview, text: e.target.value})}
              rows={4}
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={handleAddReview} className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-orange-700">
                <Send className="w-5 h-5" /> Submit
              </button>
              <button onClick={() => { setShowReviewForm(false); setNewReview({rating:5, text:""}); }} className="px-6 py-3 border rounded-xl hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {paginatedReviews.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No reviews yet. Be the first!</p>
          ) : (
            paginatedReviews.map((r, i) => (
              <div key={i} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{r.author}</p>
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
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full ${currentPage === i + 1 ? "bg-orange-600 text-white" : "bg-gray-200 hover:bg-gray-300"} font-medium`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          
          {/* Mobile: 1 column, Desktop: 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => { navigate(`/product-details/${p.id}`); window.scrollTo(0, 0); }}
                className="bg-white shadow-sm hover:shadow-lg cursor-pointer transition-all overflow-hidden group"
              >
                <div className="h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${p.image}`}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center gap-1 mt-2">{renderStars(p.rating)}</div>
                  <p className="text-lg font-bold text-orange-600 mt-3">₹{p.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;