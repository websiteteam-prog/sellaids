import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "../../stores/useUserStore";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function Profile() {
  const { user, isAuthenticated, isUserLoading, login } = useUserStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
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

  const nameInputRef = useRef(null);

  // Fetch user profile
  useEffect(() => {
    // If user is loading, do nothing yet
    if (isUserLoading) return;

    // If not authenticated or no user ID, navigate immediately
    if (!isAuthenticated || !user?.id) {
      toast.error("Please log in to view your profile ❌");
      navigate("/UserAuth/UserLogin", {
        state: { from: window.location.pathname },
      });
      return;
    }

    // Fetch profile for authenticated user
    const endpoint = `${process.env.REACT_APP_API_URL}/api/user/profile/list`;
    axios
      .get(endpoint, { withCredentials: true })
      .then((res) => {
        const userData = res.data.data;
        setFormData({
          name: userData.name || userData.full_name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address_line: userData.address_line || "",
          city: userData.city || "",
          state: userData.state || "",
          pincode: userData.pincode || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again ❌");
          navigate("/UserAuth/UserLogin", {
            state: { from: window.location.pathname },
          });
        } else {
          console.error("Error fetching profile:", err);
          toast.error("Failed to fetch profile data ❌");
        }
      });
  }, [isAuthenticated, user, isUserLoading, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => nameInputRef.current?.focus?.(), 0);
    }
  }, [isEditing]);

  const handleCancelEdit = () => {
    // Restore original user data when cancelling edit
    if (user?.id) {
      const endpoint = `${process.env.REACT_APP_API_URL}/api/user/profile/list`;
      axios
        .get(endpoint, { withCredentials: true })
        .then((res) => {
          const userData = res.data.data;
          setFormData({
            name: userData.name || userData.full_name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address_line: userData.address_line || "",
            city: userData.city || "",
            state: userData.state || "",
            pincode: userData.pincode || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address_line: formData.address_line,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      // Include password fields only if provided
      if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("New password and confirm password do not match! ❌");
          setLoading(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
        updateData.confirmPassword = formData.confirmPassword;
      }

      const endpoint = `${process.env.REACT_APP_API_URL}/api/user/profile/edit`;
      const res = await axios.put(endpoint, updateData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      login(res.data); // Update user in store
      toast.success("Profile updated successfully! ✅");
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again ❌");
        navigate("/UserAuth/UserLogin", {
          state: { from: window.location.pathname },
        });
      } else if (error.response?.data?.error === "Current password is incorrect") {
        toast.error("Current password is incorrect! ❌");
        setLoading(false);
        return;
      } else if (error.response?.status === 400 && error.response?.data?.errors) {
        // Handle validation errors as toasts
        const errorMessages = Array.isArray(error.response.data.errors)
          ? error.response.data.errors
          : error.response.data.errors.map((err) => err.msg);
        errorMessages.forEach((errorMsg) => toast.error(errorMsg + " ❌"));
      } else {
        console.error("Error updating profile:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to update profile: Unknown error ❌");
      }
      setLoading(false);
    }
  };

  const togglePassword = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  // Format address for display
  const formatAddress = () => {
    const { address_line, city, state, pincode } = formData;
    const parts = [address_line, city, state, pincode].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  // Early return for loading user state
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <Toaster />
        <p className="text-center mt-10">Loading user...</p>
      </div>
    );
  }

  // Early return if not authenticated or no user ID (navigation handled in useEffect)
  if (!isAuthenticated || !user?.id) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            ref={nameInputRef}
            value={formData.name || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder={isEditing ? "Enter new full name" : ""}
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
            onChange={(e) => {
              // Allow only digits and limit to 10 characters
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
              setFormData({ ...formData, phone: digits });
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            disabled={!isEditing}
            placeholder={isEditing ? "Enter new phone" : ""}
            className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="address_line"
                  value={formData.address_line || ""}
                  onChange={handleChange}
                  placeholder="Enter address line"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode || ""}
                  onChange={(e) => {
                    // Allow only digits and limit to 6 characters
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setFormData({ ...formData, pincode: digits });
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="Enter pincode"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed">
              {formatAddress()}
            </div>
          )}
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
              onClick={handleEditClick}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
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