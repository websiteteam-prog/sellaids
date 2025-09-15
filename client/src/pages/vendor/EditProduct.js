import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // text fields
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        sub_category: "",
        product_condition: "",
        material: "",
        brand: "",
        model_name: "",
        selling_price: "",
        purchase_price: "",
        reason_to_sell: "",
        purchase_year: "",
        purchase_place: "",
        seller_name: "",
        seller_email: "",
        seller_phone: "",
        pickup_address: "",
        apartment: "",
        city: "",
        state: "",
        pin_code: "",
        seller_additional_info: "",
    });

    // current images (from DB)
    const [current, setCurrent] = useState({
        front_photo: "",
        back_photo: "",
        logo_photo: "",
        inside_photo: "",
        button_photo: "",
        wearing_image: "",
        more_images: "", // comma separated string
        wearing_proof: "",
    });

    // new uploads
    const [files, setFiles] = useState({
        frontPhoto: null,
        backPhoto: null,
        labelPhoto: null,
        insidePhoto: null,
        buttonPhoto: null,
        wearingPhoto: null,
        moreImages: null, // FileList
        wearingProof: null,
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                const p = res.data || {};

                // set text
                setForm((f) => ({ ...f, ...p }));

                // set current images
                setCurrent({
                    front_photo: p.front_photo || "",
                    back_photo: p.back_photo || "",
                    logo_photo: p.logo_photo || "",
                    inside_photo: p.inside_photo || "",
                    button_photo: p.button_photo || "",
                    wearing_image: p.wearing_image || "",
                    more_images: p.more_images || "",
                    wearing_proof: p.wearing_proof || "",
                });
            } catch (e) {
                console.error(e);
                alert("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const onFile = (e) => {
        const { name, files: fl } = e.target;
        setFiles((s) => ({
            ...s,
            [name]: fl.length > 1 ? fl : fl[0],
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();

            // text fields
            Object.entries(form).forEach(([k, v]) => data.append(k, v ?? ""));

            // single files
            const fileKeys = [
                "frontPhoto",
                "backPhoto",
                "labelPhoto",
                "insidePhoto",
                "buttonPhoto",
                "wearingPhoto",
                "wearingProof",
            ];
            fileKeys.forEach((k) => {
                const f = files[k];
                if (f && f instanceof File) {
                    data.append(k, f);
                }
            });

            // multiple files
            if (files.moreImages && files.moreImages.length) {
                Array.from(files.moreImages).forEach((f) =>
                    data.append("moreImages", f)
                );
            }

            await axios.put(`http://localhost:5000/api/products/edit/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("✅ Product updated!");
            navigate("/vendor/my-products");
        } catch (err) {
            console.error(err);
            alert("❌ Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

    const img = (p) => (p ? `http://localhost:5000${p}` : "");

    return (
        <div
            className="edit-product-container"
            style={{ maxWidth: 720, margin: "30px auto" }}
        >
            <h2 className="myproducts-title">Edit Product</h2>

            <form onSubmit={onSubmit} className="product-form">
                <input
                    name="name"
                    value={form.name || ""}
                    onChange={onChange}
                    placeholder="Product Name"
                    className="form-control my-2"
                />
                <textarea
                    name="description"
                    value={form.description || ""}
                    onChange={onChange}
                    placeholder="Description"
                    className="form-control my-2"
                />
                <input
                    name="price"
                    type="number"
                    value={form.price || ""}
                    onChange={onChange}
                    placeholder="Price"
                    className="form-control my-2"
                />

                {/* current previews + uploaders */}
                <div className="grid-2">
                    <div>
                        <label>Front Photo</label>
                        {current.front_photo && (
                            <img alt="" src={img(current.front_photo)} className="preview-img" />
                        )}
                        <input type="file" name="frontPhoto" onChange={onFile} className="form-control my-1" />
                    </div>
                    <div>
                        <label>Back Photo</label>
                        {current.back_photo && (
                            <img alt="" src={img(current.back_photo)} className="preview-img" />
                        )}
                        <input type="file" name="backPhoto" onChange={onFile} className="form-control my-1" />
                    </div>
                    <div>
                        <label>Label/Logo Photo</label>
                        {current.logo_photo && (
                            <img alt="" src={img(current.logo_photo)} className="preview-img" />
                        )}
                        <input type="file" name="labelPhoto" onChange={onFile} className="form-control my-1" />
                    </div>
                    <div>
                        <label>Inside Photo</label>
                        {current.inside_photo && (
                            <img alt="" src={img(current.inside_photo)} className="preview-img" />
                        )}
                        <input type="file" name="insidePhoto" onChange={onFile} className="form-control my-1" />
                    </div>
                    <div>
                        <label>Button/Zip Photo</label>
                        {current.button_photo && (
                            <img alt="" src={img(current.button_photo)} className="preview-img" />
                        )}
                        <input type="file" name="buttonPhoto" onChange={onFile} className="form-control my-1" />
                    </div>
                    <div>
                        <label>Wearing Photo</label>
                        {current.wearing_image && (
                            <img alt="" src={img(current.wearing_image)} className="preview-img" />
                        )}
                        <input type="file" name="wearingPhoto" onChange={onFile} className="form-control my-1" />
                    </div>
                    <div className="col-span-2">
                        <label>More Images</label>
                        <div className="thumbs">
                            {current.more_images
                                ?.split(",")
                                .filter(Boolean)
                                .map((u, i) => (
                                    <img key={i} alt="" src={img(u)} className="thumb-img" />
                                ))}
                        </div>
                        <input type="file" name="moreImages" multiple onChange={onFile} className="form-control my-1" />
                    </div>
                    <div>
                        <label>Wearing Proof</label>
                        {current.wearing_proof && (
                            <img alt="" src={img(current.wearing_proof)} className="preview-img" />
                        )}
                        <input type="file" name="wearingProof" onChange={onFile} className="form-control my-1" />
                    </div>
                </div>

                <button disabled={saving} type="submit" className="btn btn-primary w-100 mt-3">
                    {saving ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
