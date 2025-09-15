import React, { useState } from "react";
import { Eye, Pencil, CheckCircle, XCircle, X } from "lucide-react";

const PendingProducts = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Red Dress",
            vendor: "Vendor A",
            email: "vendorA@example.com",
            address: "123 Market Street, Delhi",
            price: 1200,
            imageLink: "https://via.placeholder.com/100x100.png?text=Red+Dress",
            status: "pending",
        },
        {
            id: 2,
            name: "Blue Jeans",
            vendor: "Vendor B",
            email: "vendorB@example.com",
            address: "45 Mall Road, Mumbai",
            price: 2200,
            imageLink: "https://via.placeholder.com/100x100.png?text=Blue+Jeans",
            status: "pending",
        },
        {
            id: 3,
            name: "White Shirt",
            vendor: "Vendor C",
            email: "vendorC@example.com",
            address: "67 Fashion Street, Bangalore",
            price: 900,
            imageLink: "https://via.placeholder.com/100x100.png?text=White+Shirt",
            status: "pending",
        },

        {
            id: 3,
            name: "White Shirt",
            vendor: "Vendor C",
            email: "vendorC@example.com",
            address: "67 Fashion Street, Bangalore",
            price: 900,
            imageLink: "https://via.placeholder.com/100x100.png?text=White+Shirt",
            status: "pending",
        },
        {
            id: 3,
            name: "White Shirt",
            vendor: "Vendor C",
            email: "vendorC@example.com",
            address: "67 Fashion Street, Bangalore",
            price: 900,
            imageLink: "https://via.placeholder.com/100x100.png?text=White+Shirt",
            status: "pending",
        },
    ]);

    const [selectedProduct, setSelectedProduct] = useState(null); // edit modal
    const [viewProduct, setViewProduct] = useState(null); // view modal

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        vendor: "",
        price: "",
        email: "",
        address: "",
        imageLink: "",
        status: "pending",
    });

    const handleApprove = (id) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, status: "approved" } : p)));
        alert("Product Approved ✅");
    };

    const handleReject = (id) => {
        setProducts(products.filter((p) => p.id !== id));
        alert("Product Rejected ❌");
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setFormData(product);
    };

    const handleView = (product) => {
        setViewProduct(product);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        setProducts(products.map((p) => (p.id === formData.id ? formData : p)));
        setSelectedProduct(null);
        alert("Product details updated ✏️");
    };

    return (
        <div className="p-6">
            {/* Header without Add button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-1xl font-medium">Pending Products</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200 text-left">
                        <tr>
                            <th className="p-3 border">ID</th>
                            <th className="p-3 border">Product Name</th>
                            <th className="p-3 border">Vendor</th>
                            <th className="p-3 border">Price</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-100">
                                <td className="p-3 border">{p.id}</td>
                                <td className="p-3 border">{p.name}</td>
                                <td className="p-3 border">{p.vendor}</td>
                                <td className="p-3 border">₹{p.price}</td>
                                <td className="p-3 border">
                                    {p.status === "pending" ? (
                                        <span className="text-yellow-600 font-semibold">Pending</span>
                                    ) : (
                                        <span className="text-green-600 font-semibold">Approved</span>
                                    )}
                                </td>
                                <td className="p-3 border flex justify-center gap-3">
                                    <button
                                        onClick={() => handleView(p)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="text-orange-600 hover:text-orange-800"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    {p.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(p.id)}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleReject(p.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ==== EDIT MODAL ==== */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-lg font-semibold mb-4">Edit Product</h3>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Vendor</label>
                                <input
                                    type="text"
                                    name="vendor"
                                    value={formData.vendor}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                        </form>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==== VIEW MODAL ==== */}
            {viewProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
                        <button
                            onClick={() => setViewProduct(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-lg font-semibold mb-4">Product Details</h3>

                        <div className="space-y-3 text-sm">
                            <div><strong>ID:</strong> {viewProduct.id}</div>
                            <div><strong>Product Name:</strong> {viewProduct.name}</div>
                            <div><strong>Vendor:</strong> {viewProduct.vendor}</div>
                            <div><strong>Email:</strong> {viewProduct.email}</div>
                            <div><strong>Address:</strong> {viewProduct.address}</div>
                            <div><strong>Price:</strong> ₹{viewProduct.price}</div>
                            <div>
                                <strong>Image URL:</strong>{" "}
                                <a
                                    href={viewProduct.imageLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline break-all"
                                >
                                    {viewProduct.imageLink}
                                </a>
                            </div>
                            <div><strong>Status:</strong> {viewProduct.status}</div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setViewProduct(null)}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingProducts;
