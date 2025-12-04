import React, { useState, useEffect } from "react";
import { MapPin, Truck, Package } from "lucide-react";
import api from "../../api/axiosInstance";
import { toast, Toaster } from "react-hot-toast";

const IMG_BASE = process.env.REACT_APP_API_URL;
const PLACEHOLDER_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";

export default function ReviewStep({
  orderData,
  onPrev,
  onNext,
  onAddressUpdate,
}) {
  const {
    cartItems = [],
    shippingAddress: parentAddress = "",
    total = 0,
    discount = 0,
    orderTotal = 0,
    finalTotal = 0,
    shippingFee = 100,
    platformFee = 50,
  } = orderData || {};

  const [shippingAddress, setShippingAddress] = useState(parentAddress);
  const [isEditing, setIsEditing] = useState(false);
  const [addr, setAddr] = useState({ line: "", city: "", pin: "" });
  const [loading, setLoading] = useState(false);

  const parseAddress = (addr) => {
    const parts = addr.split(", ");
    if (parts.length === 3) {
      return { line: parts[0], city: parts[1], pin: parts[2] };
    }
    return { line: "", city: "", pin: "" };
  };

  useEffect(() => {
    if (parentAddress) {
      setShippingAddress(parentAddress);
      setAddr(parseAddress(parentAddress));
    }
  }, [parentAddress]);

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
      setAddr({ line, city, pin });
      onAddressUpdate(full);
      setIsEditing(false);
      toast.success("Address saved");
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  const cancelEdit = () => {
    setAddr(parseAddress(shippingAddress));
    setIsEditing(false);
  };

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
    ].filter(Boolean)
    .map(path => `${IMG_BASE}/${path}`);
  };

  const changeImage = (productId, offsetOrIndex) => {
    setActiveImages((prev) => {
      const current = prev[productId] ?? 0;
      const images = getProductImages(
        cartItems.find((i) => i.product_id === productId)?.product || {}
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
    e.target.src = PLACEHOLDER_DATA_URL;
  };

  /* ---------- PROCEED TO PAYMENT ---------- */
  const handleProceed = async () => {
    if (!shippingAddress) {
      toast.error("Please add a shipping address");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/payment/create-order", {
        cartItems,
        shippingAddress,
        finalTotal,
      });

      if (!res.data.success) throw new Error(res.data.message);

      const razorpayData = res.data.data;
      const fullOrderData = {
        ...orderData,
        ...razorpayData,
        finalTotal,
        shippingFee,
        platformFee,
      };

      onNext(fullOrderData);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
      <h2 className="text-2xl font-bold text-center sm:text-left">Review Your Order</h2>

      {/* ADDRESS */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col sm:flex-row items-start gap-4">
        <MapPin className="w-6 h-6 text-purple-600 flex-shrink-0" />
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <p className="font-semibold text-lg">Delivery Address</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-600 text-sm underline hover:text-purple-700"
            >
              Change
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  placeholder="Address line"
                  value={addr.line}
                  onChange={(e) => setAddr({ ...addr, line: e.target.value })}
                  className="border rounded px-4 py-2 text-sm w-full"
                />
                <input
                  placeholder="City"
                  value={addr.city}
                  onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                  className="border rounded px-4 py-2 text-sm w-full"
                />
                <input
                  placeholder="Pincode"
                  value={addr.pin}
                  onChange={(e) => setAddr({ ...addr, pin: e.target.value })}
                  className="border rounded px-4 py-2 text-sm w-full"
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
            <p className="text-gray-700 text-base">{shippingAddress || "No address set"}</p>
          )}
        </div>
      </div>

      {/* ITEMS */}
      {cartItems.map((item) => {
        const product = item.product;
        const images = getProductImages(product);
        const activeIdx = activeImages[item.product_id] ?? 0;

        return (
          <div
            key={item.product_id}
            className="bg-white rounded-lg shadow-sm border p-4 flex flex-col lg:flex-row gap-6 items-start"
          >
            {/* IMAGE SLIDER */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="relative">
                <div className="flex justify-center">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${images[activeIdx]}`}
                    alt={product?.name}
                    className="w-full max-w-sm h-auto max-h-72 object-contain rounded-lg mx-auto shadow-sm"
                  />
                </div>

                {images.length > 1 && (
                  <>
                    <div className="flex justify-center gap-10 my-4">
                      <button
                        onClick={() => changeImage(item.product_id, -1)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => changeImage(item.product_id, 1)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex overflow-x-auto space-x-3 pb-2 justify-center">
                      {images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`${process.env.REACT_APP_API_URL}/${img}`}
                          alt={`thumb ${idx + 1}`}
                          className={`w-20 h-20 object-contain rounded-lg cursor-pointer border-2 transition-all ${
                            activeIdx === idx ? "border-purple-600" : "border-gray-300"
                          }`}
                          onClick={() => changeImage(item.product_id, idx)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="flex-1 space-y-4 w-full">
              <div>
                <p className="font-semibold text-lg">{product?.name}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <p className="font-bold text-xl">₹{product?.price * item.quantity}</p>
                  {product?.original_price > product?.price && (
                    <>
                      <p className="text-sm text-gray-500 line-through">
                        ₹{product?.original_price * item.quantity}
                      </p>
                      <p className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded">
                        {Math.round(((product?.original_price - product?.price) / product?.original_price) * 100)}% Off
                      </p>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Size: <strong>{item.size}</strong> | Qty: <strong>{item.quantity}</strong>
                </p>
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
              <p className="text-sm text-gray-600 mt-1">
                Size: {item.size} | Qty: {item.quantity}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Package className="w-3 h-3" />
                All issue easy returns
              </p>
              {/* <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                <Truck className="w-4 h-4" />
                Estimated Delivery by Wed, 5th Nov
              </p> */}
            </div>
          </div>
        );
      })}

      {/* PRICE SUMMARY */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="space-y-3 text-base">
          <div className="flex justify-between">
            <span>Product Total</span>
            <span className="font-medium">₹{total}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="font-medium">- ₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600 font-medium">₹{shippingFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span className="text-green-600 font-medium">₹{platformFee}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-300">
            <span>Final Total</span>
            <span className="text-purple-600">₹{finalTotal}</span>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={onPrev}
          className="px-6 py-3 border rounded-lg hover:bg-gray-50 font-medium order-2 sm:order-1"
        >
          Back
        </button>
        <button
          onClick={handleProceed}
          disabled={isEditing || loading || !shippingAddress}
          className="w-full sm:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition order-1 sm:order-2"
        >
          {loading ? "Creating Order..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}