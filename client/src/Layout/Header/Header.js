import React, { useState } from "react";
import { MegaMenu, MensMegaMenu, KidsMegaMenu } from "./MegaMenu";
import { User, Heart, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import useCartStore from "../../stores/useCartStore"; // ← Cart store
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SearchOverlay from "../../components/SearchOverlay";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useUserStore();
  const { cart, fetchCart } = useCartStore(); // ← Get cart & fetch
  const cartCount = cart?.length || 0;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEmptyCart, setShowEmptyCart] = useState(false);

  // Optional: Refresh cart on mount if user is logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/auth/logout`,
        {},
        { withCredentials: true }
      );
      logout();
      toast.success("You have successfully logged out");
      setTimeout(() => navigate("/UserAuth/UserLogin"), 1500);
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed, please try again.");
    }
  };

  const handleWishlistClick = () => {
    if (user) {
      navigate("/user/wishlist");
    } else {
      navigate("/UserAuth/UserLogin");
    }
  };

  const handleCartClick = () => {
    if (cartCount === 0) {
      setShowEmptyCart(true);
    } else {
      navigate("/add-to-cart");
    }
  };

  return (
    <header className="bg-white shadow relative z-40">
      <Toaster position="top-right" />

      <nav className="max-w-7xl mx-auto flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/landingpage">
            <img src="/logo.webp" alt="Logo" className="h-[80px] sm:h-[100px] w-auto" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex space-x-4 md:space-x-6 font-medium text-gray-700 items-center h-[60px]">
          <li className="relative group flex h-full items-center cursor-pointer">
            <div className="flex items-center hover:text-orange-500 space-x-1">
              <span>WOMEN</span>
              <ChevronDown size={16} />
            </div>
            <MegaMenu />
          </li>
          <li className="relative group flex h-full items-center cursor-pointer">
            <div className="flex items-center hover:text-orange-500 space-x-1">
              <span>MEN</span>
              <ChevronDown size={16} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
              <MensMegaMenu />
            </div>
          </li>
          <li className="relative group flex h-full items-center cursor-pointer">
            <div className="flex items-center hover:text-orange-500 space-x-1">
              <span>KIDS</span>
              <ChevronDown size={16} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
              <KidsMegaMenu />
            </div>
          </li>
          <li>
            <Link to="/sellwithus" className="hover:text-orange-500">SELL WITH US</Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center">
          <button
            className="text-gray-700 hover:text-orange-500 mr-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Icons */}
        <div className="flex space-x-3 sm:space-x-4 text-gray-600 items-center relative">
          {/* User */}
          {user ? (
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-orange-500"
              onClick={() => navigate("/user")}
            >
              <User className="w-5 h-5" />
            </div>
          ) : (
            <Link to="/UserAuth/UserLogin">
              <User className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
            </Link>
          )}

          {/* Wishlist */}
          <div
            className="relative cursor-pointer"
            onClick={handleWishlistClick}
            onMouseEnter={(e) => {
              if (!user) {
                const tooltip = document.createElement("div");
                tooltip.innerText = "Please log in to view wishlist";
                tooltip.className = "absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50";
                e.currentTarget.appendChild(tooltip);
                setTimeout(() => tooltip.remove(), 2000);
              }
            }}
          >
            <Heart className="w-5 h-5 hover:text-orange-500" />
          </div>

          {/* Search */}
          <Search
            className="w-5 h-5 hover:text-orange-500 cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          />

          {/* CART ICON WITH BADGE */}
          <div
            className="relative cursor-pointer"
            onClick={handleCartClick}
          >
            <ShoppingCart className="w-5 h-5 hover:text-orange-500" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <ul className="sm:hidden flex flex-col space-y-4 font-medium text-gray-700 px-4 py-2 bg-white shadow-md">
          <li className="relative group">
            <div className="flex items-center hover:text-orange-500 space-x-1">
              <span>WOMEN</span>
              <ChevronDown size={16} />
            </div>
            <MegaMenu />
          </li>
          <li className="relative group">
            <div className="flex items-center hover:text-orange-500 space-x-1">
              <span>MEN</span>
              <ChevronDown size={16} />
            </div>
            <div className="mt-2">
              <MensMegaMenu />
            </div>
          </li>
          <li className="relative group">
            <div className="flex items-center hover:text-orange-500 space-x-1">
              <span>KIDS</span>
              <ChevronDown size={16} />
            </div>
            <div className="mt-2">
              <KidsMegaMenu />
            </div>
          </li>
          <li>
            <Link to="/sellwithus" className="hover:text-orange-500">SELL WITH US</Link>
          </li>
        </ul>
      )}

      {/* EMPTY CART MODAL */}
      {showEmptyCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center animate-fade-in">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty!</h3>
            <p className="text-sm text-gray-600 mb-6">Looks like you haven’t added anything yet.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowEmptyCart(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowEmptyCart(false);
                  navigate("/");
                }}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;