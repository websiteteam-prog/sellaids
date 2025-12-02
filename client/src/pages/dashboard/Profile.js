import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "../../stores/useUserStore";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function Profile() {
  const { user, isAuthenticated, isUserLoading, login, logout } = useUserStore();
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

  // === FETCH PROFILE ON MOUNT ===
  useEffect(() => {
    if (isUserLoading) return;

    if (!isAuthenticated || !user?.id) {
      toast.error("Please log in to view your profile [Error]", {
        duration: 2500,
      });
      navigate("/UserAuth/UserLogin", { replace: true });
      return;
    }

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
          toast.error("Session expired. Please log in again [Error]", {
            duration: 2500,
          });
          logout();
          navigate("/UserAuth/UserLogin", { replace: true });
        } else {
          toast.error("Failed to load profile [Error]", {
            duration: 2500,
          });
        }
      });
  }, [isAuthenticated, user, isUserLoading, navigate, logout]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditClick = () => setIsEditing(true);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  }, [isEditing]);

  const handleCancelEdit = () => {
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
        .catch(() => {});
    }
    setIsEditing(false);
  };

 
 // === MAIN SUBMIT HANDLER ===
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

    let passwordChanged = false;

    if (
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    ) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match! [Error]", {
          duration: 2500,
        });
        setLoading(false);
        return;
      }
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
      updateData.confirmPassword = formData.confirmPassword;
      passwordChanged = true;
    }

    const endpoint = `${process.env.REACT_APP_API_URL}/api/user/profile/edit`;
    const res = await axios.put(endpoint, updateData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    toast.success("Profile updated! [Success]", {
      duration: 2500,
    });

    // === PASSWORD CHANGED => LOGOUT ===
    if (passwordChanged) {
      toast.success("Password changed! Logging out for security... [Lock]", {
        duration: 3000,
      });

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/user/logout`,
            {},
            { withCredentials: true }
        );
      } catch (err) {
        console.warn("Backend logout failed (continuing anyway):", err);
      }

      logout();
      navigate("/UserAuth/UserLogin", { replace: true });
      return;
    }

    // === FETCH UPDATED PROFILE AGAIN ===
    try {
      const refreshed = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/profile/list`,
        { withCredentials: true }
      );

      login(refreshed.data.data);
    } catch (fetchErr) {
      console.error("Failed to refresh updated profile", fetchErr);
    }

    setIsEditing(false);
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    // === REDIRECT TO DASHBOARD AFTER NORMAL UPDATE ===
    navigate("/user");

  } catch (error) {
    if (error.response?.status === 401) {
      toast.error("Session expired. Logging out... [Error]", {
        duration: 2500,
      });
      logout();
      navigate("/UserAuth/UserLogin", { replace: true });
    } else if (error.response?.data?.error === "Current password is incorrect") {
      toast.error("Current password is wrong! [Error]", {
        duration: 2500,
      });
    } else if (error.response?.status === 400 && error.response?.data?.errors) {
      const errs = Array.isArray(error.response.data.errors)
        ? error.response.data.errors
        : error.response.data.errors.map((e) => e.msg);
      errs.forEach((msg) =>
        toast.error(msg + " [Error]", { duration: 2500 })
      );
    } else {
      toast.error(error.response?.data?.message || "Update failed [Error]", {
        duration: 2500,
      });
    }
  } finally {
    setLoading(false);
  }
};

  const togglePassword = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const formatAddress = () => {
    const { address_line, city, state, pincode } = formData;
    const parts = [address_line, city, state, pincode].filter(Boolean);
    return parts.length ? parts.join(", ") : "Not provided";
  };

  // === RENDER ===
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <Toaster
          position="top-right"
          toastOptions={{ duration: 2500 }}
        />
        <p className="text-center mt-10">Loading user...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user?.id) return null;

  return (
  <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md mt-6 sm:mt-10">
    <Toaster position="top-right" toastOptions={{ duration: 2500 }} />

    <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center sm:text-left">
      My Profile
    </h1>

    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          ref={nameInputRef}
          value={formData.name}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder={isEditing ? "Enter name" : ""}
          className={`w-full border rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:outline-none ${
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
          value={formData.email}
          disabled
          className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed text-sm sm:text-base"
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
          value={formData.phone}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
            setFormData({ ...formData, phone: digits });
          }}
          maxLength={10}
          disabled={!isEditing}
          placeholder={isEditing ? "Enter phone" : ""}
          className={`w-full border rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:outline-none ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="address_line" value={formData.address_line}
              onChange={handleChange} placeholder="Address line"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-red-500" />
            <input name="city" value={formData.city}
              onChange={handleChange} placeholder="City"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-red-500" />
            <input name="state" value={formData.state}
              onChange={handleChange} placeholder="State"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-red-500" />
            <input
              name="pincode" value={formData.pincode}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                setFormData({ ...formData, pincode: digits });
              }}
              placeholder="Pincode"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-red-500"
              maxLength={6}
            />
          </div>
        ) : (
          <div className="w-full border rounded-lg p-3 bg-gray-100 text-sm sm:text-base">
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
          
          {/* Each input responsive same as above */}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap justify-end gap-3 mt-4 sm:mt-6">
        {!isEditing ? (
          <button type="button" onClick={handleEditClick}
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 text-sm sm:text-base">
            Edit Profile
          </button>
        ) : (
          <>
            <button type="button" onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-5 py-2.5 rounded-lg hover:bg-gray-500 text-sm sm:text-base">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 text-sm sm:text-base disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </form>
  </div>
);
}