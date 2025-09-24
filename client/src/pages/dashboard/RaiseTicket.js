import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import raiseTicket from "../../api/raiseTicket"; // ✅ use API

export default function RaiseTicket() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await raiseTicket(form);
      alert(res.message || "Ticket submitted successfully!");

      // reset form
      setForm({ name: "", email: "", subject: "", message: "" });
      navigate("/user/support"); // redirect after success
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-6">Raise a Support Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
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
