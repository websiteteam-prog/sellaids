// src/pages/checkout/ReviewStep.jsx
import React, { useState, useEffect } from "react";
import { MapPin, Truck, Package } from "lucide-react";
import api from "../../api/axiosInstance";
import { toast, Toaster } from "react-hot-toast";

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
      setTimeout(() => toast.success("Address saved"), 0); // TOAST WORKS
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  const cancelEdit = () => {
    setAddr(parseAddress(shippingAddress));
    setIsEditing(false);
  };

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
      });

      if (!res.data.success) throw new Error(res.data.message);

      const razorpayData = res.data.data;
      const fullOrderData = { ...orderData, ...razorpayData };

      onNext(fullOrderData);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster /> {/* REQUIRED FOR TOAST */}
      <h2 className="text-2xl font-bold">Review Your Order</h2>

      {/* ADDRESS */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-purple-600 mt-1" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold">Delivery Address</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-600 text-sm underline hover:text-purple-700"
            >
              Change
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  placeholder="Address line"
                  value={addr.line}
                  onChange={(e) => setAddr({ ...addr, line: e.target.value })}
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  placeholder="City"
                  value={addr.city}
                  onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                  className="border rounded px-3 py-2 text-sm"
                />
                <input
                  placeholder="Pincode"
                  value={addr.pin}
                  onChange={(e) => setAddr({ ...addr, pin: e.target.value })}
                  className="border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveAddress}
                  className="px-4 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-1.5 border rounded text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">{shippingAddress || "No address set"}</p>
          )}
        </div>
      </div>

      {/* ITEMS */}
      {cartItems.map((item) => (
        <div
          key={item.product_id}
          className="bg-white rounded-lg shadow-sm border p-4 flex gap-4 items-start"
        >
          <img
            src={item.product.front_photo || "https://placehold.co/80"}
            alt={item.product.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <p className="font-medium">{item.product.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="font-semibold">
                ₹{item.product.price * item.quantity}
              </p>
              {item.product.original_price > item.product.price && (
                <>
                  <p className="text-sm text-gray-500 line-through">
                    ₹{item.product.original_price * item.quantity}
                  </p>
                  <p className="text-sm text-green-600">
                    {Math.round(
                      ((item.product.original_price - item.product.price) /
                        item.product.original_price) *
                        100
                    )}
                    % Off
                  </p>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Size: {item.size} | Qty: {item.quantity}
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Package className="w-3 h-3" />
              All issue easy returns
            </p>
            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Estimated Delivery by Wed, 5th Nov
            </p>
          </div>
        </div>
      ))}

      {/* PRICE */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between">
          <span>Product Total</span>
          <span>₹{total}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- ₹{discount}</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-2 border-t pt-2">
          <span>Order Total</span>
          <span>₹{orderTotal}</span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-5 py-2 border rounded hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={handleProceed}
          disabled={isEditing || loading || !shippingAddress}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Creating Order..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}