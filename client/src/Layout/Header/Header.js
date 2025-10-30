import React, { useState, useEffect } from "react";
import { MegaMenu, MensMegaMenu, KidsMegaMenu } from "./MegaMenu";
import { User, Heart, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import axios from "axios";
import toast from "react-hot-toast";
import SearchOverlay from "../../components/SearchOverlay";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [womenCategories, setWomenCategories] = useState([]);
  const [menCategories, setMenCategories] = useState([]);
  const [kidsCategories, setKidsCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/category`,
          { withCredentials: true }
        );

        const { success, data, message } = res.data;
        console.log(data)

        if (success && Array.isArray(data)) {
          const women = data.find(cat => cat.slug === "women");
          const men = data.find(cat => cat.slug === "men");
          const kids = data.find(cat => cat.slug === "kids");
          setWomenCategories(women);
          setMenCategories(men);
          setKidsCategories(kids);
          // toast.success(message || "Categories fetched successfully");
        } else {
          toast.error(message || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
        // toast.error("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/auth/logout",
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
      navigate("/wishlist");
    } else {
      navigate("/UserAuth/UserLogin");
    }
  };

  return (
    <header className="bg-white shadow relative z-40">

      <nav className="max-w-7xl mx-auto flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/landingpage">
            <img src="/logo.webp" alt="Logo" className="h-[80px] sm:h-[100px] w-auto" />
          </Link>
        </div>

        {/* Navigation menu (hidden on mobile, shown on sm+) */}
        <ul className="hidden sm:flex space-x-4 md:space-x-6 font-medium text-gray-700 items-center h-[60px]">

          {/* 🟣 WOMEN */}
          <li className="relative group flex h-full items-center cursor-pointer">
            <Link
              to={`/product-category/${womenCategories?.slug}`}
              className="flex items-center hover:text-orange-500 space-x-1"
            >
              <span>{womenCategories?.name}</span>
              <ChevronDown size={16} />
            </Link>

            {/* Mega Menu */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 
                        group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
              <MegaMenu womenCategories={womenCategories} />
            </div>
          </li>

          {/* 🔵 MEN */}
          <li className="relative group flex h-full items-center cursor-pointer">
            <Link
              to={`/product-category/${menCategories?.slug}`}
              className="flex items-center hover:text-orange-500 space-x-1"
            >
              <span>{menCategories?.name}</span>
              <ChevronDown size={16} />
            </Link>

            {/* Mega Menu */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 
                        group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
              <MensMegaMenu menCategories={menCategories} />
            </div>
          </li>

          {/* 🟢 KIDS */}
          <li className="relative group flex h-full items-center cursor-pointer">
            <Link
              to={`/product-category/${kidsCategories?.slug}`}
              className="flex items-center hover:text-orange-500 space-x-1"
            >
              <span>{kidsCategories?.name || "KIDS"}</span>
              <ChevronDown size={16} />
            </Link>

            {/* Dropdown */}
            <KidsMegaMenu kidsCategories={kidsCategories} />
          </li>

          {/* 🟠 SELL WITH US */}
          <li>
            <Link to="/sellwithus" className="hover:text-orange-500">
              SELL WITH US
            </Link>
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

        {/* Icons & User */}
        <div className="flex space-x-3 sm:space-x-4 text-gray-600 items-center relative">
          {user ? (
            <div className="flex items-center gap-3 cursor-pointer hover:text-orange-500">
              <User
                className="w-5 h-5"
                onClick={() => navigate("/user")} // When clicked, navigate to the Dashboard
              />
            </div>
          ) : (
            <Link to="/UserAuth/UserLogin">
              <User className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
            </Link>
          )}

          <div onClick={handleWishlistClick}>
            <Heart className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
          </div>

          <Search
            className="w-5 h-5 hover:text-orange-500 cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          />

          <Link to="/cart">
            <ShoppingCart className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
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

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;