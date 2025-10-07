// src/pages/dashboard/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import useUserStore from "../../stores/useUserStore";
import axios from "axios";

// --- Dashboard Home / Overview ---
const DashboardHome = ({ dashboardData }) => {
  const { totalOrders, pendingDeliveries, wishlistCount, supportTickets } = dashboardData || {};

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
      <p className="text-gray-700 mb-6">
        Welcome! Manage your account here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700 font-semibold mb-2">Total Orders</h3>
          <p className="text-2xl font-bold">{totalOrders || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700 font-semibold mb-2">Pending Deliveries</h3>
          <p className="text-2xl font-bold">{pendingDeliveries || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700 font-semibold mb-2">Wishlist Items</h3>
          <p className="text-2xl font-bold">{wishlistCount || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-700 font-semibold mb-2">Support Tickets</h3>
          <p className="text-2xl font-bold">{supportTickets || 0}</p>
        </div>
      </div>
    </div>
  );
};

// --- Profile Component ---
const Profile = () => {
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5000/api/user/profile/${user.id}`)
        .then(res => {
          setFormData({ ...res.data, password: "" });
          setProfileImage(res.data.profile_image || null);
        })
        .catch(err => console.error("Error fetching profile:", err));
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("full_name", formData.full_name);
      data.append("phone", formData.phone);
      if (formData.password) data.append("password", formData.password);
      if (profileImage && profileImage instanceof File) data.append("profile_image", profileImage);

      const res = await axios.put(`http://localhost:5000/api/user/profile/${user.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setIsEditing(false);
      setFormData({ ...res.data, password: "" });
      setProfileImage(res.data.profile_image || null);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={profileImage ? (profileImage instanceof File ? URL.createObjectURL(profileImage) : `http://localhost:5000/${profileImage}`) : "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
          />
          {isEditing && (
            <label className="mt-2 bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-700">
              Upload Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" value={formData.email || ""} disabled className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed focus:outline-none" />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Password */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          {!isEditing ? (
            <button type="button" onClick={() => setIsEditing(true)} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
              Edit Profile
            </button>
          ) : (
            <button type="submit" disabled={loading} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// --- Export a Full User Dashboard Page ---
const UserDashboard = () => {
  const { user } = useUserStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/user/${user.id}/dashboard`);
      setDashboardData(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      <DashboardHome dashboardData={dashboardData} />
      <Profile />
      {/* Wishlist, Orders, Addresses, Payments can be added here in similar pattern */}
    </div>
  );
};

export default UserDashboard;
