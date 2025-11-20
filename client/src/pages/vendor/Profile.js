import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useVendorStore } from "../../stores/useVendorStore"

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    phone: "",
    business_name: "",
    business_type: "",
    gst_number: "",
    pan_number: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    account_type: "",
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Fetch vendor data
  const fetchVendorData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/vendor/profile",
        { withCredentials: true }
      );
      const vendorData = response.data.data || response.data;
      setVendor({
        name: vendorData.name || "",
        email: vendorData.email || "",
        phone: vendorData.phone || "",
        business_name: vendorData.business_name || "",
        business_type: vendorData.business_type || "",
        gst_number: vendorData.gst_number || "",
        pan_number: vendorData.pan_number || "",
        bank_name: vendorData.bank_name || "",
        account_number: vendorData.account_number || "",
        ifsc_code: vendorData.ifsc_code || "",
        account_type: vendorData.account_type || "",
        photo: vendorData.photo || null,
      });
    } catch (error) {
      console.error("Error fetching vendor data", error);
      toast.error("Failed to load profile data.");
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  // Handle password field change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields({ ...passwordFields, [name]: value });
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (activeTab === "personal") {
      if (!vendor.name) newErrors.name = "Name is required";
      if (!vendor.email) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendor.email))
        newErrors.email = "Invalid email";
      if (!vendor.phone) newErrors.phone = "Phone is required";
      else if (!/^\+?\d{10,15}$/.test(vendor.phone))
        newErrors.phone = "Invalid phone";
    }

    if (activeTab === "business") {
      if (!vendor.business_name)
        newErrors.business_name = "Business name is required";
      if (!vendor.business_type)
        newErrors.business_type = "Business type is required";
      if (!vendor.gst_number) newErrors.gst_number = "GST number is required";
      if (!vendor.pan_number) newErrors.pan_number = "PAN number is required";
    }

    if (activeTab === "bank") {
      if (!vendor.bank_name) newErrors.bank_name = "Bank name is required";
      if (!vendor.account_number)
        newErrors.account_number = "Account number is required";
      if (!vendor.ifsc_code) newErrors.ifsc_code = "IFSC code is required";
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(vendor.ifsc_code))
        newErrors.ifsc_code = "Invalid IFSC";
      if (!vendor.account_type)
        newErrors.account_type = "Account type is required";
    }

    if (activeTab === "security" && showPasswordForm) {
      if (!passwordFields.currentPassword)
        newErrors.currentPassword = "Current password is required";
      if (!passwordFields.newPassword)
        newErrors.newPassword = "New password is required";
      if (passwordFields.newPassword.length < 6)
        newErrors.newPassword = "New password must be at least 6 characters";
      if (passwordFields.newPassword !== passwordFields.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let endpoint = "";
      let updateData = {};

      if (activeTab === "personal") {
        endpoint = "http://localhost:5000/api/vendor/personal";
        updateData = {
          name: vendor.name,
          phone: vendor.phone,
        };
      } else if (activeTab === "business") {
        endpoint = "http://localhost:5000/api/vendor/business";
        updateData = {
          business_name: vendor.business_name,
          business_type: vendor.business_type,
          gst_number: vendor.gst_number,
          pan_number: vendor.pan_number,
        };
      } else if (activeTab === "bank") {
        endpoint = "http://localhost:5000/api/vendor/bank";
        updateData = {
          bank_name: vendor.bank_name,
          account_number: vendor.account_number,
          ifsc_code: vendor.ifsc_code,
          account_type: vendor.account_type,
        };
      } else if (activeTab === "security" && showPasswordForm) {
        endpoint = "http://localhost:5000/api/vendor/security";
        updateData = {
          currentPassword: passwordFields.currentPassword,
          newPassword: passwordFields.newPassword,
          confirmPassword: passwordFields.confirmPassword,
        };
      }

      await axios.put(endpoint, updateData, { withCredentials: true });

      // 🔹 If password updated, logout vendor automatically
      if (activeTab === "security") {
        try {
          // Call backend logout API
          await axios.post(
            "http://localhost:5000/api/vendor/auth/logout",
            {},
            { withCredentials: true }
          );

          // Clear Zustand store and local cookie store
          const { logout } = useVendorStore.getState();
          logout();
          localStorage.removeItem("vendor-store");

          toast.success("Password updated successfully! Please log in again.");

          // Redirect to login
          window.location.replace("/vendor/login");
        } catch (error) {
          console.error("Logout failed after password change:", error);
          toast.error("Password changed, but logout failed. Please login again.");
          window.location.replace("/vendor/login");
        }
      } else {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setErrors({});
      }
    } catch (error) {
      console.error("Error updating profile", error);
      const errorMessage =
        error.response?.data?.message || "Error updating profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Home / <span className="text-orange-600">Profile</span>
      </div>

      <h2 className="text-xl font-semibold mb-6">Profile</h2>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center text-white text-lg font-bold overflow-hidden">
            {vendor.photo ? (
              <img
                src={vendor.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              vendor.name?.charAt(0)
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{vendor.name}</h3>
            <p className="text-gray-500">{vendor.email}</p>
            <p className="text-gray-400 text-sm">{vendor.business_name}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b flex space-x-6 px-6 overflow-x-auto">
          {[
            { id: "personal", label: "Personal Info" },
            { id: "business", label: "Business Info" },
            { id: "bank", label: "Bank Details" },
            { id: "security", label: "Security" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 text-sm font-medium flex-shrink-0 ${activeTab === tab.id
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-500 hover:text-orange-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Personal Info */}
          {activeTab === "personal" && (
            <div>
              <h4 className="text-lg font-semibold mb-4">
                Personal Information
              </h4>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email", disabled: true },
                  { label: "Phone", name: "phone", type: "text" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm text-gray-600">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={vendor[field.name]}
                      onChange={handleInputChange}
                      disabled={field.disabled || !isEditing}
                      className={`w-full border rounded-lg px-3 py-2 mt-1 ${errors[field.name] ? "border-red-500" : ""
                        }`}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </form>
            </div>
          )}

          {/* Business Info */}
          {activeTab === "business" && (
            <div>
              <h4 className="text-lg font-semibold mb-4">
                Business Information
              </h4>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Business Name", name: "business_name" },
                  { label: "Business Type", name: "business_type" },
                  { label: "GST Number", name: "gst_number" },
                  { label: "PAN Number", name: "pan_number" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm text-gray-600">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={vendor[field.name]}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border rounded-lg px-3 py-2 mt-1 ${errors[field.name] ? "border-red-500" : ""
                        }`}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </form>
            </div>
          )}

          {/* Bank Details */}
          {activeTab === "bank" && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Bank Details</h4>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bank Name */}
                <div>
                  <label className="block text-sm text-gray-600">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={vendor.bank_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-3 py-2 mt-1 ${errors.bank_name ? "border-red-500" : ""
                      }`}
                  />
                  {errors.bank_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.bank_name}</p>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm text-gray-600">Account Number</label>
                  <input
                    type="text"
                    name="account_number"
                    value={vendor.account_number}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-3 py-2 mt-1 ${errors.account_number ? "border-red-500" : ""
                      }`}
                  />
                  {errors.account_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.account_number}</p>
                  )}
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block text-sm text-gray-600">IFSC Code</label>
                  <input
                    type="text"
                    name="ifsc_code"
                    value={vendor.ifsc_code}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-3 py-2 mt-1 uppercase ${errors.ifsc_code ? "border-red-500" : ""
                      }`}
                  />
                  {errors.ifsc_code && (
                    <p className="text-red-500 text-xs mt-1">{errors.ifsc_code}</p>
                  )}
                </div>

                {/* Account Type (enum: savings | current) */}
                <div>
                  <label className="block text-sm text-gray-600">Account Type</label>
                  {isEditing ? (
                    <select
                      name="account_type"
                      value={vendor.account_type || "savings"}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 mt-1 ${errors.account_type ? "border-red-500" : ""
                        }`}
                    >
                      {/* <option value="">Select Account Type</option> */}
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={
                        vendor.account_type
                          ? vendor.account_type.charAt(0).toUpperCase() +
                          vendor.account_type.slice(1)
                          : ""
                      }
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100"
                    />
                  )}
                  {errors.account_type && (
                    <p className="text-red-500 text-xs mt-1">{errors.account_type}</p>
                  )}
                </div>
              </form>
            </div>
          )}


          {/* Security */}
          {activeTab === "security" && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Change Password</h4>
              <form className="max-w-lg space-y-4">
                {[
                  {
                    label: "Current Password",
                    name: "currentPassword",
                    placeholder: "Enter current password",
                  },
                  {
                    label: "New Password",
                    name: "newPassword",
                    placeholder: "Enter new password",
                  },
                  {
                    label: "Confirm New Password",
                    name: "confirmPassword",
                    placeholder: "Confirm new password",
                  },
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <label className="block text-sm text-gray-600">
                      {field.label}
                    </label>
                    <input
                      type={showPassword[field.name] ? "text" : "password"}
                      name={field.name}
                      value={passwordFields[field.name]}
                      onChange={handlePasswordChange}
                      placeholder={field.placeholder}
                      disabled={isLoading || !isEditing}
                      className={`w-full border rounded-lg px-3 py-2 mt-1 ${errors[field.name] ? "border-red-500" : ""
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          [field.name]: !showPassword[field.name],
                        })
                      }
                      className="absolute right-3 top-9 text-gray-500 text-sm"
                      disabled={isLoading}
                    >
                      {showPassword[field.name] ? "Hide" : "Show"}
                    </button>
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </form>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            {!isEditing ? (
              <button
                onClick={() => {
                  setIsEditing(true);
                  if (activeTab === "security") setShowPasswordForm(true);
                }}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400"
                disabled={isLoading}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setShowPasswordForm(false);
                    setPasswordFields({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setErrors({});
                    fetchVendorData();
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;