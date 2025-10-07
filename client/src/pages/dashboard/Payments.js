import React, { useEffect, useState } from "react";
import useUserStore from "../../stores/useUserStore";
import axios from "axios";

export default function Payments() {
  const { user } = useUserStore();

  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initialForm = { type: "", details: "", expiry: "" };
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  // Fetch user payments on load
  useEffect(() => {
    if (user?.id) fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/user/${user.id}/payments`);
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEditForm = (payment) => {
    setEditingId(payment.id);
    setForm({ type: payment.type, details: payment.details, expiry: payment.expiry || "" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type.trim() || !form.details.trim()) {
      alert("All required fields must be filled");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/user/${user.id}/payments/${editingId}`,
        form
      );
      setPayments(res.data);
      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update payment method");
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure to remove this payment method?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/user/${user.id}/payments/${id}`);
      setPayments(res.data);
      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
        setForm(initialForm);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to remove payment method");
    }
  };

  if (loading) return <p>Loading payments...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Payment Methods</h1>

      <div className="space-y-3 mb-4">
        {payments.map((payment) => (
          <div key={payment.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-medium">
                {payment.type}{" "}
                {payment.type.toLowerCase().includes("card") && payment.details.length >= 4
                  ? payment.details
                  : payment.details}
              </p>
              {payment.expiry && <p className="text-sm text-gray-500">Expiry: {payment.expiry}</p>}
            </div>
            <div className="flex gap-3">
              {!showForm && (
                <button
                  onClick={() => openEditForm(payment)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              )}
              {showForm && editingId === payment.id && (
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleRemove(payment.id)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && editingId && (
        <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded">
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
            disabled
          />
          <input
            type="text"
            name="details"
            value={form.details}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Save Changes
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
