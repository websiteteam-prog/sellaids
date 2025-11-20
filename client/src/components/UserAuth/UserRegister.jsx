import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const SAMPLE_IMAGE = "/mnt/data/5a2938be-b733-4af5-8c87-b04132ca4e68.png"; 
// developer uploaded file path included as requested

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "", // will accept + and digits (E.164-like)
    email: "",
    password: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // field-level errors
  const [globalError, setGlobalError] = useState(""); // backend / submit errors
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Validation rules matching the backend schema
  const validators = {
    name: (val) => {
      if (!val || val.trim() === "") return "Name is required";
      if (val.trim().length < 2) return "Name must be at least 2 characters";
      if (val.trim().length > 100) return "Name must be at most 100 characters";
      return null;
    },
    email: (val) => {
      if (!val || val.trim() === "") return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.trim())) return "Invalid email";
      if (val.trim().length > 150) return "Email is too long";
      return null;
    },
    mobile: (val) => {
      if (!val || val.trim() === "") return "Phone number is required";
      const phoneRegex = /^\+?[1-9]\d{1,14}$/; // backend regex (E.164-like)
      if (!phoneRegex.test(val.trim())) return "Phone must be valid (digits, optional leading +)";
      return null;
    },
    password: (val) => {
      if (!val) return "Password is required";
      if (val.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(val)) return "Password must contain an uppercase letter";
      if (!/[a-z]/.test(val)) return "Password must contain a lowercase letter";
      if (!/[0-9]/.test(val)) return "Password must contain a number";
      if (!/[@$!%*?&]/.test(val)) return "Password must contain a special character (@$!%*?&)";
      return null;
    },
    pincode: (val) => {
      if (!val) return null; // optional
      if (!/^\d{5,10}$/.test(val)) return "Invalid pincode (5-10 digits)";
      return null;
    },
    address_line: (val) => {
      if (!val) return null;
      if (val.length > 255) return "Address too long (max 255 chars)";
      return null;
    },
    city: (val) => {
      if (!val) return null;
      if (val.length > 100) return "City too long (max 100 chars)";
      return null;
    },
    state: (val) => {
      if (!val) return null;
      if (val.length > 100) return "State too long (max 100 chars)";
      return null;
    },
  };

  // single-field validate (updates errors state)
  const validateField = (name, value) => {
    const fn = validators[name];
    if (!fn) return null;
    const err = fn(value);
    setErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  // full form validation, returns boolean
  const validateAll = () => {
    const newErrors = {};
    let hasError = false;
    Object.keys(validators).forEach((key) => {
      const err = validators[key](formData[key]);
      if (err) {
        newErrors[key] = err;
        hasError = true;
      }
    });
    setErrors(newErrors);
    return !hasError;
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    if (name === "mobile") {
      // allow leading + once, then digits; limit total length to 16 (including +)
      // remove all except digits and +, keep + only if first char
      const withPlus = value.startsWith("+");
      const digitsOnly = value.replace(/[^\d]/g, "");
      value = withPlus ? "+" + digitsOnly.slice(0, 15) : digitsOnly.slice(0, 15);
    } else if (name === "pincode") {
      // only digits, up to 10
      value = value.replace(/\D/g, "").slice(0, 10);
    } else {
      // normal trimming for text fields, but keep internal spaces
      value = value;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // real-time validate this field
    validateField(name, value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setGlobalError("");
    // Full validation first
    const ok = validateAll();
    if (!ok) {
      // focus first error field? keep simple: show errors
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/auth/register",
        {
          name: formData.name.trim(),
          phone: formData.mobile.trim(),
          email: formData.email.trim(),
          password: formData.password,
          address_line: formData.address_line.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        // success
        alert("Registration Successful ✅");
        // optional: clear form
        setFormData({
          name: "",
          mobile: "",
          email: "",
          password: "",
          address_line: "",
          city: "",
          state: "",
          pincode: "",
        });
        setErrors({});
        navigate("/UserAuth/UserLogin");
      } else {
        // server returned success:false
        const msg = res.data?.message || "Registration failed";
        setGlobalError(msg);
      }
    } catch (err) {
      console.error(err);
      // prefer backend message
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Registration Failed ❌";
      setGlobalError(message);
      // if backend returns field-wise errors, map them
      // example: { errors: { email: "Email exists" } }
      const backendFieldErrors = err.response?.data?.errors;
      if (backendFieldErrors && typeof backendFieldErrors === "object") {
        setErrors((prev) => ({ ...prev, ...backendFieldErrors }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-6">
        {/* sample image usage (developer file path included) */}
        <div className="flex justify-center mb-4">
          <img src={SAMPLE_IMAGE} alt="sample" className="w-28 h-20 object-cover rounded-md shadow-sm" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">REGISTER</h2>

        {/* global / submit error */}
        {globalError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
            {globalError}
          </div>
        )}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-gray-600 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.name ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="block text-gray-600 mb-1">Mobile</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="+911234567890 or 1234567890"
                value={formData.mobile}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.mobile ? "border-red-400" : "border-gray-300"}`}
                maxLength={16}
              />
              {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-gray-600 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.password ? "border-red-400" : "border-gray-300"}`}
              />
              {formData.password && (
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 top-[28px] flex items-center cursor-pointer text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              )}
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Address */}
            <div>
              <label htmlFor="address_line" className="block text-gray-600 mb-1">Address</label>
              <input
                type="text"
                id="address_line"
                name="address_line"
                placeholder="Address"
                value={formData.address_line}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.address_line ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.address_line && <p className="text-xs text-red-600 mt-1">{errors.address_line}</p>}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-gray-600 mb-1">City</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.city ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-gray-600 mb-1">State</label>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.state ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block text-gray-600 mb-1">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                placeholder="Pincode (5-10 digits)"
                value={formData.pincode}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.pincode ? "border-red-400" : "border-gray-300"}`}
                maxLength={10}
              />
              {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/UserAuth/UserLogin")}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold"
              disabled={loading}
            >
              BACK TO LOGIN
            </button>

            <button
              type="submit"
              className={`flex-1 text-white py-2 rounded-lg font-semibold ${loading ? "bg-orange-300" : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"}`}
              disabled={loading}
            >
              {loading ? "Registering..." : "REGISTER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
