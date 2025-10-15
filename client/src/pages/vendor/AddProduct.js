import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVendorStore } from '../../stores/useVendorStore'; 

const AddProductForm = () => {
  const [step, setStep] = useState(1);
  const vendorInfo = useVendorStore((state) => state.vendorInfo);
  const [formData, setFormData] = useState({
    group: "",
    productCategory: "",
    categoryId: "",
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
  const [apiError, setApiError] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setApiError(null);
        console.log("Fetching categories from:", `${process.env.REACT_APP_API_URL}/product/categories-list`);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/categories-list`, {
          withCredentials: true,
        });
        console.log("Categories response:", response.data);
        setCategories(response.data && Array.isArray(response.data) ? response.data : []);
        if (!response.data || !Array.isArray(response.data)) {
          console.warn("Categories API returned unexpected data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message, error.response?.data);
        setApiError("Failed to load product categories. Please check the backend or try again later.");
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch product types when category changes
  useEffect(() => {
    const fetchTypes = async () => {
      if (!formData.categoryId) {
        setTypes([]);
        setFormData((prev) => ({ ...prev, productType: "" }));
        return;
      }
      try {
        setIsLoadingTypes(true);
        setApiError(null);
        console.log("Fetching types from:", `${process.env.REACT_APP_API_URL}/product?category_id=${formData.categoryId}`);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/product?category_id=${formData.categoryId}`, {
          withCredentials: true,
        });
        console.log("Types response:", response.data);
        setTypes(response.data && Array.isArray(response.data) ? response.data : []);
        if (!response.data || !Array.isArray(response.data)) {
          console.warn("Types API returned unexpected data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching types:", error.message, error.response?.data);
        setApiError("Failed to load product types. Please check the backend or try again later.");
        setTypes([]);
      } finally {
        setIsLoadingTypes(false);
      }
    };
    fetchTypes();
  }, [formData.categoryId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      if (name === "moreImages") {
        setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "productCategory") {
      const selectedCategory = categories.find(cat => cat.name === value);
      setFormData((prev) => ({
        ...prev,
        productCategory: value,
        categoryId: selectedCategory ? selectedCategory.id : "",
        productType: "", // Reset product type when category changes
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    const requiredFields = {
      2: ["group", "productCategory", "productType", "brand"],
      3: ["invoice", "needsRepair", "originalBox", "dustBag"],
      4: ["frontPhoto", "backPhoto", "labelPhoto", "insidePhoto", "buttonPhoto", "wearingPhoto"],
      5: ["purchasePrice", "sellingPrice", "purchaseYear"],
    };

    if (requiredFields[step]) {
      requiredFields[step].forEach((field) => {
        if (!formData[field] || (field === "agree" && !formData.agree)) {
          newErrors[field] = "This field is required";
        }
      });
    }

    if (step === 3 && formData.invoice === "Yes" && !formData.invoicePhoto) {
      newErrors.invoicePhoto = "Please upload the invoice photo";
    }
    if (step === 3 && formData.needsRepair === "Yes" && !formData.repairPhoto) {
      newErrors.repairPhoto = "Please upload the repair photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 || validateStep()) {
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
          } else if (key !== "categoryId") {
            data.append(key, value);
          }
        }
      });
      data.append("vendorId", vendorInfo.id);

      await axios.post(`${process.env.REACT_APP_API_URL}/product/add`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("✅ Product added successfully!");
      setFormData({
        group: "",
        productCategory: "",
        categoryId: "",
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
      console.error("Error adding product:", error.message, error.response?.data);
      alert("❌ Failed to add product.");
    }
  };

  const steps = ["Guidelines", "Product", "Condition", "Image", "Price"];

  return (
    <div className="min-h-screen bg-gray-100 px-2 sm:px-4 py-4 sm:py-6">
      <div className="w-full sm:max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-2 sm:p-4 md:p-6">
        {/* API Error Message */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {apiError}
          </div>
        )}

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
            <div className="grid grid-cols-1 gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Guidelines</h3>
              <div className="sm:col-span-full">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Guidelines for Adding a Product:</strong><br />
                  1. Ensure all required fields (marked with *) are filled accurately.<br />
                  2. Select the appropriate group and category to help buyers find your product.<br />
                  3. Provide a clear and specific brand and model name for authenticity.<br />
                  4. Use the "Other Size" field if the standard size options do not apply.<br />
                  5. Be precise with product color to avoid confusion for buyers.<br />
                  6. Upload high-quality images to showcase the product’s condition clearly.<br />
                  7. Provide accurate pricing details to reflect the product’s value.<br />
                  8. Include any additional items or accessories to enhance the listing’s appeal.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Product</h3>
              {[
                { name: "group", label: "Group *", options: ["", "Men", "Women", "Girl", "Boy"] },
                {
                  name: "productCategory",
                  label: "Product Category *",
                  options: isLoadingCategories ? ["Loading..."] : categories.length ? categories.map(cat => cat.name || "Unnamed Category") : ["No categories available"],
                  disabled: isLoadingCategories || !categories.length,
                },
                {
                  name: "productType",
                  label: "Product Type *",
                  options: isLoadingTypes ? ["Loading..."] : types.length ? types.map(type => type.name || "Unnamed Type") : ["Select a category first"],
                  disabled: isLoadingTypes || !types.length || !formData.categoryId,
                },
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
                      disabled={field.disabled}
                    >
                      {field.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
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

          {step === 3 && (
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

          {step === 4 && (
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

          {step === 5 && (
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