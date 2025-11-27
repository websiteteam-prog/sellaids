// src/pages/vendor/ProductEdit.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const FormField = ({ field, value, onChange, previewUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Select Field
  if (field.type === "select") {
    const options = field.options || [];
    const filtered = searchValue
      ? options.filter((opt) =>
          (opt.name || opt).toString().toLowerCase().includes(searchValue.toLowerCase())
        )
      : options;

    return (
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-2 text-sm md:text-base">
          {field.label}
        </label>
        <div className="relative">
          <div
            className={`border rounded-lg px-4 py-3 cursor-pointer bg-white text-sm md:text-base transition-all ${
              field.disabled ? "bg-gray-50 cursor-not-allowed" : "hover:border-orange-400"
            }`}
            onClick={() => !field.disabled && setIsOpen(!isOpen)}
          >
            {value ? (options.find(o => (o.id || o) == value)?.name || value) : `Select ${field.label}`}
          </div>

          {isOpen && !field.disabled && (
            <div className="absolute z-50 w-full bg-white border mt-1 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 border-b focus:outline-none text-sm sticky top-0 bg-white"
                onClick={(e) => e.stopPropagation()}
              />
              {filtered.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onChange({ target: { name: field.name, value: opt.id || opt.name || opt } });
                    setIsOpen(false);
                    setSearchValue("");
                  }}
                  className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer text-sm"
                >
                  {opt.name || opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // File Field with Preview
  if (field.type === "file") {
    return (
      <div className="flex flex-col space-y-4">
        <label className="text-gray-700 font-medium text-sm md:text-base">
          {field.label}
        </label>

        {previewUrl && (
          <div className="mx-auto w-full max-w-xs">
            <img
              src={previewUrl}
              alt={field.label}
              className="w-full h-56 object-cover rounded-xl shadow-lg border border-gray-200"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        <input
          type="file"
          name={field.name}
          onChange={onChange}
          multiple={field.multiple}
          accept="image/*"
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-7 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer"
        />
      </div>
    );
  }

  // Textarea
  if (field.type === "textarea") {
    return (
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-2 text-sm md:text-base">
          {field.label}
        </label>
        <textarea
          name={field.name}
          value={value || ""}
          onChange={onChange}
          rows="4"
          className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>
    );
  }

  // Default Input
  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium mb-2 text-sm md:text-base">
        {field.label}
      </label>
      <input
        type={field.type || "text"}
        name={field.name}
        value={value || ""}
        onChange={onChange}
        className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
};

const ProductEdit = ({ product, onClose, onUpdateSuccess }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({});

  // Load Product + Fix Image URLs with Base URL
  useEffect(() => {
    if (!product) return;

    setFormData({
      category_id: product.category_id || product.category?.id || "",
      product_group: product.product_group || "",
      product_type: product.product_type || "",
      product_condition: product.product_condition || "",
      fit: product.fit || "",
      size: product.size_other ? "Other" : (product.size || ""),
      other_size: product.size_other || "",
      product_color: product.product_color || "",
      brand: product.brand || "",
      model_name: product.model_name || "",
      invoice: product.invoice || "No",
      needs_repair: product.needs_repair || "No",
      original_box: product.original_box || "No",
      dust_bag: product.dust_bag || "No",
      additional_items: product.additional_items || "",
      purchase_price: product.purchase_price || "",
      selling_price: product.selling_price || "",
      reason_to_sell: product.reason_to_sell || "",
      purchase_year: product.purchase_year || "",
      purchase_place: product.purchase_place || "",
      product_link: product.product_link || "",
      additional_info: product.additional_info || "",

      front_photo: null,
      back_photo: null,
      label_photo: null,
      inside_photo: null,
      button_photo: null,
      wearing_photo: null,
      invoice_photo: null,
      repair_photo: null,
      more_images: [],
    });

    // Full Image URLs with Base URL
    const previews = {};
    const keys = ["front_photo", "back_photo", "label_photo", "inside_photo", "button_photo", "wearing_photo", "invoice_photo", "repair_photo"];
    keys.forEach((key) => {
      if (product[key]) {
        const url = product[key];
        previews[key] = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
      }
    });
    setImagePreviews(previews);
  }, [product]);

  // Load Categories
  useEffect(() => {
    axios.get(`${API_URL}/api/product/categories-list`, { withCredentials: true })
      .then(res => res.data.success && setCategories(res.data.data || []))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // Load Types
  useEffect(() => {
    if (formData.category_id) {
      axios.get(`${API_URL}/api/product?category_id=${formData.category_id}`, { withCredentials: true })
        .then(res => {
          if (res.data.success) {
            setTypes(res.data.data.map(t => ({ id: t.id, name: t.name || t.type_name })));
          }
        });
    }
  }, [formData.category_id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files?.length > 0) {
      if (name === "more_images") {
        setFormData(prev => ({ ...prev, more_images: [...(prev.more_images || []), ...Array.from(files)] }));
      } else {
        const file = files[0];
        setFormData(prev => ({ ...prev, [name]: file }));
        setImagePreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
      }
    } else if (name === "category_id") {
      setFormData(prev => ({ ...prev, category_id: value, product_type: "" }));
      setTypes([]);
    } else if (name === "size") {
      setFormData(prev => ({
        ...prev,
        size: value,
        other_size: value === "Other" ? prev.other_size || "" : "",
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (!value || value === "") return;

      if (key === "more_images" && Array.isArray(value)) {
        value.forEach(file => data.append("more_images", file));
      } else if (value instanceof File) {
        data.append(key, value);
      } else if (key === "size" && value === "Other") {
        data.append("size", "Other");
        if (formData.other_size) data.append("size_other", formData.other_size);
      } else if (key !== "other_size") {
        data.append(key, value);
      }
    });

    try {
      setIsSubmitting(true);
      await axios.put(`${API_URL}/api/product/${product.id || product._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Product updated successfully!");
      onUpdateSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Product", "Condition", "Images", "Price & Details"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Edit Product</h2>
          <button onClick={onClose} className="text-4xl text-gray-500 hover:text-gray-800">×</button>
        </div>

        <div className="px-8 py-6 flex justify-center gap-8 md:gap-16 text-sm font-medium">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 ${step === i + 1 ? "text-orange-600" : "text-gray-500"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step === i + 1 ? "bg-orange-600" : "bg-gray-400"}`}>
                {i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="px-6 md:px-12 pb-10 space-y-12">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField field={{ name: "product_group", label: "Group *", type: "select", options: ["Men", "Women", "Girl", "Boy"] }} value={formData.product_group} onChange={handleChange} />
              <FormField field={{ name: "category_id", label: "Category *", type: "select", options: categories }} value={formData.category_id} onChange={handleChange} />
              <FormField field={{ name: "product_type", label: "Type *", type: "select", options: types }} value={formData.product_type} onChange={handleChange} disabled={!formData.category_id} />
              <FormField field={{ name: "product_condition", label: "Condition *", type: "select", options: ["new", "almost_new", "hardly_ever_used", "good", "satisfactory"] }} value={formData.product_condition} onChange={handleChange} />
              <FormField field={{ name: "fit", label: "Fit", type: "select", options: ["Slim", "Regular", "Loose", "Oversized", "Other"] }} value={formData.fit} onChange={handleChange} />
              <FormField field={{ name: "size", label: "Size *", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL", "Other"] }} value={formData.size} onChange={handleChange} />
              <FormField field={{ name: "product_color", label: "Color", type: "text" }} value={formData.product_color} onChange={handleChange} />
              <FormField field={{ name: "brand", label: "Brand *", type: "text" }} value={formData.brand} onChange={handleChange} />
              <FormField field={{ name: "model_name", label: "Model Name *", type: "text" }} value={formData.model_name} onChange={handleChange} />
              {formData.size === "Other" && (
                <div className="sm:col-span-2">
                  <FormField field={{ name: "other_size", label: "Other Size *", type: "text" }} value={formData.other_size} onChange={handleChange} />
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField field={{ name: "invoice", label: "Invoice? *", type: "select", options: ["No", "Yes"] }} value={formData.invoice} onChange={handleChange} />
              <FormField field={{ name: "invoice_photo", label: "Invoice Photo", type: "file" }} onChange={handleChange} previewUrl={imagePreviews.invoice_photo} />
              <FormField field={{ name: "needs_repair", label: "Needs Repair? *", type: "select", options: ["No", "Yes"] }} value={formData.needs_repair} onChange={handleChange} />
              <FormField field={{ name: "repair_photo", label: "Repair Photo", type: "file" }} onChange={handleChange} previewUrl={imagePreviews.repair_photo} />
              <FormField field={{ name: "original_box", label: "Original Box? *", type: "select", options: ["No", "Yes"] }} value={formData.original_box} onChange={handleChange} />
              <FormField field={{ name: "dust_bag", label: "Dust Bag? *", type: "select", options: ["No", "Yes"] }} value={formData.dust_bag} onChange={handleChange} />
              <div className="sm:col-span-2">
                <FormField field={{ name: "additional_items", label: "Additional Items", type: "textarea" }} value={formData.additional_items} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* STEP 3 - Images */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {["front_photo", "back_photo", "label_photo", "inside_photo", "button_photo", "wearing_photo"].map((key) => (
                <FormField key={key} field={{ name: key, label: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) + " *", type: "file" }} onChange={handleChange} previewUrl={imagePreviews[key]} />
              ))}
              <div className="lg:col-span-3">
                <FormField field={{ name: "more_images", label: "More Images (Optional)", type: "file", multiple: true }} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField field={{ name: "purchase_price", label: "Purchase Price (₹) *", type: "number" }} value={formData.purchase_price} onChange={handleChange} />
              <FormField field={{ name: "selling_price", label: "Selling Price (₹) *", type: "number" }} value={formData.selling_price} onChange={handleChange} />
              <FormField field={{ name: "reason_to_sell", label: "Reason to Sell", type: "text" }} value={formData.reason_to_sell} onChange={handleChange} />
              <FormField field={{ name: "purchase_year", label: "Purchase Year *", type: "number" }} value={formData.purchase_year} onChange={handleChange} />
              <FormField field={{ name: "purchase_place", label: "Purchase Place", type: "text" }} value={formData.purchase_place} onChange={handleChange} />
              <FormField field={{ name: "product_link", label: "Product Link", type: "url" }} value={formData.product_link} onChange={handleChange} />
              <div className="sm:col-span-2">
                <FormField field={{ name: "additional_info", label: "Additional Info", type: "textarea" }} value={formData.additional_info} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-10 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
              Cancel
            </button>
            <div className="flex gap-4">
              {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="px-8 py-3 bg-gray-300 rounded-lg font-medium">Back</button>}
              {step < 4 ? (
                <button type="button" onClick={() => setStep(step + 1)} className="px-12 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-lg">
                  Next
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="px-14 py-3.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold text-lg shadow-xl">
                  {isSubmitting ? "Updating..." : "Update Product"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;