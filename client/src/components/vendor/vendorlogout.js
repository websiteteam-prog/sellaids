import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVendorStore } from "../../stores/useVendorStore";
import axios from "axios";
import toast from "react-hot-toast";

export default function VendorLogout() {
  const navigate = useNavigate();
  const { logout } = useVendorStore();

  const handleLogout = async () => {
    try {
      await axios.post("/api/vendor/logout"); // backend logout endpoint
      logout(); // clear vendor store
      navigate("/vendor/login"); // redirect to login
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-50 w-full"
    >
      <LogOut size={18} /> Logout
    </button>
  );
}
