import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useWishlistStore from "../../stores/useWishlistStore";

export default function RaiseTicket() {
  const [form, setForm] = useState({
    title: "", 
    message: "", 
  });
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const { user } = useWishlistStore();

  console.log(user?.id);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/support`,
        {
          title: form.title, 
          message: form.message, 
        },
        { withCredentials: true }
      );

      const { success, message, error } = res.data;

      if (success) {
        setForm({ title: "", message: "" });
        alert("Ticket raised successfully ✅");
        navigate("/user/support"); 
      } else {
        setError(error?.join(", ") || message || "Failed to raise ticket ❌");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      const errorMessage = err.response?.data?.error?.join(", ") || 
                         err.response?.data?.message || 
                         "Failed to raise ticket. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-6">Raise a Support Ticket</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="title" 
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <textarea
          name="message"
          placeholder="Describe your issue"
          value={form.message}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded min-h-[120px]"
          required
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
}