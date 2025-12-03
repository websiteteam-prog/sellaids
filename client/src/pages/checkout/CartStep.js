import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../stores/useCartStore";
import useWishlistStore from "../../stores/useWishlistStore";
import api from "../../api/axiosInstance";
import { toast, Toaster } from "react-hot-toast";
import { MapPin, Heart, X, Truck, Package } from "lucide-react";
import QuantitySelector from "../../pages/checkout/QuantitySelector";

const STORAGE_KEY = "orderData";

export default function CartStep({ onNext }) {
  const { cart, fetchCart, removeFromCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();

  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [addr, setAddr] = useState({ line: "", city: "", pin: "" });
  const [originalAddr, setOriginalAddr] = useState("");

  /* ---------- IMAGE SLIDER LOGIC ---------- */
  const [activeImages, setActiveImages] = useState({});

  const getProductImages = (product) => {
    if (!product) return [];

    const moreImages = (() => {
      try {
        return JSON.parse(product.more_images || "[]") || [];
      } catch {
        return [];
      }
    })();

    return [
      product.front_photo,
      product.back_photo,
      product.label_photo,
      product.inside_photo,
      product.button_photo,
      product.wearing_photo,
      ...moreImages,
    ].filter(Boolean);
  };

  const changeImage = (productId, offsetOrIndex) => {
    setActiveImages((prev) => {
      const current = prev[productId] ?? 0;
      const images = getProductImages(
        cart.find((i) => i.product_id === productId)?.product || {}
      );

      if (images.length === 0) return prev;

      let newIdx;
      if (typeof offsetOrIndex === "number" && offsetOrIndex < 0) {
        newIdx = (current + offsetOrIndex + images.length) % images.length;
      } else {
        newIdx = (current + (typeof offsetOrIndex === "number" ? offsetOrIndex : 1)) % images.length;
      }

      return { ...prev, [productId]: newIdx };
    });
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/96";
  };

  useEffect(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    api
      .get("/api/user/profile/list")
      .then((res) => {
        const d = res.data.data;
        if (d.address_line && d.city && d.pincode) {
          const full = `${d.address_line}, ${d.city}, ${d.pincode}`;
          setShippingAddress(full);
          setOriginalAddr(full);
          setAddr({ line: d.address_line, city: d.city, pin: d.pincode });
        }
      })
      .catch(() => toast.error("Could not load address"))
      .finally(() => fetchCart().then(() => setLoading(false)));
  }, [fetchCart]);

  const moveToWishlist = async (pidId) => {
    try {
      await api.post("/api/user/wishlist", { product_id: pidId });
      await addToWishlist(pidId);
      await removeFromCart(pidId);
      toast.success("Moved to wishlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const saveAddress = async () => {
    const { line, city, pin } = addr;
    if (!line || !city || !pin) {
      toast.error("Please fill all address fields");
      return;
    }

    const full = `${line}, ${city}, ${pin}`;

    try {
      await api.put("/api/user/profile/edit", {
        address_line: line,
        city,
        pincode: pin,
      });

      setShippingAddress(full);
      setOriginalAddr(full);
      setIsEditing(false);
      toast.success("Address saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
    }
  };

  const cancelEdit = () => {
    const parts = originalAddr.split(", ");
    if (parts.length === 3) {
      setAddr({ line: parts[0], city: parts[1], pin: parts[2] });
    } else {
      setAddr({ line: "", city: "", pin: "" });
    }
    setIsEditing(false);
  };

  const handleContinue = () => {
    if (!shippingAddress) return toast.error("Add a shipping address");

    const totalProductPrice = cart.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0
    );
    const discount = cart.reduce(
      (s, i) =>
        s + (i.product.original_price - i.product.price) * i.quantity,
      0
    );
    const orderTotal = totalProductPrice - discount;

    const SHIPPING_FEE = 100;
    const PLATFORM_FEE = 50;
    const finalTotal = orderTotal + SHIPPING_FEE + PLATFORM_FEE;

    onNext({
      cartItems: cart,
      shippingAddress,
      total: totalProductPrice,
      discount,
      orderTotal,
      finalTotal,
      shippingFee: SHIPPING_FEE,
      platformFee: PLATFORM_FEE,
    });
  };

  if (loading) return <p className="text-center py-10">Loading…</p>;

  const totalProductPrice = cart.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );
  const discount = cart.reduce(
    (s, i) => s + (i.product.original_price - i.product.price) * i.quantity,
    0
  );
  const orderTotal = totalProductPrice - discount;
  const SHIPPING_FEE = 100;
  const PLATFORM_FEE = 50;
  const finalTotal = orderTotal + SHIPPING_FEE + PLATFORM_FEE;

  return (
    <div className="space-y-6 ">
      <Toaster />

      {/* ADDRESS CARD */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col sm:flex-row items-start gap-4">
        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
            <p className="font-semibold text-lg">Delivery Address</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-600 text-sm underline hover:text-purple-700"
            >
              Change
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  placeholder="Address line"
                  value={addr.line}
                  onChange={(e) => setAddr({ ...addr, line: e.target.value })}
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="City"
                  value={addr.city}
                  onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <input
                  placeholder="Pincode"
                  value={addr.pin}
                  onChange={(e) => setAddr({ ...addr, pin: e.target.value })}
                  className="border rounded px-3 py-2 text-sm w-full"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveAddress}
                  className="px-5 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-5 py-2 border rounded text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-base">{shippingAddress}</p>
          )}
        </div>
      </div>

      {/* PRODUCT CARDS */}
      {cart.map((item) => {
        const product = item.product;
        const images = getProductImages(product);
        const activeIdx = activeImages[item.product_id] ?? 0;

        return (
          <div
            key={item.product_id}
            className="bg-white rounded-lg shadow-sm border p-4 flex flex-col lg:flex-row gap-6 items-start"
          >
            {/* ---- IMAGE SLIDER ---- */}
            <div className="w-full lg:w-60 flex-shrink-0">
              <div className="relative">
                <div className="flex justify-center mb-3">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${images[activeIdx]}`}
                    alt={product?.name}
                    className="w-full max-w-xs sm:max-w-sm h-auto max-h-64 object-contain rounded-md mx-auto"
                  />
                </div>

                {images.length > 1 && (
                  <>
                    <div className="flex justify-center gap-8 my-3">
                      <button
                        onClick={() => changeImage(item.product_id, -1)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => changeImage(item.product_id, 1)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex overflow-x-auto space-x-2 pb-2 justify-center">
                      {images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`${process.env.REACT_APP_API_URL}/${img}`}
                          alt={`thumb ${idx + 1}`}
                          className={`w-16 h-16 object-contain rounded-md cursor-pointer border-2 transition-all ${activeIdx === idx ? "border-purple-600" : "border-gray-300"
                            }`}
                          onClick={() => changeImage(item.product_id, idx)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ---- PRODUCT DETAILS ---- */}
            <div className="flex-1 space-y-3 w-full">
              <p className="font-medium text-lg">{product?.name}</p>

              <div className="flex flex-wrap items-center gap-3">
                <p className="font-bold text-xl">₹{product?.price * item.quantity}</p>
                {product?.original_price > product?.price && (
                  <>
                    <p className="text-sm text-gray-500 line-through">
                      ₹{product?.original_price * item.quantity}
                    </p>
                    <p className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      {Math.round(((product?.original_price - product?.price) / product?.original_price) * 100)}% Off
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span>Size: <strong>{item.size}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  Qty:
                  <QuantitySelector
                    productId={item.product_id}
                    initialQty={item.quantity}
                    disabled={isEditing}
                  />
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  All issue easy returns
                </p>
                <p className="flex items-start gap-2">
                  <Truck className="w-4 h-4" />
                  Estimated Delivery by Wed, 5th Nov
                </p>
              </div>
            </div>

            {/* ---- ACTIONS ---- */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm w-full lg:w-auto justify-between lg:justify-start">
              <button
                onClick={() => moveToWishlist(item.product_id)}
                className="flex items-center gap-1 text-gray-700 hover:text-purple-600 font-medium"
              >
                <Heart className="w-5 h-5" />
                Move to Wishlist
              </button>
              <span className="hidden sm:block text-gray-400">|</span>
              <button
                onClick={() => removeFromCart(item.product_id)}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600 font-medium"
              >
                <X className="w-5 h-5" />
                Remove
              </button>
            </div>
          </div>
        );
      })}

      {/* PRICE SUMMARY */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="space-y-3 text-base">
          <div className="flex justify-between">
            <span>Product Total</span>
            <span className="font-medium">₹{totalProductPrice}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discounts Applied</span>
              <span className="font-medium">- ₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600 font-medium">₹{SHIPPING_FEE}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span className="text-green-600 font-medium">₹{PLATFORM_FEE}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-300">
            <span>Final Total</span>
            <span className="text-purple-600">₹{finalTotal}</span>
          </div>
        </div>
      </div>

      {/* CONTINUE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={isEditing}
          className="w-full sm:w-auto bg-purple-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}