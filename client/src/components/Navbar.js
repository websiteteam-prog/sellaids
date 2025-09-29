import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import useUserStore from "../stores/useUserStore"; // ✅ zustand store

export default function Navbar() {
  const user = useUserStore((s) => s.user); // ✅ get user from store
  const logout = useUserStore((s) => s.logout); // ✅ logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear user from zustand + localStorage
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow border-b">
      {/* Left: Welcome Message */}
      <h1 className="text-xl font-semibold text-gray-800">
        Welcome, <span className="text-red-600">{user?.name || "User"}</span>
      </h1>

      {/* Right: Icon Buttons */}
      <div className="flex items-center gap-4">
        <button
          className="text-gray-600 hover:text-red-600 transition-colors"
          title="Logout"
          onClick={handleLogout} // ✅ logout
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
