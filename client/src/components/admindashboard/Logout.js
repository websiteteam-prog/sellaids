// src/components/admin/LogoutAdmin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminStore } from "../../stores/useAdminStore";

const LogoutAdmin = () => {
  const { logout } = useAdminStore(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Backend logout API call
      await axios.post("http://localhost:5000/api/admin/logout");

      // Zustand store clear
      logout();

      // Optional: localStorage clear
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("token");

      toast.success("Logged out successfully!");
      navigate("/admin/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, redirecting to login");

      // Even if API fails, clear store and localStorage
      logout();
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("token");
      navigate("/admin/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      Logout
    </button>
  );
};

export default LogoutAdmin;
