import React, { useState } from "react";
import axios from "axios";
import "../../App.css";

const AddProductForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1
        group: "",
        category: "",
        type: "",
        condition: "",
        fit: "",
        fitOther: "",
        size: "",
        sizeOther: "",

        // Step 2
        invoice: "No",
        invoicePhoto: null,
        needsRepair: "No",
        repairDetails: "",
        repairPhoto: null,
        originalBox: "No",
        dustBag: "No",
        additionalItems: "",

        // Step 3
        frontPhoto: null,
        backPhoto: null,
        labelPhoto: null,
        insidePhoto: null,
        buttonPhoto: null,
        wearingPhoto: null,
        moreImages: [],

        // Step 4
        purchasePrice: "",
        sellingPrice: "",
        reasonToSell: "",
        purchaseYear: "",
        purchasePlace: "",
        productLink: "",
        additionalInfo: "",

        // Step 5
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

    const vendorInfo = JSON.parse(localStorage.getItem("vendorInfo"));
    const vendorId = vendorInfo?.id;

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            if (name === "moreImages") {
                setFormData({ ...formData, [name]: files });
            } else {
                setFormData({ ...formData, [name]: files[0] });
            }
        } else if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!vendorId) {
            alert("Vendor ID missing. Please login again.");
            return;
        }

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value instanceof FileList) {
                    Array.from(value).forEach((file) => data.append(key, file));
                } else {
                    data.append(key, value);
                }
            });
            data.append("vendorId", vendorId);

            await axios.post("http://localhost:5000/api/products/add", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("✅ Product added successfully!");
            setFormData({});
            setStep(1);
        } catch (error) {
            console.error("Error adding product:", error);
            alert("❌ Failed to add product.");
        }
    };

    return (
        <div className="product-form-container">
            <h2 className="form-title">🛒 Add New Product</h2>
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <>
                        <h3>Step 1: Basic Details</h3>
                        <select name="group" onChange={handleChange} value={formData.group} required>
                            <option value="">Select Group</option>
                            <option>Men</option>
                            <option>Women</option>
                            <option>Girl</option>
                            <option>Boy</option>
                        </select>
                        <select name="category" onChange={handleChange} value={formData.category} required>
                            <option value="">Select Category</option>
                            <option>Bags</option>
                            <option>Watches</option>
                            <option>Accessories</option>
                            <option>Apparel</option>
                        </select>
                        <select name="type" onChange={handleChange} value={formData.type} required>
                            <option value="">Select Type</option>
                            <option>Lehenga</option>
                            <option>Skirt Set</option>
                            <option>Saree</option>
                            <option>Shirt</option>
                        </select>
                        <select name="condition" onChange={handleChange} value={formData.condition} required>
                            <option value="">Select Condition</option>
                            <option>New</option>
                            <option>Almost New</option>
                            <option>Used</option>
                        </select>
                        <select name="fit" onChange={handleChange} value={formData.fit}>
                            <option value="">Select Fit (Men Apparel)</option>
                            <option>Slim</option>
                            <option>Regular</option>
                            <option value="Other">Other</option>
                        </select>
                        {formData.fit === "Other" && (
                            <input type="text" name="fitOther" placeholder="Enter Fit" onChange={handleChange} />
                        )}
                        <select name="size" onChange={handleChange} value={formData.size}>
                            <option value="">Select Size</option>
                            <option>XXS</option>
                            <option>XS</option>
                            <option>S</option>
                            <option>M</option>
                            <option>L</option>
                            <option>XL</option>
                            <option>XXL</option>
                            <option>XXXL</option>
                            <option value="Other">Other</option>
                        </select>
                        {formData.size === "Other" && (
                            <input type="text" name="sizeOther" placeholder="Enter Size" onChange={handleChange} />
                        )}
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3>Step 2: Additional Info</h3>
                        <label>Do you have Invoice?</label>
                        <select name="invoice" onChange={handleChange} value={formData.invoice}>
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                        {formData.invoice === "Yes" && (
                            <input type="file" name="invoicePhoto" onChange={handleChange} />
                        )}
                        <label>Needs Repair?</label>
                        <select name="needsRepair" onChange={handleChange} value={formData.needsRepair}>
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                        {formData.needsRepair === "Yes" && (
                            <>
                                <input type="file" name="repairPhoto" onChange={handleChange} />
                                <textarea name="repairDetails" placeholder="Repair Details" onChange={handleChange}></textarea>
                            </>
                        )}
                        <label>Original Box?</label>
                        <select name="originalBox" onChange={handleChange} value={formData.originalBox}>
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                        <label>Dust Bag?</label>
                        <select name="dustBag" onChange={handleChange} value={formData.dustBag}>
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                        <textarea name="additionalItems" placeholder="Any Additional Items?" onChange={handleChange}></textarea>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h3>Step 3: Product Images</h3>
                        <input type="file" name="frontPhoto" onChange={handleChange} required />
                        <input type="file" name="backPhoto" onChange={handleChange} required />
                        <input type="file" name="labelPhoto" onChange={handleChange} required />
                        <input type="file" name="insidePhoto" onChange={handleChange} required />
                        <input type="file" name="buttonPhoto" onChange={handleChange} required />
                        <input type="file" name="wearingPhoto" onChange={handleChange} />
                        <input type="file" name="moreImages" multiple onChange={handleChange} />
                    </>
                )}

                {step === 4 && (
                    <>
                        <h3>Step 4: Pricing</h3>
                        <input type="number" name="purchasePrice" placeholder="Purchase Price" onChange={handleChange} required />
                        <input type="number" name="sellingPrice" placeholder="Selling Price" onChange={handleChange} required />
                        <textarea name="reasonToSell" placeholder="Reason to Sell" onChange={handleChange}></textarea>
                        <input type="text" name="purchaseYear" placeholder="Purchase Year" onChange={handleChange} />
                        <input type="text" name="purchasePlace" placeholder="Purchase Place" onChange={handleChange} />
                        <input type="text" name="productLink" placeholder="Product Reference Link" onChange={handleChange} />
                        <textarea name="additionalInfo" placeholder="Additional Product Info" onChange={handleChange}></textarea>
                    </>
                )}

                {step === 5 && (
                    <>
                        <h3>Step 5: Seller Info</h3>
                        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                        <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required />
                        <input type="text" name="address" placeholder="Pickup Address" onChange={handleChange} required />
                        <input type="text" name="apartment" placeholder="Apartment/Suite" onChange={handleChange} />
                        <input type="text" name="city" placeholder="City" onChange={handleChange} required />
                        <input type="text" name="state" placeholder="State" onChange={handleChange} required />
                        <input type="text" name="zip" placeholder="ZIP Code" onChange={handleChange} required />
                        <textarea name="sellerInfo" placeholder="Additional Info" onChange={handleChange}></textarea>
                        <label>
                            <input type="checkbox" name="agree" onChange={handleChange} required /> I agree to terms
                        </label>
                    </>
                )}

                <div style={{ marginTop: "20px" }}>
                    {step > 1 && <button type="button" onClick={prevStep}>⬅ Back</button>}
                    {step < 5 && <button type="button" onClick={nextStep}>Next ➡</button>}
                    {step === 5 && <button type="submit"> Submit Product</button>}
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;
