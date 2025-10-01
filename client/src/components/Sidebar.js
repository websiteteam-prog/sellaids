import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  Heart,
  HelpCircle,
  Menu,
  X
} from "lucide-react";

const menuItems = [
  { path: "/user", label: "Dashboard", icon: <Home size={18} /> },
  { path: "/user/orders", label: "My Orders", icon: <ShoppingBag size={18} /> },
  { path: "/user/profile", label: "Profile", icon: <User size={18} /> },
  { path: "/user/addresses", label: "Address", icon: <MapPin size={18} /> },
  { path: "/user/payments", label: "Payments", icon: <CreditCard size={18} /> },
  { path: "/user/wishlist", label: "Wishlist", icon: <Heart size={18} /> },
  { path: "/user/support", label: "Support", icon: <HelpCircle size={18} /> },
];

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center justify-between p-4 shadow bg-white fixed top-0 left-0 right-0 z-50">
        <div className="text-2xl font-bold text-red-600">MyShop</div>
        <button onClick={toggleSidebar}>
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="w-64 bg-white shadow-md hidden md:block min-h-screen">
        <div className="p-4 text-2xl font-bold text-red-600">MyShop</div>
        <nav className="mt-6">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 transition ${
                location.pathname === item.path
                  ? "bg-red-100 text-red-600 font-medium"
                  : "text-gray-700"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Drawer for Mobile */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <span className="text-2xl font-bold text-red-600">MyShop</span>
          <button onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 transition ${
                location.pathname === item.path
                  ? "bg-red-100 text-red-600 font-medium"
                  : "text-gray-700"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
