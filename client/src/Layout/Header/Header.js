import React from "react";
import { MegaMenu, MensMegaMenu, KidsMegaMenu } from "./MegaMenu";
import { User, Heart, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  // Logout handler with API call and toast
  const handleLogout = async () => {
    try {
      // Call logout API
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });

      // Clear frontend user state
      logout();

      // Show success toast
      toast.success("You have successfully logged out");

      // Redirect to login page after short delay
      setTimeout(() => navigate("/UserLogin"), 1000);
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed, please try again.");
    }
  };

  return (
    <header className="bg-white shadow relative z-50">
      {/* Toast container */}
      <Toaster position="top-right" />

      <nav className="max-w-7xl mx-auto flex justify-between items-center py-0.5 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/landingpage">
            <img src="/logo.webp" alt="Logo" className="h-[100px] w-auto" />
          </Link>
        </div>

        {/* Navigation menu */}
        <ul className="flex space-x-6 font-medium text-gray-700 items-center h-[60px]">
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

        {/* Icons & User */}
        <div className="flex space-x-4 text-gray-600 items-center relative">
          {user ? (
            <div className="relative group">
              <div className="flex items-center cursor-pointer hover:text-orange-500 space-x-1">
                <span>{user.name}</span>
                <ChevronDown size={16} />
              </div>
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-orange-100">Dashboard</Link>

                {/* Logout button with toast */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-orange-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/UserLogin">
              <User className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
            </Link>
          )}

          <Link to="/wishlist"><Heart className="w-5 h-5 hover:text-orange-500 cursor-pointer" /></Link>
          <Link to="/search"><Search className="w-5 h-5 hover:text-orange-500 cursor-pointer" /></Link>
          <Link to="/cart"><ShoppingCart className="w-5 h-5 hover:text-orange-500 cursor-pointer" /></Link>
        </div>
      </nav>
    </header>
  );
};

export default Header