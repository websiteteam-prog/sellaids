// src/pages/checkout/ReviewStep.jsx
import React from "react";
import { MapPin, Truck, Package } from "lucide-react";

export default function ReviewStep({ orderData, onPrev, onNext }) {
  const {
    cartItems = [],
    shippingAddress = "",
    total = 0,
    discount = 0,
    orderTotal = 0,
  } = orderData || {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Your Order</h2>

      {/* ── ADDRESS ── */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-purple-600 mt-1" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold">Delivery Address</p>
            <button className="text-purple-600 text-sm underline" disabled>
              Change
            </button>
          </div>
          <p className="text-gray-700">{shippingAddress}</p>
        </div>
      </div>

      {/* ── ITEMS ── */}
      {cartItems.map((it) => (
        <div
          key={it.product_id}
          className="bg-white rounded-lg shadow-sm border p-4 flex gap-4 items-start"
        >
          <img
            src={it.product.front_photo || "https://placehold.co/80"}
            alt={it.product.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <p className="font-medium">{it.product.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="font-semibold">
                ₹{it.product.price * it.quantity}
              </p>
              {it.product.original_price > it.product.price && (
                <>
                  <p className="text-sm text-gray-500 line-through">
                    ₹{it.product.original_price * it.quantity}
                  </p>
                  <p className="text-sm text-green-600">
                    {Math.round(
                      ((it.product.original_price - it.product.price) /
                        it.product.original_price) *
                        100
                    )}
                    % Off
                  </p>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Size: {it.size} | Qty: {it.quantity}
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

      {/* ── PRICE (NO "VIEW PRICE DETAILS") ── */}
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

      {/* ── BUTTONS ── */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-5 py-2 border rounded hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={() => onNext(orderData)}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}