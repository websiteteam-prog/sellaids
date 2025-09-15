import React, { useState } from "react";
import axios from "axios";


function Register() {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!mobile.trim()) {
      formErrors.mobile = "Mobile Number is required";
    } else if (!/^[0-9]{10}$/.test(mobile)) {
      formErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      formErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      formErrors.password =
        "Password must be 8+ chars with letters, numbers & one special character";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/register", {
        name:mobile,
        email,
        password,
      });
      alert("Registration Successful ✅");
      console.log(res.data);
    } catch (err) {
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          REGISTER
        </h2>

        <form onSubmit={handleRegister}>
          {/* Mobile Number */}
          <label className="block text-gray-700 font-medium mb-1">
            Mobile Number *
          </label>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className={`w-full border ${
              errors.mobile ? "border-red-500" : "border-gray-300"
            } rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mb-2">{errors.mobile}</p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email}</p>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">{errors.password}</p>
          )}

          {/* Password Hint */}
          <p className="text-sm text-gray-600 mb-4">
            (Password should be more than 8 characters with alphabets, numbers
            & one special character)
          </p>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            REGISTER
          </button>
        </form>

        {/* Links */}
        <div className="mt-5 text-center text-gray-700">
          Already registered?{" "}
          <a href="/login" className="text-orange-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;
