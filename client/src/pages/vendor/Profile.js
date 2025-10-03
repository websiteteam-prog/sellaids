// src/pages/dashboard/Profile.jsx
import React, { useState } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [vendor, setVendor] = useState({
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 9876543210",
    dob: "1985-06-15",
    gender: "Male",
    businessName: "Kumar Electronics Store",
    businessType: "Electronics",
    gstNumber: "27AABCU9603R1ZX",
    panNumber: "AABCU9603R",
    businessAddress: "123, MG Road, Bangalore, Karnataka - 560001",
    bankName: "State Bank of India",
    accountNumber: "1234567890",
    ifscCode: "SBIN0001234",
    accountHolder: "Rajesh Kumar",
    photo: null, // Will store base64 or uploaded image URL
  });

  // Form validation state
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(vendor).forEach((key) => {
      if (!vendor[key] && key !== "photo") {
        newErrors[key] = "This field is required";
      }
    });

    // Email validation
    if (vendor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendor.email)) {
      newErrors.email = "Invalid email address";
    }

    // Phone validation
    if (vendor.phone && !/^\+?\d{10,15}$/.test(vendor.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    // IFSC validation
    if (vendor.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(vendor.ifscCode)) {
      newErrors.ifscCode = "Invalid IFSC code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      alert("Profile saved successfully!");
      // Here you can call API to save vendor info
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
              vendor.firstName.charAt(0) + vendor.lastName.charAt(0)
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {vendor.firstName} {vendor.lastName}
            </h3>
            <p className="text-gray-500">{vendor.email}</p>
            <p className="text-gray-400 text-sm">{vendor.businessName}</p>
          </div>
        </div>
        <div>
          <input
            type="file"
            id="photoUpload"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setVendor({ ...vendor, photo: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <button
            onClick={() => document.getElementById("photoUpload").click()}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Change Photo
          </button>
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
              className={`py-3 border-b-2 text-sm font-medium flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-orange-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Personal Info */}
          {activeTab === "personal" && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Personal Information</h4>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "First Name", name: "firstName", type: "text" },
                  { label: "Last Name", name: "lastName", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone", name: "phone", type: "text" },
                  { label: "Date of Birth", name: "dob", type: "date" },
                  {
                    label: "Gender",
                    name: "gender",
                    type: "select",
                    options: ["Male", "Female", "Other"],
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm text-gray-600">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={vendor[field.name]}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                          errors[field.name] ? "border-red-500" : ""
                        }`}
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={vendor[field.name]}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                          errors[field.name] ? "border-red-500" : ""
                        }`}
                      />
                    )}
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </form>
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Business Info */}
          {activeTab === "business" && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Business Information</h4>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Business Name", name: "businessName" },
                  { label: "Business Type", name: "businessType" },
                  { label: "GST Number", name: "gstNumber" },
                  { label: "PAN Number", name: "panNumber" },
                  { label: "Business Address", name: "businessAddress", type: "textarea" },
                ].map((field) => (
                  <div key={field.name} className={field.name === "businessAddress" ? "md:col-span-2" : ""}>
                    <label className="block text-sm text-gray-600">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        name={field.name}
                        value={vendor[field.name]}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                          errors[field.name] ? "border-red-500" : ""
                        }`}
                      />
                    ) : (
                      <input
                        type="text"
                        name={field.name}
                        value={vendor[field.name]}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                          errors[field.name] ? "border-red-500" : ""
                        }`}
                      />
                    )}
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </form>
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Bank Details */}
          {activeTab === "bank" && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Bank Details</h4>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Bank Name", name: "bankName" },
                  { label: "Account Number", name: "accountNumber" },
                  { label: "IFSC Code", name: "ifscCode" },
                  { label: "Account Holder Name", name: "accountHolder" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm text-gray-600">{field.label}</label>
                    <input
                      type="text"
                      name={field.name}
                      value={vendor[field.name]}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </form>
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Change Password</h4>
              <form className="max-w-lg space-y-4">
                {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-600">
                      {field === "currentPassword"
                        ? "Current Password"
                        : field === "newPassword"
                        ? "New Password"
                        : "Confirm New Password"}
                    </label>
                    <input
                      type="password"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                ))}
              </form>
              <div className="mt-6">
                <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
