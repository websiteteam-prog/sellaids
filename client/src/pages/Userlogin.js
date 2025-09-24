import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/user/auth/login", {
        email,
        password,
      },{withCredentials: true});

      alert("Login Successful ✅");
      console.log(res.data);
      const { success } = res?.data
      if (success) {
        setEmail("")
        setPassword("")
        localStorage.setItem("user", JSON.stringify(res.data.user));
        // navigate('/login')
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
          LOGIN
        </h2>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 text-gray-700 font-medium shadow-sm hover:bg-gray-100 mb-5">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Login with Google
        </button>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            LOG IN
          </button>
        </form>

        {/* Links */}
        <div className="mt-5 text-center">
          <a
            href="/reset-password"
            className="text-orange-600 hover:underline font-medium"
          >
            Reset your password
          </a>
        </div>

        <div className="mt-3 text-center text-gray-700">
          Not registered yet?{" "}
          <a href="/register" className="text-orange-600 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
