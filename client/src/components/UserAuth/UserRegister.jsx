import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      setFormData({ ...formData, [name]: value.replace(/\D/g, "").slice(0, 10) });
    } else if (name === "pincode") {
      setFormData({ ...formData, [name]: value.replace(/\D/g, "") });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/auth/register",
        {
          name: formData.name,
          phone: formData.mobile,
          email: formData.email,
          password: formData.password,
          address_line: formData.address_line,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Registration Successful ✅");
        navigate("/UserAuth/UserLogin");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration Failed ❌";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">REGISTER</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-gray-600 mb-1">
                Mobile
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={10}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-gray-600 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              {formData.password && (
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 top-[26px] flex items-center cursor-pointer text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="address_line" className="block text-gray-600 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address_line"
                name="address_line"
                placeholder="Address"
                value={formData.address_line}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" required
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-gray-600 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-gray-600 mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" required
              />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-gray-600 mb-1">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={10} required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/UserAuth/UserLogin")}
              className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold"
            >
              BACK TO LOGIN
            </button>
            <button
              type="submit"
              className="w-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 rounded-lg font-semibold"
            >
              REGISTER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;