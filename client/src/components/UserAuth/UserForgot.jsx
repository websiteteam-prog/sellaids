import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { toast, Toaster } from "react-hot-toast"; // Import toast and Toaster from react-hot-toast

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useUserStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { success, data, message } = res.data;
      if (success) {
        login(data);
        setEmail("");
        setPassword("");

        // Show success toast
        toast.success("Login Successful ✅");

        // Delay the redirection slightly to ensure toast shows
        setTimeout(() => {
          navigate("/user");
        }, 2000); // Adjust time as needed
      } else {
        toast.error(message || "Login Failed ❌");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Invalid Credentials ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">LOGIN</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            required
          />
          <div className="relative mb-2">
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

          {/* Forgot Password Link */}
          <div className="text-right mb-4">
            <Link to="/UserAuth/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md"
          >
            LOGIN
          </button>
        </form>
        <div className="mt-5 text-center">
          Not registered?{" "}
          <Link to="/UserAuth/register" className="text-orange-600">
            Register
          </Link>
        </div>
      </div>
      <Toaster /> {/* Add this Toast container to your JSX */}
    </div>
  );
}

export default UserLogin;
