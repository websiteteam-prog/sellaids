import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const MultiStepRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form data state with all fields
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    designation: "",
    business_name: "",
    business_type: "",
    gst_number: "",
    pan_number: "",
    house_no: "",
    street_name: "",
    state: "",
    city: "",
    pincode: "",
    contact_person_name: "",
    contact_person_phone: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
    account_type: "",
  });

  // Handle input changes and clear errors for the changed field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validation for each step
  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = "Name is required";
          isValid = false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
          newErrors.phone = "Phone is not valid";
          isValid = false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = "Email is not valid";
          isValid = false;
        }
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(formData.password)) {
          newErrors.password = "Password is not valid (must contain uppercase, number, special character, min 6 chars)";
          isValid = false;
        }
        break;
      case 2:
        if (!formData.business_name.trim()) {
          newErrors.business_name = "Business Name is required";
          isValid = false;
        }
        if (formData.business_type && !["restaurant", "grocery", "fashion", "electronics", "other"].includes(formData.business_type)) {
          newErrors.business_type = "Business Type is not valid";
          isValid = false;
        }
        if (formData.gst_number && !/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3})$/.test(formData.gst_number)) {
          newErrors.gst_number = "GST Number is not valid";
          isValid = false;
        }
        if (formData.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number)) {
          newErrors.pan_number = "PAN Number is not valid";
          isValid = false;
        }
        break;
      case 3:
        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
          newErrors.pincode = "Pincode is not valid";
          isValid = false;
        }
        break;
      case 4:
        if (formData.contact_person_phone && !/^\d{10}$/.test(formData.contact_person_phone)) {
          newErrors.contact_person_phone = "Contact Person Phone is not valid";
          isValid = false;
        }
        break;
      case 5:
        if (formData.account_number && !/^\d{9,18}$/.test(formData.account_number)) {
          newErrors.account_number = "Account Number is not valid";
          isValid = false;
        }
        if (formData.ifsc_code && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code)) {
          newErrors.ifsc_code = "IFSC Code is not valid";
          isValid = false;
        }
        if (formData.account_type && !["savings", "current"].includes(formData.account_type)) {
          newErrors.account_type = "Account Type is not valid";
          isValid = false;
        }
        if (!acceptTerms) {
          newErrors.acceptTerms = "Please accept Terms & Conditions";
          isValid = false;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Move to next step if current step is valid
  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 5) setStep((prev) => prev + 1);
    }
  };

  // Move to previous step
  const prevStep = () => {
    setStep((prev) => prev - 1);
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Form Data:", formData);

    // Validate all steps
    const allValid = [1, 2, 3, 4, 5].every((stepNum) => validateStep(stepNum));

    if (!allValid) {
      setIsLoading(false);
      toast.error("Please fix errors in the form", { position: "top-right", duration: 3000 });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/vendor/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("✅ Registration successful!", {
          position: "top-right",
          duration: 2000,
        });
        setTimeout(() => navigate("/vendor/login"), 2000);
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          password: "",
          designation: "",
          business_name: "",
          business_type: "",
          gst_number: "",
          pan_number: "",
          house_no: "",
          street_name: "",
          state: "",
          city: "",
          pincode: "",
          contact_person_name: "",
          contact_person_phone: "",
          account_number: "",
          ifsc_code: "",
          bank_name: "",
          account_type: "",
        });
        setStep(1);
        setAcceptTerms(false);
        setShowPassword(false);
        setErrors({});
      } else {
        toast.error(`❌ Registration failed: ${res.data.message || "Unknown error"}`, {
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(
        `❌ Server error: ${error.response?.data?.message || error.message || "Unknown error"}`,
        { position: "top-right", duration: 3000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Render form fields based on step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Step 1: Basic Information</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span
                className="absolute right-3 top-10 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Step 2: Business Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                placeholder="Enter Designation"
                value={formData.designation}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.designation ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Business Name *</label>
              <input
                type="text"
                name="business_name"
                placeholder="Enter Business Name"
                value={formData.business_name}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.business_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.business_name && <p className="text-red-500 text-sm mt-1">{errors.business_name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Business Type</label>
              <select
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.business_type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Business Type</option>
                <option value="restaurant">Restaurant</option>
                <option value="grocery">Grocery</option>
                <option value="fashion">Fashion</option>
                <option value="electronics">Electronics</option>
                <option value="other">Other</option>
              </select>
              {errors.business_type && <p className="text-red-500 text-sm mt-1">{errors.business_type}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">GST Number</label>
              <input
                type="text"
                name="gst_number"
                placeholder="Enter GST Number"
                value={formData.gst_number}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.gst_number ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.gst_number && <p className="text-red-500 text-sm mt-1">{errors.gst_number}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">PAN Number</label>
              <input
                type="text"
                name="pan_number"
                placeholder="Enter PAN Number"
                value={formData.pan_number}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pan_number ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.pan_number && <p className="text-red-500 text-sm mt-1">{errors.pan_number}</p>}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Step 3: Address</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">House No.</label>
              <input
                type="text"
                name="house_no"
                placeholder="Enter House No."
                value={formData.house_no}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.house_no ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.house_no && <p className="text-red-500 text-sm mt-1">{errors.house_no}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Street Name</label>
              <input
                type="text"
                name="street_name"
                placeholder="Enter Street Name"
                value={formData.street_name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.street_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.street_name && <p className="text-red-500 text-sm mt-1">{errors.street_name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                placeholder="Enter State"
                value={formData.state}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                placeholder="Enter City"
                value={formData.city}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                placeholder="Enter Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pincode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Step 4: Contact Person</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Contact Person Name</label>
              <input
                type="text"
                name="contact_person_name"
                placeholder="Enter Contact Person Name"
                value={formData.contact_person_name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contact_person_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contact_person_name && <p className="text-red-500 text-sm mt-1">{errors.contact_person_name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Contact Person Phone</label>
              <input
                type="text"
                name="contact_person_phone"
                placeholder="Enter Contact Person Phone"
                value={formData.contact_person_phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contact_person_phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contact_person_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_person_phone}</p>}
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Step 5: Bank Info</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input
                type="text"
                name="account_number"
                placeholder="Enter Account Number"
                value={formData.account_number}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.account_number ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.account_number && <p className="text-red-500 text-sm mt-1">{errors.account_number}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">IFSC Code</label>
              <input
                type="text"
                name="ifsc_code"
                placeholder="Enter IFSC Code"
                value={formData.ifsc_code}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ifsc_code ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.ifsc_code && <p className="text-red-500 text-sm mt-1">{errors.ifsc_code}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Bank Name</label>
              <input
                type="text"
                name="bank_name"
                placeholder="Enter Bank Name"
                value={formData.bank_name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bank_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.bank_name && <p className="text-red-500 text-sm mt-1">{errors.bank_name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Account Type</label>
              <select
                name="account_type"
                value={formData.account_type}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.account_type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Account Type</option>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
              </select>
              {errors.account_type && <p className="text-red-500 text-sm mt-1">{errors.account_type}</p>}
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                className="mr-2"
              />
              <label className="text-sm font-medium">I accept the Terms & Conditions</label>
              {errors.acceptTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>}
            </div>
          </>
        );
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
          {step < 5 ? (
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
              disabled={isLoading || !acceptTerms}
              className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 ${
                isLoading || !acceptTerms ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default MultiStepRegister;