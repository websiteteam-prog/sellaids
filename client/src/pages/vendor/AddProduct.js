import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVendorStore } from '../../stores/useVendorStore'; 

const AddProductForm = () => {
  const [step, setStep] = useState(1);
  const vendorInfo = useVendorStore((state) => state.vendorInfo);
  const [formData, setFormData] = useState({
    group: "",
    productCategory: "",
    productType: "",
    productCondition: "",
    fit: "",
    size: "",
    otherSize: "",
    productColor: "",
    brand: "",
    modelName: "",
    invoice: "No",
    invoicePhoto: null,
    needsRepair: "No",
    repairDetails: "",
    repairPhoto: null,
    originalBox: "No",
    dustBag: "No",
    additionalItems: "",
    frontPhoto: null,
    backPhoto: null,
    labelPhoto: null,
    insidePhoto: null,
    buttonPhoto: null,
    wearingPhoto: null,
    moreImages: [],
    purchasePrice: "",
    sellingPrice: "",
    reasonToSell: "",
    purchaseYear: "",
    purchasePlace: "",
    productLink: "",
    additionalInfo: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    sellerInfo: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    if (vendorInfo && step === 5) {
      setFormData((prev) => ({
        ...prev,
        name: vendorInfo.name || "",
        email: vendorInfo.email || "",
        phone: vendorInfo.phone || "",
        address: vendorInfo.houseNo || "",
        apartment: "",
        city: vendorInfo.city || "",
        state: vendorInfo.state || "",
        zip: vendorInfo.pincode || "",
      }));
    }
  }, [vendorInfo, step]);

  // Fetch categories and types from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/types`);
        setTypes(response.data || []);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchCategories();
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      if (name === "moreImages") {
        setFormData({ ...formData, [name]: Array.from(files) });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    const requiredFields = {
      1: ["group", "productCategory", "productType", "brand"],
      2: ["invoice", "needsRepair", "originalBox", "dustBag"],
      3: ["frontPhoto", "backPhoto", "labelPhoto", "insidePhoto", "buttonPhoto", "wearingPhoto"],
      4: ["purchasePrice", "sellingPrice", "purchaseYear"],
      5: ["name", "email", "phone", "address", "apartment", "city", "state", "zip", "agree"],
    };

    if (requiredFields[step]) {
      requiredFields[step].forEach((field) => {
        if (!formData[field] || (field === "agree" && !formData.agree)) {
          newErrors[field] = "This field is required";
        }
      });
    }

    if (step === 2 && formData.invoice === "Yes" && !formData.invoicePhoto) {
      newErrors.invoicePhoto = "Please upload the invoice photo";
    }
    if (step === 2 && formData.needsRepair === "Yes" && !formData.repairPhoto) {
      newErrors.repairPhoto = "Please upload the repair photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      setErrors({});
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (!vendorInfo?.id) {
      alert("Vendor ID missing. Please login again.");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof Array && key === "moreImages") {
          value.forEach((file) => data.append("moreImages", file));
        } else if (value instanceof File) {
          data.append(key, value);
        } else {
          if (key === "sellingPrice") {
            data.append("price", value);
          } else {
            data.append(key, value);
          }
        }
      });
      data.append("vendorId", vendorInfo.id);

      await axios.post("http://localhost:3000/api/products/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product added successfully!");
      setFormData({
        group: "",
        productCategory: "",
        productType: "",
        productCondition: "",
        fit: "",
        size: "",
        otherSize: "",
        productColor: "",
        brand: "",
        modelName: "",
        invoice: "No",
        invoicePhoto: null,
        needsRepair: "No",
        repairDetails: "",
        repairPhoto: null,
        originalBox: "No",
        dustBag: "No",
        additionalItems: "",
        frontPhoto: null,
        backPhoto: null,
        labelPhoto: null,
        insidePhoto: null,
        buttonPhoto: null,
        wearingPhoto: null,
        moreImages: [],
        purchasePrice: "",
        sellingPrice: "",
        reasonToSell: "",
        purchaseYear: "",
        purchasePlace: "",
        productLink: "",
        additionalInfo: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        zip: "",
        sellerInfo: "",
        agree: false,
      });
      setStep(1);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("❌ Failed to add product.");
    }
  };

  const steps = ["Product", "Condition", "Image", "Price", "Contact"];

  return (
    <div className="min-h-screen bg-gray-100 px-2 sm:px-4 py-4 sm:py-6">
      <div className="w-full sm:max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-2 sm:p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-3 sm:mb-4">
            Add New Product
          </h2>
          <div className="hidden sm:block relative">
            <div className="flex justify-between items-center">
              {steps.map((stepName, index) => (
                <div key={index} className="flex-1 text-center relative z-10">
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold ${
                      step > index + 1
                        ? "bg-orange-600 text-white"
                        : step === index + 1
                        ? "bg-orange-400 text-white"
                        : "bg-gray-200 text-gray-600"
                    } transition duration-200`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{stepName}</p>
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 z-0">
              {steps.map((_, index) => {
                if (index >= step - 1) return null;
                return (
                  <div
                    key={index}
                    className="absolute h-1 bg-orange-600"
                    style={{
                      width: `${100 / (steps.length - 1)}%`,
                      left: `${(100 / (steps.length - 1)) * index}%`,
                      top: 0,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Product</h3>
              {[
                { name: "group", label: "Group *", options: ["", "Men", "Women", "Girl", "Boy"] },
                { name: "productCategory", label: "Product Category *", options: categories },
                { name: "productType", label: "Product Type *", options: types },
                { name: "productCondition", label: "Product Condition", options: ["", "New", "Almost New", "Hardly Ever Used", "Good", "Satisfactory"] },
                { name: "fit", label: "Fit", options: ["", "Comfort Fit", "Slim Fit", "Regular Fit", "Others"] },
                { name: "size", label: "Size", options: ["", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "4xl", "5xl", "6xl", "Kids-Upto 3 Months", "Kids-Upto 6 Months", "Kids- 6-9 Months", "Kids- 9-12 Months", "Kids- 1-2 Years", "Kids- 3-4 Years", "Kids- 5-6 Years", "Kids- 7-8 Years", "Kids- 9-10 Years", "Kids- 10-12 Years", "Kids- 13-14 Years", "K 15-16 Years", "Kids- 17-18 Years"] },
                { name: "otherSize", label: "Other Size", type: "text" },
                { name: "productColor", label: "Product Color", type: "text" },
                { name: "brand", label: "Brand *", type: "text" },
                { name: "modelName", label: "Model Name", type: "text" },
              ].map((field) => (
                <div key={field.name} className={field.type === "text" ? "sm:col-span-full" : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === "text" ? (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200 ${
                        errors[field.name] ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={field.label.includes("*")}
                    />
                  ) : (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200 ${
                        errors[field.name] ? "border-red-500" : "border-gray-300"
                      }`}
                      required={field.label.includes("*")}
                    >
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option || `Select ${field.label.replace("*", "").toLowerCase()}`}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Condition</h3>
              {[
                { name: "invoice", label: "Do You Have Invoice?", options: ["No", "Yes"] },
                { name: "needsRepair", label: "Your Product Needs Repair?", options: ["No", "Yes"] },
                { name: "originalBox", label: "Do You Have The Original Box?", options: ["No", "Yes"] },
                { name: "dustBag", label: "Do You Have The Dust Bag?", options: ["No", "Yes"] },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              {formData.invoice === "Yes" && (
                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Invoice Photo</label>
                  <input
                    type="file"
                    name="invoicePhoto"
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 transition duration-200 ${
                      errors.invoicePhoto ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <p className="text-gray-500 text-xs mt-1">No file chosen</p>
                  {errors.invoicePhoto && (
                    <p className="text-red-500 text-xs mt-1">{errors.invoicePhoto}</p>
                  )}
                </div>
              )}
              {formData.needsRepair === "Yes" && (
                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">If Yes Then What Repair?</label>
                  <input
                    type="file"
                    name="repairPhoto"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 transition duration-200"
                  />
                  <p className="text-gray-500 text-xs mt-1">No file chosen</p>
                  {errors.repairPhoto && (
                    <p className="text-red-500 text-xs mt-1">{errors.repairPhoto}</p>
                  )}
                  <p className="text-gray-600 text-sm mt-1">Charges on repair will be extra</p>
                </div>
              )}
              <div className="sm:col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Any Additional Items?</label>
                <textarea
                  name="additionalItems"
                  value={formData.additionalItems}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
                  placeholder="Enter additional items"
                  rows="4"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Image</h3>
              {[
                { name: "frontPhoto", label: "Front Photo *", required: true },
                { name: "backPhoto", label: "Back Photo *", required: true },
                { name: "labelPhoto", label: "Label/Logo Photo *", required: true },
                { name: "insidePhoto", label: "Inside/ Close Up Material Image *", required: true },
                { name: "buttonPhoto", label: "Button/Studs/Zips/Work Image *", required: true },
                { name: "wearingPhoto", label: "Image Of Wearing/Carrying *", required: true },
                { name: "moreImages", label: "Upload more image", multiple: true },
              ].map((field) => (
                <div key={field.name} className="sm:col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    multiple={field.multiple}
                    className={`w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 transition duration-200 ${
                      errors[field.name] ? "border-red-500" : "border-gray-300"
                    }`}
                    required={field.required}
                  />
                  <p className="text-gray-500 text-xs mt-1">No file chosen</p>
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Price</h3>
              {[
                { name: "purchasePrice", label: "Purchase Price (INR) *", type: "number", required: true },
                { name: "sellingPrice", label: "Selling Price (INR) *", type: "number", required: true },
                { name: "reasonToSell", label: "Reason To Sell", type: "text" },
                { name: "purchaseYear", label: "Purchase Year *", type: "text", required: true },
                { name: "purchasePlace", label: "Purchase Place", type: "text" },
                { name: "productLink", label: "Product Reference Link", type: "text" },
                { name: "additionalInfo", label: "Additional Product Information", type: "textarea" },
              ].map((field) => (
                <div key={field.name} className={field.type === "textarea" ? "sm:col-span-full" : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200 text-xs"
                      placeholder="1. Tell us about the measurements if it’s a stitched garment (upper and bottom separate)\n2. Tell us about the colour of your product\n3. Tell us about the dry cleaning/handwash/machine wash instruction if any\n4. Tell us about the material of your product and give detailed description of your product"
                      rows="4"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200 ${
                        errors[field.name] ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Contact</h3>
              {[
                { name: "name", label: "Name *", type: "text", disabled: true },
                { name: "email", label: "Email Address *", type: "email", disabled: true },
                { name: "phone", label: "Phone Number *", type: "tel", disabled: true },
                { name: "address", label: "Pick-up Address *", type: "text", disabled: true },
                { name: "apartment", label: "Apartment, suite, etc *", type: "text" },
                { name: "city", label: "City *", type: "text", disabled: true },
                { name: "state", label: "State/Province *", type: "text", disabled: true },
                { name: "zip", label: "ZIP / Postal Code *", type: "text", disabled: true },
                { name: "sellerInfo", label: "Additional Information", type: "textarea" },
              ].map((field) => (
                <div key={field.name} className={field.type === "textarea" ? "sm:col-span-full" : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
                      placeholder="Enter additional info"
                      rows="4"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      disabled={field.disabled}
                      className={`w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none transition duration-200 ${
                        field.disabled
                          ? "bg-gray-100 cursor-not-allowed"
                          : "focus:ring-2 focus:ring-orange-400"
                      } ${errors[field.name] ? "border-red-500" : "border-gray-300"}`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={!field.disabled && field.label.includes("*")}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
              <div className="sm:col-span-full">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    className={`h-4 w-4 text-orange-600 focus:ring-orange-400 border-gray-300 rounded transition duration-200 ${
                      errors.agree ? "border-red-500" : ""
                    }`}
                    required
                  />
                  <span className="text-sm text-gray-600">By submitting this form, I agree to abide by our policies, terms and conditions, and seller declaration guidelines.</span>
                </label>
                {errors.agree && (
                  <p className="text-red-500 text-xs mt-1">{errors.agree}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
              >
                PREVIOUS
              </button>
            )}
            <div className="flex-1" />
            {step < 5 && (
              <button
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
              >
                NEXT
              </button>
            )}
            {step === 5 && (
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
              >
                SUBMIT
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;