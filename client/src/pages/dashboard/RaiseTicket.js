import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import raiseTicket from "../../api/raiseTicket"; // ✅ use API
import  useWishlistStore  from "../../stores/useWishlistStore";

export default function RaiseTicket() {
  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  const navigate = useNavigate();
  const { user } = useWishlistStore()
  console.log(user?.id)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:5000/api/user/support/tickets`,
        {
          subject: form.subject,
          description: form.message,
        },
        { withCredentials: true }
      );;
      alert(res.message || "Ticket submitted successfully!");

      const { success, data } = res.data;
      console.log(res.data)
      if (success) {
        setForm({ subject: "", message: "" });
        alert("Ticket rased Successful ✅");
        navigate("/user/support"); // redirect after success
      } else {
        alert("Ticket rased Failed ❌");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Invalid Credentials ❌");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-6">Raise a Support Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

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

