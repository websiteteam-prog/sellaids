// src/components/admindashboard/Header.js

import React, { useState } from "react";
import { FaBars, FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left - Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600 lg:hidden">
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Admin Dashboard
        </h1>
      </div>

      {/* Middle - Search */}
      <div className="hidden md:flex items-center relative w-1/3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute left-3 text-gray-400" size={14} />
      </div>

      {/* Right - Icons + User */}
      <div className="flex items-center gap-6 relative">
        {/* Notifications */}
        <div className="relative cursor-pointer">
          <FaBell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <FaUserCircle size={32} className="text-blue-600" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md py-2 z-50">
              <div className="px-4 py-2 border-b">
                <div className="text-sm font-medium text-gray-800">
                  Admin User
                </div>
                <div className="text-xs text-gray-500">admin@example.com</div>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
