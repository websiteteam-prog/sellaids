import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import useCartStore from "../stores/useCartStore";


export default function Navbar() {
  const { user } = useUserStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();

  // Fetch cart items when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // Calculate total cart item count based on quantity
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow border-b">
      {/* Left: Welcome Message */}
      <h1 className="text-xl font-semibold text-gray-800">
        Welcome, <span className="text-red-600">{user?.name || "User"}</span>
      </h1>

      {/* Right: Cart Icon with Count */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/user/checkout")}
          className="relative text-gray-600 hover:text-blue-600 transition-colors"
          title="Cart"
        >
          <ShoppingCart size={20} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}