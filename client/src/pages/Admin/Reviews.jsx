import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const itemsPerPage = 10;

  // === Fetch Reviews from Backend ===
  const fetchReviews = async () => {
    try {
      setLoading(true);

      // 🔹 Uncomment this once your backend is live
      /*
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/management/review`,
        {
          params: {
            search,
            page: currentPage,
            limit: itemsPerPage,
          },
          withCredentials: true,
        }
      );

      const { success, data, message } = res.data;
      if (success) {
        setReviews(data.reviews || []);
        setTotalReviews(data.total || 0);
        toast.success(message);
      } else {
        setReviews([]);
        setTotalReviews(0);
        toast.error(message || "Failed to fetch reviews");
      }
      */

      // 🧩 Dummy data for testing (remove when backend ready)
      const dummy = {
        reviews: [
          {
            id: 1,
            userName: "Ajay Sharma",
            productName: "Wireless Headphones",
            rating: 4.5,
            comment: "Excellent sound quality!",
            date: "2025-10-30",
            status: "Approved",
          },
          {
            id: 2,
            userName: "Neha Singh",
            productName: "Smartwatch",
            rating: 3.8,
            comment: "Decent for the price.",
            date: "2025-10-29",
            status: "Pending",
          },
        ],
        total: 2,
      };
      setReviews(dummy.reviews);
      setTotalReviews(dummy.total);
    } catch (err) {
      console.error(err);
      setReviews([]);
      setTotalReviews(0);
      toast.error("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchReviews();
  };

  // === Export Excel ===
  const exportExcel = () => {
    if (!reviews.length) {
      toast.error("No reviews to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      reviews.map((r, index) => ({
        SR_No: (currentPage - 1) * itemsPerPage + index + 1,
        User: r.userName,
        Product: r.productName,
        Rating: r.rating,
        Comment: r.comment,
        Date: r.date,
        Status: r.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reviews");
    XLSX.writeFile(wb, "reviews.xlsx");
    toast.success("Excel exported successfully!");
  };

  const totalPages = Math.ceil(totalReviews / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reviews Management</h2>
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2 flex-wrap bg-white shadow-sm p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search by user, product, or status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg flex-1 focus:ring focus:ring-blue-200"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#FF6A00] text-white rounded-lg hover:bg-orange-500"
        >
          Search
        </button>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border">SR.</th>
              <th className="px-4 py-3 border">User</th>
              <th className="px-4 py-3 border">Product</th>
              <th className="px-4 py-3 border">Rating</th>
              <th className="px-4 py-3 border">Comment</th>
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Loading reviews...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((r, index) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 border font-medium">{r.userName}</td>
                  <td className="px-4 py-3 border">{r.productName}</td>
                  <td className="px-4 py-3 border">{r.rating} ⭐</td>
                  <td className="px-4 py-3 border">{r.comment}</td>
                  <td className="px-4 py-3 border">{r.date}</td>
                  <td
                    className={`px-4 py-3 border font-medium ${
                      r.status === "Approved"
                        ? "text-green-600"
                        : r.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {r.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;