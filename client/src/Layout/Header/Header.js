import React from 'react';
import { MegaMenu, MensMegaMenu, KidsMegaMenu } from './MegaMenu';
import {
  User,
  Heart,
  Search,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';  // <-- import Link


const Header = () => {
  return (
    <>
      {/* Header */}
      <header className="bg-white shadow relative z-50">
        <nav className="max-w-7xl mx-auto flex justify-between items-center py-0.5 px-6">
          {/* Logo Image */}
          <div className="flex items-center">
            <a href="/landingpage">
              <img
                src="/logo.webp"
                alt="Sellaids Logo"
                className="h-[100px] w-auto object-contain"
              />
            </a>
          </div>


          {/* Navigation Menu */}
          <ul className="flex space-x-6 font-medium text-gray-700 items-center h-[60px]">
            {/* WOMEN */}
            <li className="relative group flex h-full items-center cursor-pointer">
              <div className="flex items-center hover:text-orange-500 space-x-1">
                <a>WOMEN</a>
                <ChevronDown size={16} />
              </div>
              {/* Dropdown */}

              <MegaMenu />
            </li>

            {/* MEN */}
            <li className="relative group flex h-full items-center cursor-pointer">
              <div className="flex items-center hover:text-orange-500 space-x-1">
                <a>MEN</a>
                <ChevronDown size={16} />
              </div>
              {/* Dropdown */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
                <MensMegaMenu />
              </div>
            </li>

            {/* KIDS */}
            <li className="relative group flex h-full items-center cursor-pointer">
              <div className="flex items-center hover:text-orange-500 space-x-1">
                <a>KIDS</a>
                <ChevronDown size={16} />
              </div>
              {/* Dropdown */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
                <KidsMegaMenu />
              </div>
            </li>

            {/* SELL WITH US */}
            <li>
              <Link to="/sellwithus" className="hover:text-orange-500">
                SELL WITH US
              </Link>
            </li>
          </ul>

          {/* Icons */}
          <div className="flex space-x-4 text-gray-600 items-center">
           <a href="/UserLogin">
          <User className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
         </a>
         <a href="/wishlist">
         <Heart className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
        </a>
        <a href="/search">
       <Search className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
       </a>
       <a href="/cart">
       <ShoppingCart className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
       </a>
      </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
