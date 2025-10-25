import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useUserStore } from "../../stores/useUserStore";

const UserLogout = () => {
  const { logout } = useUserStore();
  const navigate = useNavigate();

  // Function to clear all cookies
  const clearCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
  };

  const handleLogout = async () => {
    try {
      // Call backend logout API
      const res = await axios.post(
        "http://localhost:5000/api/user/auth/logout",
        {},
        { withCredentials: true }
      );

      const { success, message } = res.data;
      console.log(res.data);

      if (success) {
        // Clear Zustand store, localStorage, and cookies
        logout();
        localStorage.removeItem("user-store");
        clearCookies();

        toast.success(message || "Logged out successfully!");
        navigate("/UserAuth/UserLogin", { replace: true });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, redirecting to login");

      // Force clear everything even if API fails
      logout();
      localStorage.clear();
      sessionStorage.clear();
      clearCookies();

      navigate("/UserAuth/UserLogin", { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-50 w-full"
    >
      Logout
    </button>
  );
};

export default UserLogout;
