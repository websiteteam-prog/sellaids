// src/components/admin/LogoutAdmin.jsx
import React, { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminStore } from "../../stores/useAdminStore";

const LogoutAdmin = () => {
  const { logout, lastActivity, updateActivity, isAuthenticated } = useAdminStore();

  const handleLogout = async () => {
    try {
      // Backend logout API call
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/auth/logout`, {},{ withCredentials: true });

      const { success, message } = res.data

      console.log(res.data)

      if (success) {
        console.log(success)
        logout()
        localStorage.removeItem("admin-store")
        toast.success(message);
        // navigate("/admin-login", { replace: true });
        window.location.replace("/admin-login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed, redirecting to login");
    }
  };

  // ✅ Auto logout after 30 min inactivity
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      if (inactiveTime > 30 * 60 * 1000) { // 30 minutes
        toast.error("Session expired. Please login again.");
        handleLogout();
      }
    }, 60 * 1000); // check every 1 minute

    // 🖱️ Listen for user activity
    const activityHandler = () => updateActivity();
    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("keydown", activityHandler);
    window.addEventListener("click", activityHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("keydown", activityHandler);
      window.removeEventListener("click", activityHandler);
    };
  }, [lastActivity, isAuthenticated]);

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
