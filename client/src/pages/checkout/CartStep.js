// src/pages/checkout/CartStep.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../stores/useCartStore";
import useWishlistStore from "../../stores/useWishlistStore";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { MapPin, Heart, X, Truck, Package } from "lucide-react";

export default function CartStep({ onNext }) {
  const { cart, fetchCart, removeFromCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();

  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [addr, setAddr] = useState({ line: "", city: "", pin: "" });

  // ── fetch address ─────────────────────────────────────
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/user/profile/list`, {
        withCredentials: true,
      })
      .then((res) => {
        const d = res.data.data;
        if (d.address_line && d.city && d.pincode) {
          const full = `${d.address_line}, ${d.city}, ${d.pincode}`;
          setShippingAddress(full);
          setAddr({ line: d.address_line, city: d.city, pin: d.pincode });
        }
      })
      .catch(() => toast.error("Could not load address"))
      .finally(() => fetchCart().then(() => setLoading(false)));
  }, [fetchCart]);

  // ── quantity ───────────────────────────────────────────
  const updateQty = async (pid, qty) => {
    if (qty < 1) return removeFromCart(pid);
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/user/cart/${pid}`,
      { quantity: qty },
      { withCredentials: true }
    );
    await fetchCart();
  };

  // ── wishlist / remove ───────────────────────────────────
  const moveToWishlist = async (pidId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/wishlist`,
        { product_id: pidId },
        { withCredentials: true }
      );
      await addToWishlist(pidId);
      await removeFromCart(pidId);
      toast.success("Moved to wishlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  // ── save address ───────────────────────────────────────
  const saveAddress = async () => {
    const { line, city, pin } = addr;
    const full = `${line}, ${city}, ${pin}`;
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/user/profile/edit`,
      { address_line: line, city, pincode: pin },
      { withCredentials: true }
    );
    setShippingAddress(full);
    setIsEditing(false);
    toast.success("Address saved");
  };

  // ── continue ───────────────────────────────────────────
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

    onNext({
      cartItems: cart,
      shippingAddress,
      total: totalProductPrice,
      discount,
      orderTotal,
    });
  };

  // ── UI ─────────────────────────────────────────────────
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

  return (
    <div className="space-y-6">
      <Toaster />

      {/* ── ADDRESS CARD ── */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-purple-600 mt-1" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold">Delivery Address</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-600 text-sm underline"
            >
              Change
            </button>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              <input
                placeholder="Address line"
                value={addr.line}
                onChange={(e) => setAddr({ ...addr, line: e.target.value })}
                className="border rounded px-2 py-1"
              />
              <input
                placeholder="City"
                value={addr.city}
                onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                className="border rounded px-2 py-1"
              />
              <input
                placeholder="Pincode"
                value={addr.pin}
                onChange={(e) => setAddr({ ...addr, pin: e.target.value })}
                className="border rounded px-2 py-1"
              />
              <button
                onClick={saveAddress}
                className="col-span-full bg-green-600 text-white py-1 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-gray-700">{shippingAddress}</p>
          )}
        </div>
      </div>

      {/* ── PRODUCT CARDS ── */}
      {cart.map((item) => (
        <div
          key={item.product_id}
          className="bg-white rounded-lg shadow-sm border p-4 flex gap-4 items-start"
        >
          {/* Image */}
          <img
            src={item.product.front_photo || "https://placehold.co/80"}
            alt={item.product.name}
            className="w-20 h-20 object-cover rounded"
          />

          {/* Details */}
          <div className="flex-1">
            <p className="font-medium">{item.product.name}</p>

            {/* Price + Discount */}
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

            {/* Size & Qty */}
            <p className="text-sm text-gray-600 mt-1">
              Size: {item.size} | Qty: {item.quantity}
            </p>

            {/* Easy Returns */}
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Package className="w-3 h-3" />
              All issue easy returns
            </p>

            {/* Estimated Delivery */}
            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Estimated Delivery by Wed, 5th Nov
            </p>
          </div>

          {/* ── ACTIONS: Move | Remove (Meesho style) ── */}
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={() => moveToWishlist(item.product_id)}
              className="flex items-center gap-1 text-gray-700 hover:text-purple-600"
            >
              <Heart className="w-4 h-4" />
              Move to Wishlist
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => removeFromCart(item.product_id)}
              className="flex items-center gap-1 text-gray-700 hover:text-red-600"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* ── PRICE SUMMARY (NO "VIEW PRICE DETAILS") ── */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between text-sm">
          <span>Total Product Price</span>
          <span>₹{totalProductPrice}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Total Discounts</span>
            <span>- ₹{discount}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold mt-2 border-t pt-2">
          <span>Order Total</span>
          <span>₹{orderTotal}</span>
        </div>
      </div>

      {/* ── CONTINUE ── */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}