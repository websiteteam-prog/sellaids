import React, { useState } from "react";

export default function Payments() {
  const [payments, setPayments] = useState([
    { id: 1, type: "Visa", details: "**** 1234", expiry: "12/26" },
    { id: 2, type: "UPI", details: "anuj@upi" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means adding new

  const initialForm = { type: "", details: "", expiry: "" };
  const [form, setForm] = useState(initialForm);

  // Validation function
  const validateForm = () => {
    if (!form.type.trim()) {
      alert("Payment type is required");
      return false;
    }
    if (!form.details.trim()) {
      alert("Payment details are required");
      return false;
    }
    // Basic validations: For card type check digits, for UPI check '@'
    if (form.type.toLowerCase().includes("visa") || form.type.toLowerCase().includes("mastercard")) {
      // Check card number length (basic check for digits)
      const digitsOnly = form.details.replace(/\D/g, "");
      if (digitsOnly.length < 4) {
        alert("Card details should have at least last 4 digits");
        return false;
      }
    } else if (form.type.toLowerCase() === "upi") {
      if (!form.details.includes("@")) {
        alert("Invalid UPI ID format");
        return false;
      }
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEditForm = (payment) => {
    setEditingId(payment.id);
    setForm({
      type: payment.type,
      details: payment.details,
      expiry: payment.expiry || "",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      // Update existing
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, type: form.type, details: form.details, expiry: form.expiry }
            : p
        )
      );
    } else {
      // Add new
      setPayments((prev) => [
        ...prev,
        { id: Date.now(), type: form.type, details: form.details, expiry: form.expiry },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure to remove this payment method?")) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      // if editing the same, close form
      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
        setForm(initialForm);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Payment Methods</h1>

      <div className="space-y-3 mb-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {payment.type} {payment.details}
              </p>
              {payment.expiry && (
                <p className="text-sm text-gray-500">Expiry: {payment.expiry}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openEditForm(payment)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleRemove(payment.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {!showForm && (
        <button
          onClick={openAddForm}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          + Add Payment Method
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="type"
            placeholder="Payment Type (e.g. Visa, UPI)"
            value={form.type}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="details"
            placeholder="Details (e.g. **** 1234, anuj@upi)"
            value={form.details}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="expiry"
            placeholder="Expiry Date (optional, e.g. 12/26)"
            value={form.expiry}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              {editingId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(initialForm);
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
