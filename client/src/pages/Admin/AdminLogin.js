import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useAdminStore } from "../../stores/useAdminStore";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, admin } = useAdminStore(); // admin state from store
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (admin) {
      navigate("/admin");
    }
  }, [admin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { success, data } = res.data;
      if (success) {
        login(data); // store admin data
        setEmail("");
        setPassword("");

        alert("Admin Login Successful ✅");
        navigate("/admin"); // redirect to dashboard
      } else {
        alert("Login Failed ❌");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Invalid Credentials ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          ADMIN LOGIN
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            required
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
              required
            />
            {password && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </span>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <Link to="/admin/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
          >
            LOGIN
          </button>
        </form>

        <div className="mt-5 text-center text-gray-500 text-sm">
          For authorized admin use only.
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
