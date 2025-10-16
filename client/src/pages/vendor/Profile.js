import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    businessName: "",
    businessType: "",
    gstNumber: "",
    panNumber: "",
    houseNo: "",
    streetName: "",
    city: "",
    state: "",
    pincode: "",
    contactPersonName: "",
    contactPersonPhone: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    photo: null,
    password: "", // store new password temporarily
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Fetch vendor data on login
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/vendor/profile");
        setVendor(data);
      } catch (error) {
        console.error("Error fetching vendor data", error);
      }
    };
    fetchVendorData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields({ ...passwordFields, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(vendor).forEach((key) => {
      if (!vendor[key] && key !== "photo" && key !== "designation" && key !== "houseNo" && key !== "streetName" && key !== "password") {
        newErrors[key] = "This field is required";
      }
    });

    if (vendor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendor.email)) newErrors.email = "Invalid email";
    if (vendor.phone && !/^\+?\d{10,15}$/.test(vendor.phone)) newErrors.phone = "Invalid phone";
    if (vendor.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(vendor.ifscCode)) newErrors.ifscCode = "Invalid IFSC";

    // Validate password if password form is shown
    if (showPasswordForm) {
      if (!passwordFields.currentPassword) newErrors.currentPassword = "Enter current password";
      if (!passwordFields.newPassword) newErrors.newPassword = "Enter new password";
      if (passwordFields.newPassword !== passwordFields.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const updateData = { ...vendor };
        if (showPasswordForm) {
          updateData.password = passwordFields.newPassword;
        }
        await axios.put("http://localhost:3000/api/vendor/profile", updateData);
        alert("Profile updated successfully!");
        setIsEditing(false);
        setShowPasswordForm(false);
        setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } catch (error) {
        console.error("Error updating profile", error);
        alert("Error updating profile");
      }
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
              <img src={vendor.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              vendor.name?.charAt(0)
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{vendor.name}</h3>
            <p className="text-gray-500">{vendor.email}</p>
            <p className="text-gray-400 text-sm">{vendor.businessName}</p>
          </div>
        </div>
        {isEditing && (
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
                  reader.onloadend = () => setVendor({ ...vendor, photo: reader.result });
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
        )}
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

        <div className="p-6">
          {/* Personal Info */}
          {activeTab === "personal" && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Personal Information</h4>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email", disabled: true },
                  { label: "Phone", name: "phone", type: "text" },
                  { label: "Designation", name: "designation", type: "text" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm text-gray-600">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={vendor[field.name]}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                          errors[field.name] ? "border-red-500" : ""
                        }`}
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={vendor[field.name]}
                        onChange={handleInputChange}
                        disabled={field.disabled || !isEditing}
                        className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                          errors[field.name] ? "border-red-500" : ""
                        }`}
                      />
                    )}
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                  </div>
                ))}
              </form>
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
                  { label: "House No", name: "houseNo" },
                  { label: "Street Name", name: "streetName" },
                  { label: "City", name: "city" },
                  { label: "State", name: "state" },
                  { label: "Pincode", name: "pincode" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm text-gray-600">{field.label}</label>
                    <input
                      type="text"
                      name={field.name}
                      value={vendor[field.name]}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
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
                {[
                  { label: "Bank Name", name: "bankName" },
                  { label: "Account Number", name: "accountNumber" },
                  { label: "IFSC Code", name: "ifscCode" },
                  {
                    label: "Account Type",
                    name: "accountType",
                    type: "select",
                    options: ["Saving", "Current"],
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm text-gray-600">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={vendor[field.name]}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                          errors[field.name] ? "border-red-500" : ""
                        }`}
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={field.name}
                        value={vendor[field.name]}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border rounded-lg px-3 py-2 mt-1 ${
                          errors[field.name] ? "border-red-500" : ""
                        }`}
                      />
                    )}
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                  </div>
                ))}
              </form>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Change Password</h4>
              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Change Password
                </button>
              ) : (
                <form className="max-w-lg space-y-4">
                  {[
                    { label: "Current Password", name: "currentPassword" },
                    { label: "New Password", name: "newPassword" },
                    { label: "Confirm Password", name: "confirmPassword" },
                  ].map((field) => (
                    <div key={field.name} className="relative">
                      <label className="block text-sm text-gray-600">{field.label}</label>
                      <input
                        type={showPassword[field.name] ? "text" : "password"}
                        name={field.name}
                        value={passwordFields[field.name]}
                        onChange={handlePasswordChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({ ...showPassword, [field.name]: !showPassword[field.name] })
                        }
                        className="absolute right-3 top-9 text-gray-500"
                      >
                        {showPassword[field.name] ? "Hide" : "Show"}
                      </button>
                      {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                    </div>
                  ))}
                </form>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setShowPasswordForm(false);
                    setPasswordFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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