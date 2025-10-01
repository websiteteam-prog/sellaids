import React, { useState } from "react";

export default function Addresses() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Home Address",
      address: "123, MG Road, Delhi - 110001",
      phone: "+91 9876543210",
    },
  ]);

  const [form, setForm] = useState({
    label: "",
    address: "",
    phone: "",
  });

  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!form.label || !form.address) {
      alert("Please fill at least label and address");
      return;
    }

    if (editId) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editId ? { ...addr, ...form } : addr
        )
      );
      setEditId(null);
    } else {
      // Add new address
      setAddresses((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }

    setForm({ label: "", address: "", phone: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      // If currently editing this address, reset form
      if (editId === id) {
        setEditId(null);
        setForm({ label: "", address: "", phone: "" });
      }
    }
  };

  const handleEdit = (address) => {
    setEditId(address.id);
    setForm({
      label: address.label,
      address: address.address,
      phone: address.phone || "",
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ label: "", address: "", phone: "" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Address</h1>

      {/* Addresses List */}
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="bg-white p-4 rounded-xl shadow mb-4 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{addr.label}</p>
            <p>{addr.address}</p>
            {addr.phone && (
              <p className="text-sm text-gray-500">Phone: {addr.phone}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(addr)}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(addr.id)}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add/Edit Form */}
      <form
        onSubmit={handleAddOrUpdate}
        className="bg-white p-4 rounded-xl shadow space-y-4 max-w-md"
      >
        <input
          type="text"
          name="label"
          placeholder="Label (e.g. Home, Office)"
          value={form.label}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {editId ? "Update Address" : "+ Add New Address"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
