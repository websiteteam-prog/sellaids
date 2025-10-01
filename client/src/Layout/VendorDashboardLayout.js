// src/Layout/VendorDashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ChevronDown,
  ChevronRight,
  PlusSquare,
  IndianRupee,
  User,
  LogOut,
} from "lucide-react";
import { useState } from "react";

export default function VendorDashboardLayout() {
  const [productOpen, setProductOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 p-4 border-b">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              V
            </div>
            <h2 className="text-lg font-bold text-gray-800">Vendor Panel</h2>
          </div>

          {/* Navigation */}
          <nav className="mt-4 space-y-1">
            {/* Dashboard */}
            <NavLink
              to="/vendor/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-orange-50 ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            {/* Products Dropdown */}
            <div>
              <button
                onClick={() => setProductOpen(!productOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <Package size={18} /> Products
                </div>
                {productOpen ? (
                  <ChevronDown size={16} className="text-gray-500" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>

              {productOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  <NavLink
                    to="/vendor/all-products"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-md hover:bg-orange-50 ${
                        isActive
                          ? "bg-orange-100 text-orange-600 font-medium"
                          : "text-gray-700"
                      }`
                    }
                  >
                    All Products
                  </NavLink>

                  <NavLink
                    to="/vendor/add-product"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-md hover:bg-orange-50 ${
                        isActive
                          ? "bg-orange-100 text-orange-600 font-medium"
                          : "text-gray-700"
                      }`
                    }
                  >
                    Add Product
                  </NavLink>
                </div>
              )}
            </div>

            {/* Earnings */}
            <NavLink
              to="/vendor/earnings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-orange-50 ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <IndianRupee size={18} /> Earnings
            </NavLink>

            {/* Profile */}
            <NavLink
              to="/vendor/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-orange-50 ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700"
                }`
              }
            >
              <User size={18} /> Profile
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <NavLink
            to="/logout"
            className="flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} /> Logout
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
