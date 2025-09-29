// src/pages/dashboard/Profile.jsx
import React, { useState } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Home / <span className="text-orange-600">Profile</span>
      </div>

      <h2 className="text-xl font-semibold mb-6">Profile</h2>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center text-white text-lg font-bold">
            RK
          </div>
          <div>
            <h3 className="text-lg font-semibold">Rajesh Kumar</h3>
            <p className="text-gray-500">rajesh.kumar@example.com</p>
            <p className="text-gray-400 text-sm">Kumar Electronics Store</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          Change Photo
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b flex space-x-6 px-6">
          {[
            { id: "personal", label: "Personal Info" },
            { id: "business", label: "Business Info" },
            { id: "bank", label: "Bank Details" },
            { id: "security", label: "Security" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 text-sm font-medium ${
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
              <h4 className="text-lg font-semibold mb-4">
                Personal Information
              </h4>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">First Name</label>
                  <input
                    type="text"
                    defaultValue="Rajesh"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Kumar"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    defaultValue="rajesh.kumar@example.com"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Phone</label>
                  <input
                    type="text"
                    defaultValue="+91 9876543210"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Date of Birth</label>
                  <input
                    type="date"
                    defaultValue="1985-06-15"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Gender</label>
                  <select required className="w-full border rounded-lg px-3 py-2 mt-1">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </form>
              <div className="mt-6">
                <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
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
                <div>
                  <label className="block text-sm text-gray-600">Business Name</label>
                  <input
                    type="text"
                    defaultValue="Kumar Electronics Store"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Business Type</label>
                  <input
                    type="text"
                    defaultValue="Electronics"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">GST Number</label>
                  <input
                    type="text"
                    defaultValue="27AABCU9603R1ZX"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">PAN Number</label>
                  <input
                    type="text"
                    defaultValue="AABCU9603R"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600">Business Address</label>
                  <textarea
                    defaultValue="123, MG Road, Bangalore, Karnataka - 560001"
                    rows="3"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  ></textarea>
                </div>
              </form>
              <div className="mt-6">
                <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
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
                <div>
                  <label className="block text-sm text-gray-600">Bank Name</label>
                  <input
                    type="text"
                    defaultValue="State Bank of India"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Account Number</label>
                  <input
                    type="text"
                    defaultValue="1234567890"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">IFSC Code</label>
                  <input
                    type="text"
                    defaultValue="SBIN0001234"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Account Holder Name</label>
                  <input
                    type="text"
                    defaultValue="Rajesh Kumar"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </form>
              <div className="mt-6">
                <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
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
                <div>
                  <label className="block text-sm text-gray-600">Current Password</label>
                  <input
                    type="password"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">New Password</label>
                  <input
                    type="password"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
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
