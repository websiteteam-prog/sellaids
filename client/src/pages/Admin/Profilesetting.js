import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileSettings = () => {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  // Fetch current admin info (you can store it in localStorage after login)
  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));
    if (storedAdmin) {
      setAdmin({
        username: storedAdmin.username,
        password: storedAdmin.password,
      });
    }
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/update-profile/${storedAdmin.id}`,
        admin
      );
      setMessage(res.data.message);
      // Update localStorage
      localStorage.setItem(
        "adminInfo",
        JSON.stringify({ ...storedAdmin, ...admin })
      );
    } catch (error) {
      console.error(error);
      setMessage("Error updating profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Profile Settings
      </h2>

      {message && (
        <div className="mb-4 text-center text-sm text-green-600">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={admin.username}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={admin.password}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
