import React, { useState } from "react";

const VendorProductsApproval = () => {
    // Vendor products (example dummy data)
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Sneaker Shoes",
            vendor: "John Doe",
            price: "$50",
            status: "Pending",
        },
        {
            id: 2,
            name: "Blue Backpack",
            vendor: "Alice Smith",
            price: "$35",
            status: "Pending",
        },
        {
            id: 3,
            name: "Smart Watch",
            vendor: "Michael Lee",
            price: "$120",
            status: "Pending",
        },
    ]);

    // Approve Product
    const handleApprove = (id) => {
        setProducts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, status: "Approved" } : p
            )
        );
        alert("Product Approved and Published!");
    };

    // Reject Product
    const handleReject = (id) => {
        setProducts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, status: "Rejected" } : p
            )
        );
        alert("Product Rejected!");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b text-gray-600">
                        <th className="p-3">Product</th>
                        <th className="p-3">Vendor</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{p.name}</td>
                            <td className="p-3">{p.vendor}</td>
                            <td className="p-3">{p.price}</td>
                            <td className="p-3 font-semibold">{p.status}</td>
                            <td className="p-3 flex gap-2">
                                {p.status === "Pending" && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(p.id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(p.id)}
                                            className="px-3 py-1 bg-red-600 text-white rounded"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {p.status !== "Pending" && (
                                    <span className="text-gray-500">Action Taken</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VendorProductsApproval;
