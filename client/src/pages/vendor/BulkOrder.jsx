import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";

const BulkOrderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    catalogFile: null,
  });

  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormData((prev) => ({ ...prev, catalogFile: null }));
      setErrors((prev) => ({ ...prev, catalogFile: "Please upload filled catalog" }));
      return;
    }

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only .xlsx or .xls files allowed!");
      e.target.value = "";
      return;
    }

    const MAX_SIZE = 12 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("File size too large! Max 12MB allowed");
      setErrors((prev) => ({ ...prev, catalogFile: "File size must be under 12MB" }));
      e.target.value = "";
      setFormData((prev) => ({ ...prev, catalogFile: null }));
      return;
    }

    setFormData((prev) => ({ ...prev, catalogFile: file }));
    setErrors((prev) => ({ ...prev, catalogFile: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const phoneClean = formData.phone.replace(/\D/g, "");
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (phoneClean.length !== 10 && phoneClean.length !== 12) {
      newErrors.phone = "Enter valid 10-digit Indian number";
    } else if (phoneClean.length === 10 && !/^[6-9]/.test(phoneClean)) {
      newErrors.phone = "Indian numbers start with 6-9";
    }

    if (!formData.catalogFile) {
      newErrors.catalogFile = "Please upload filled catalog (.xlsx)";
    }

    if (!recaptchaValue) {
      newErrors.recaptcha = true;
      toast.error("Please complete reCAPTCHA");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Bulk Order Submitted:", {
      ...formData,
      catalogFileName: formData.catalogFile.name,
      fileSize: (formData.catalogFile.size / (1024 * 1024)).toFixed(2) + " MB",
    });

    toast.success("Bulk order request sent successfully!");

    setFormData({
      name: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      catalogFile: null,
    });

    setRecaptchaValue(null);
    setErrors({});
    const input = document.getElementById("catalog-upload");
    if (input) input.value = "";
  };

  // ⭐ DOWNLOAD BULK ORDER EXCEL
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/bulkorder.xlsx"; // File path in public/assets/
    link.download = "BulkOrder_Format.xlsx";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 border rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border rounded-md ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+919876543210"
                    className={`mt-1 block w-full px-4 py-2 border rounded-md ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* More Address Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* DOWNLOAD FORMAT BUTTON */}
              <div className="text-center py-4">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="text-orange-600 font-bold hover:underline text-lg"
                >
                  Download Bulk Order Excel Format
                </button>
              </div>

              <p className="text-sm text-center -mt-3 text-gray-600">
                Fill the catalog → Upload below <br />
                <span className="text-red-600 font-medium">
                  *Add at least 4 good images per product
                </span>
              </p>

              {/* FILE UPLOAD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 text-center">
                  Import Filled Catalog (Max 12MB) *
                </label>

                <div
                  className={`mt-2 p-6 border-2 border-dashed rounded-lg text-center ${
                    errors.catalogFile
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <input
                    type="file"
                    id="catalog-upload"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />

                  <label htmlFor="catalog-upload" className="cursor-pointer">
                    <p className="text-orange-600 font-medium">Choose File</p>
                    <p className="text-xs text-gray-500 mt-1">Max 12MB • Only .xlsx</p>
                  </label>

                  {formData.catalogFile && !errors.catalogFile && (
                    <p className="mt-3 text-green-600 font-medium">
                      {formData.catalogFile.name} (
                      {(formData.catalogFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {errors.catalogFile && (
                  <p className="text-red-600 text-center text-sm mt-2">
                    {errors.catalogFile}
                  </p>
                )}
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center py-4">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={(v) => setRecaptchaValue(v)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700"
              >
                SUBMIT BULK ORDER
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderForm;
