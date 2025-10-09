import React, { useState, useEffect } from "react";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [admin, setAdmin] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));
    if (storedAdmin) setAdmin(storedAdmin);

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/notifications");
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/admin/logout");
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("token");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("adminInfo");
      navigate("/admin/login");
    }
  };

  const handleNotificationClick = (notif) => {
    if (notif.type === "order") navigate("/admin/orders");
    if (notif.type === "vendor") navigate("/admin/vendors");
    if (notif.type === "user") navigate("/admin/users");
    setIsNotifOpen(false);
  };

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600 lg:hidden">
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Admin Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 relative">
        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            className="relative focus:outline-none"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <FaBell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-4 py-2 border-b font-semibold text-gray-700">
                Notifications
              </div>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b"
                  >
                    {notif.message}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No new notifications
                </div>
              )}
            </div>
          )}
        </div>

        {/* 👤 User Dropdown */}
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
                  {admin?.username || "Admin User"}
                </div>
                <div className="text-xs text-gray-500">
                  {admin?.email || "admin@example.com"}
                </div>
              </div>
              <button
                onClick={() => navigate("/admin/profile-settings")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
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
