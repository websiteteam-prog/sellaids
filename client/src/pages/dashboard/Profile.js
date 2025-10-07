import React, { useEffect, useState } from "react";
import useUserStore from "../../stores/useUserStore";
import axios from "axios";

export default function Profile() {
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:5000/api/user/profile/${user.id}`)
        .then((res) => {
          setFormData({ ...res.data, password: "" });
          setProfileImage(res.data.profile_image || null);
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
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
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Left + Overlay Upload */}
        <div className="flex items-center space-x-6">
          <div className="relative w-28 h-28">
            <img
              src={
                profileImage
                  ? profileImage instanceof File
                    ? URL.createObjectURL(profileImage)
                    : `http://localhost:5000/${profileImage}`
                  : "/default-avatar.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
            />

            {isEditing && (
              <label className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center text-white font-medium text-sm opacity-0 hover:opacity-100 cursor-pointer transition">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
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
            className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
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
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
