import React, { useEffect, useState } from "react";
import useWishlistStore from "../../stores/useWishlistStore";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const { user, setUser } = useWishlistStore();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Fetch user profile
  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:5000/api/user/profile/${user.id}`)
        .then((res) => {
          setFormData({
            ...formData,
            full_name: res.data.full_name,
            email: res.data.email,
            phone: res.data.phone,
          });
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        full_name: formData.full_name,
        phone: formData.phone,
      };

      // Validate password fields
      if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          alert("New password and confirm password do not match!");
          setLoading(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const res = await axios.put(
        `http://localhost:5000/api/user/profile/${user.id}`,
        updateData
      );

      setUser(res.data);
      alert("Profile updated successfully!");
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            disabled
            className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Password Section */}
        {isEditing && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Change Password
            </h2>

            {/* Current Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <span
                onClick={() => togglePassword("current")}
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
              >
                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <span
                onClick={() => togglePassword("new")}
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <span
                onClick={() => togglePassword("confirm")}
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
              >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-3">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
