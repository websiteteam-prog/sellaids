import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const MultiStepRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    designation: "",
    businessName: "",
    businessType: "",
    gstNumber: "",
    panNumber: "",
    houseNo: "",
    streetName: "",
    state: "",
    city: "",
    pincode: "",
    contactPersonName: "",
    contactPersonPhone: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    accountType: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (currentStep) => {
    let isValid = true;
    let fieldsToCheck = [];

    switch (currentStep) {
      case 1:
        fieldsToCheck = ["name", "phone", "email", "password"];
        break;
      case 2:
        fieldsToCheck = [
          "designation",
          "businessName",
          "businessType",
          "gstNumber",
          "panNumber",
        ];
        break;
      case 3:
        fieldsToCheck = ["houseNo", "streetName", "state", "city", "pincode"];
        break;
      case 4:
        fieldsToCheck = ["contactPersonName", "contactPersonPhone"];
        break;
      case 5:
        fieldsToCheck = [
          "accountNumber",
          "ifscCode",
          "bankName",
          "accountType",
        ];
        break;
      default:
        return true;
    }

    fieldsToCheck.forEach((field) => {
      if (!formData[field].trim()) {
        isValid = false;
      }
    });

    if (!isValid) {
      setMessage("❌ Please fill all required fields.");
    } else {
      setMessage("");
    }

    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      setMessage("❌ Please accept Terms & Conditions.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/vendor/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("✅ Registration successful!", {
        position: "top-right",
        duration: 2000,
      });
      setTimeout(() => navigate("/login"), 2000);
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        designation: "",
        businessName: "",
        businessType: "",
        gstNumber: "",
        panNumber: "",
        houseNo: "",
        streetName: "",
        state: "",
        city: "",
        pincode: "",
        contactPersonName: "",
        contactPersonPhone: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        accountType: "",
      });
      setStep(1);
      setAcceptTerms(false);
      setShowPassword(false);
    } catch (error) {
      toast.error("❌ Registration failed. Please try again.", {
        position: "top-right",
        duration: 3000,
      });
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Step 1: Basic Information
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className="absolute right-3 top-10 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Step 2: Business Details
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Business Type
              </label>
              <input
                type="text"
                name="businessType"
                placeholder="Business Type"
                value={formData.businessType}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                placeholder="PAN Number"
                value={formData.panNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );

      // steps 3 to 6 remain unchanged
      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Back
            </button>
          )}
          {step < 6 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={!acceptTerms}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          )}
        </div>
      </form>
      {message && (
        <p className="mt-4 text-center font-medium text-red-500">{message}</p>
      )}
      <Toaster />
    </div>
  );
};

export default MultiStepRegister;
