// src/components/AddProductForm.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Removed Toaster from here

// Reusable Form Field
const FormField = ({ field, value, onChange, error, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(field.options || []);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (searchValue && Array.isArray(field.options)) {
      const filtered = field.options.filter((opt) =>
        opt.name
          ? opt.name.toLowerCase().includes(searchValue.toLowerCase())
          : opt.toString().toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(field.options || []);
    }
  }, [searchValue, field.options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selectedValue) => {
    onChange({
      target: { name: field.name, value: field.name === "productCategory" ? selectedValue.name : selectedValue },
    });
    setSearchValue("");
    setIsOpen(false);
  };

  const handleToggle = () => setIsOpen(!isOpen);

  // SELECT FIELDS
  if (
    field.type === "select" &&
    ["product_group", "fit", "size", "product_condition", "productCategory", "product_type", "invoice", "needs_repair", "original_box", "dust_bag"].includes(field.name)
  ) {
    return (
      <div className="flex flex-col" ref={wrapperRef}>
        <label className="text-gray-700 font-medium mb-1" data-field={field.name}>{field.label}</label>
        <div className="relative">
          <div
            className={`border rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            onClick={disabled ? null : handleToggle}
          >
            {value || `Select ${field.label}`}
          </div>
          {isOpen && !disabled && (
            <div className="absolute z-10 w-full bg-white border rounded-b mt-1 max-h-40 overflow-y-auto">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Search ${field.label}...`}
                className="border-b px-2 py-1 w-full focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    {field.name === "productCategory" ? opt.name : opt}
                  </div>
                ))
              ) : (
                <div className="px-2 py-1 text-gray-500">No options found</div>
              )}
            </div>
          )}
        </div>
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }

  // FILE
  if (field.type === "file") {
    return (
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1" data-field={field.name}>{field.label}</label>
        <input
          type="file"
          name={field.name}
          onChange={onChange}
          multiple={field.multiple}
          className="border rounded px-2 py-1"
          disabled={disabled}
          accept={field.accept || "*/*"}
        />
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }

  // CHECKBOX
  if (field.type === "checkbox") {
    return (
      <div className="flex items-center space-x-2">
        <input type="checkbox" name={field.name} checked={value} onChange={onChange} disabled={disabled} />
        <label className="text-gray-700 text-sm" data-field={field.name}>{field.label}</label>
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }

  // TEXTAREA
  if (field.type === "textarea") {
    return (
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1" data-field={field.name}>{field.label}</label>
        <textarea
          name={field.name}
          value={value}
          onChange={onChange}
          className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
          rows="4"
        />
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }

  // DEFAULT INPUT
  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium mb-1" data-field={field.name}>{field.label}</label>
      <input
        type={field.type || "text"}
        name={field.name}
        value={value}
        onChange={onChange}
        className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
        disabled={disabled}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

// MAIN COMPONENT
const AddProductForm = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = {
    product_group: "",
    productCategory: "",
    category_id: "",
    product_type: "",
    product_condition: "",
    fit: "",
    size: "",
    other_size: "",
    product_color: "",
    brand: "",
    model_name: "", // <-- REQUIRED
    invoice: "No",
    invoice_photo: null,
    needs_repair: "No",
    repair_photo: null,
    original_box: "No",
    dust_bag: "No",
    additional_items: "",
    front_photo: null,
    back_photo: null,
    label_photo: null,
    inside_photo: null,
    button_photo: null,
    wearing_photo: null,
    more_images: [],
    purchase_price: "",
    selling_price: "",
    reason_to_sell: "",
    purchase_year: "",
    purchase_place: "",
    product_link: "",
    additional_info: "",
    agree: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/product/categories-list`, { withCredentials: true });
        if (res.data.success) setCategories(res.data.data || []);
        else setApiError("Failed to load categories");
      } catch (err) {
        setApiError("Failed to load categories: " + (err.message || ""));
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // FETCH TYPES
  useEffect(() => {
    const fetchTypes = async () => {
      if (!formData.category_id) return setTypes([]);
      setIsLoadingTypes(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/product?category_id=${formData.category_id}`, {
          withCredentials: true,
        });
        if (res.data.success) setTypes(res.data.data.map((t) => t.name || t.type_name || ""));
        else setApiError("Failed to load types");
      } catch (err) {
        setApiError("Failed to load types: " + (err.message || ""));
      } finally {
        setIsLoadingTypes(false);
      }
    };
    fetchTypes();
  }, [formData.category_id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target || e;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "more_images" ? Array.from(files) : files[0],
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "productCategory") {
      const selectedCategory = categories.find((c) => c.name === value);
      setFormData((prev) => ({
        ...prev,
        productCategory: value,
        category_id: selectedCategory ? selectedCategory.id : "",
        product_type: "",
      }));
    } else if (name === "size" && value === "Other") {
      setFormData((prev) => ({ ...prev, size: value }));
    } else if (name === "size" && value !== "Other") {
      setFormData((prev) => ({ ...prev, size: value, other_size: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    const requiredFields = {
      1: ["product_group", "productCategory", "product_type", "product_condition", "fit", "brand", "model_name"],
      2: ["invoice", "needs_repair", "original_box", "dust_bag"],
      3: ["front_photo", "back_photo", "label_photo", "inside_photo", "button_photo", "wearing_photo"],
      4: ["purchase_price", "selling_price", "purchase_year", "agree"],
    };

    if (requiredFields[step]) {
      requiredFields[step].forEach((f) => {
        if (!formData[f] || (f === "agree" && !formData.agree)) {
          const label = document.querySelector(`[data-field="${f}"]`)?.textContent || f;
          newErrors[f] = `${label.replace("*", "").trim()} is required`;
        }
      });
    }

    if (step === 2 && formData.invoice === "Yes" && !formData.invoice_photo) {
      newErrors.invoice_photo = "Invoice photo is required";
    }
    if (step === 2 && formData.needs_repair === "Yes" && !formData.repair_photo) {
      newErrors.repair_photo = "Repair photo is required";
    }

    if (formData.size === "Other" && !formData.other_size?.trim()) {
      newErrors.other_size = "Custom size is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      setErrors({});
    } else {
      const firstError = Object.values(errors)[0];
      toast.error(firstError || "Please fill all required fields.");
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.dismiss();

    if (!validateStep()) {
      const firstError = Object.keys(errors).length > 0
        ? Object.values(errors)[0]
        : "Please fill all required fields.";
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "more_images" && Array.isArray(value)) {
          value.forEach((file) => file && data.append("more_images", file));
        } else if (value instanceof File && value) {
          data.append(key, value);
        } else if (key !== "productCategory" && key !== "agree" && value !== null && value !== "") {
          // Normal fields
          if (key !== "other_size") {
            data.append(key, value);
          }

          // When size is "Other", send size_other
          if (key === "other_size" && formData.size === "Other") {
            data.append("size_other", value.trim());
          }
        }
      });

      const res = await axios.post("http://localhost:5000/api/product/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Product added successfully!");
        setFormData(initialFormData);
        setStep(0);
        setErrors({});
      } else {
        toast.error(res.data.message || "Failed to add product");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Submission failed";
      toast.error(message);
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Guidelines", "Product", "Condition", "Image", "Price"];

  return (
    <div className="min-h-screen bg-gray-100 px-2 sm:px-4 py-4 sm:py-6">
      <div className="w-full sm:max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-2 sm:p-4 md:p-6">
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm border-l-4 border-red-500">
            {apiError}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-3 sm:mb-4">Add New Product</h2>
          <div className="hidden sm:block relative">
            <div className="flex justify-between items-center">
              {steps.map((stepName, index) => (
                <div key={index} className="flex-1 text-center relative z-10">
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold ${
                      step > index
                        ? "bg-orange-600 text-white"
                        : step === index
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
              {steps.map(
                (_, index) =>
                  index < step - 1 && (
                    <div
                      key={index}
                      className="absolute h-1 bg-orange-600"
                      style={{
                        width: `${100 / (steps.length - 1)}%`,
                        left: `${(100 / (steps.length - 1)) * index}%`,
                        top: 0,
                      }}
                    />
                  )
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* STEP 0: GUIDELINES */}
          {step === 0 && (
            <div className="col-span-full">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Guidelines</h3>
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-700">Seller Guidelines – Please Review Before Pickup</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 mt-2 space-y-1">
                  <li>Do not use the item after listing. It must remain in the same condition as shown in the photos.</li>
                  <li>
                    Please accurately select the product condition based on Sellaids classification:
                    <ul className="list-disc pl-5 mt-1">
                      <li>New – Unused, in original packaging/New: Up to 50% below MRP</li>
                      <li>Almost New – Minimal signs of use, excellent condition/Almost New: 50–60% below MRP</li>
                      <li>Hardly Ever Used – Very lightly used, no visible wear or tear/Hardly Ever Used: 60–70% below MRP</li>
                      <li>Good – Normal wear, fully functional/Good: More than 70% below MRP</li>
                      <li>Satisfactory – Heavily used, noticeable wear, but still functional/Satisfactory: More than 70% below MRP</li>
                    </ul>
                  </li>
                  <li>Upload clear, high-quality images (max 2 MB each).</li>
                  <li>Listings may take up to 7 days to go live to ensure optimal pricing.</li>
                  <li>Pickup will occur within 48 hours of sale.</li>
                  <li>Ensure the product is clean, washed, ironed, or dry-cleaned.</li>
                  <li>Package the item securely and label it with: SellAids' address as the recipient and your address as the sender.</li>
                  <li>Only genuine and authentic products are accepted. No counterfeits or replicas.</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 1: PRODUCT */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Product</h3>
              {[
                { name: "product_group", label: "Group *", type: "select", options: ["", "Men", "Women", "Girl", "Boy"] },
                { name: "productCategory", label: "Product Category *", type: "select", options: isLoadingCategories ? [{ name: "Loading..." }] : categories },
                { name: "product_type", label: "Product Type *", type: "select", options: isLoadingTypes ? ["Loading..."] : types },
                { name: "product_condition", label: "Product Condition *", type: "select", options: ["", "new", "like_new", "used", "damaged"] },
                { name: "fit", label: "Fit", type: "select", options: ["", "Slim", "Regular", "Loose", "Oversized", "Tailored", "Other"] },
                {
                  name: "size",
                  label: "Size *",
                  type: "select",
                  options: [
                    "", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "4xl", "5xl", "6xl",
                    "Kids-Upto 3 Months", "Kids-Upto 6 Months", "Kids- 6-9 Months", "Kids- 9-12 Months",
                    "Kids- 1-2 Years", "Kids- 3-4 Years", "Kids- 5-6 Years", "Kids- 7-8 Years",
                    "Kids- 9-10 Years", "Kids- 10-12 Years", "Kids- 13-14 Years", "K 15-16 Years", "Kids- 17-18 Years",
                    "Other"
                  ]
                },
                { name: "product_color", label: "Product Color", type: "text" },
                { name: "brand", label: "Brand *", type: "text" },
                { name: "model_name", label: "Model Name *", type: "text" },
              ].map((field) => (
                <React.Fragment key={field.name}>
                  {field.name === "size" ? (
                    <>
                      <FormField field={field} value={formData.size} onChange={handleChange} error={errors.size} />
                      {formData.size === "Other" && (
                        <div className="sm:col-span-2">
                          <label className="text-gray-700 font-medium mb-1" data-field="other_size">Other Size *</label>
                          <input
                            type="text"
                            name="other_size"
                            placeholder="Enter custom size (e.g. 28W x 32L)"
                            value={formData.other_size || ""}
                            onChange={handleChange}
                            className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          />
                          {errors.other_size && <span className="text-red-500 text-xs mt-1">{errors.other_size}</span>}
                        </div>
                      )}
                    </>
                  ) : (
                    <FormField
                      field={field}
                      value={formData[field.name]}
                      onChange={handleChange}
                      error={errors[field.name]}
                      disabled={field.name === "product_type" && !formData.productCategory}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* STEP 2: CONDITION */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Condition</h3>
              {[
                { name: "invoice", label: "Do You Have Invoice? *", type: "select", options: ["No", "Yes"] },
                { name: "invoice_photo", label: "Upload Invoice Photo", type: "file", accept: "image/*", disabled: formData.invoice !== "Yes" },
                { name: "needs_repair", label: "Your Product Needs Repair? *", type: "select", options: ["No", "Yes"] },
                { name: "repair_photo", label: "Repair Photo", type: "file", accept: "image/*", disabled: formData.needs_repair !== "Yes" },
                { name: "original_box", label: "Do You Have The Original Box? *", type: "select", options: ["No", "Yes"] },
                { name: "dust_bag", label: "Do You Have The Dust Bag? *", type: "select", options: ["No", "Yes"] },
                { name: "additional_items", label: "Any Additional Items? *", type: "textarea" },
              ].map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  error={errors[field.name]}
                  disabled={field.disabled}
                />
              ))}
              {formData.needs_repair === "Yes" && (
                <p className="text-gray-600 text-sm mt-1 col-span-full">Charges on repair will be extra</p>
              )}
            </div>
          )}

          {/* STEP 3: IMAGE */}
          {step === 3 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Image</h3>
                {[
                  { name: "front_photo", label: "Front Photo *", type: "file", accept: "image/*" },
                  { name: "back_photo", label: "Back Photo *", type: "file", accept: "image/*" },
                  { name: "label_photo", label: "Label/Logo Photo *", type: "file", accept: "image/*" },
                  { name: "inside_photo", label: "Inside/Close Up Material Image *", type: "file", accept: "image/*" },
                  { name: "button_photo", label: "Button/Studs/Zips/Work Image *", type: "file", accept: "image/*" },
                  { name: "wearing_photo", label: "Image Of Wearing/Carrying *", type: "file", accept: "image/*" },
                  { name: "more_images", label: "Upload More Images", type: "file", multiple: true, accept: "image/*" },
                ].map((field) => (
                  <FormField
                    key={field.name}
                    field={field}
                    value={formData[field.name]}
                    onChange={handleChange}
                    error={errors[field.name]}
                  />
                ))}
              </div>
              {/* Prevent Enter key from submitting on Image step */}
              <div
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                style={{ position: "absolute", left: "-9999px" }}
              />
            </>
          )}

          {/* STEP 4: PRICE */}
          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Price</h3>
              {[
                { name: "purchase_price", label: "Purchase Price (INR) *", type: "number" },
                { name: "selling_price", label: "Selling Price (INR) *", type: "number" },
                { name: "reason_to_sell", label: "Reason To Sell *", type: "text" },
                { name: "purchase_year", label: "Purchase Year *", type: "number" },
                { name: "purchase_place", label: "Purchase Place *", type: "text" },
                { name: "product_link", label: "Product Reference Link *", type: "url" },
                { name: "additional_info", label: "Additional Product Information *", type: "textarea" },
              ].map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  error={errors[field.name]}
                />
              ))}
              <div className="sm:col-span-full mt-4">
                <label className="flex items-start space-x-2">
                  <FormField
                    field={{ name: "agree", label: "I agree to the terms *", type: "checkbox" }}
                    value={formData.agree}
                    onChange={handleChange}
                    error={errors.agree}
                  />
                  <span className="text-sm text-gray-600">
                    By submitting this form, I agree to abide by our policies, terms and conditions, and seller declaration guidelines.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">
            {step > 0 && (
              <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors" disabled={isSubmitting}>
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button type="button" onClick={nextStep} className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors" disabled={isSubmitting}>
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>

        {/* <Toaster /> REMOVED FROM HERE */}
        {/* Add <Toaster /> only ONCE in App.jsx or main.jsx */}
      </div>
    </div>
  );
};

export default AddProductForm;