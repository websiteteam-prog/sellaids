import React, { useEffect, useState } from "react";
import { FaSearch, FaFileExcel } from "react-icons/fa";
import axios from "axios";

const UsersManagement = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (search = '') => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}/admin/users${search ? `?search=${search}` : ''}`;
      const res = await axios.get(url, { withCredentials: true });
      setUsersData(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      setUsersData([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Search handler
  const handleSearch = () => {
    fetchUsers(searchTerm);
    setCurrentPage(1);
  };

  // Export Excel
  const exportExcel = () => {
    const rows = filteredUsers.map((user) => ({
      ID: user.id,
      Username: user.name,
      Email: user.email,
      Phone: user.contact,
    }));
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [Object.keys(rows[0] || {}).join(","), ...rows.map((r) => Object.values(r).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination calculations
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800 text-sm relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Users Management</h2>
      </div>

      {/* Search + Export */}
      <div className="flex flex-col md:flex-row gap-3 mb-4 items-center">
        <div className="flex w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 bg-white text-gray-700 rounded-l-lg px-3 py-2 w-full text-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-[#FF6A00] text-white px-3 py-2 rounded-r-lg hover:bg-orange-500"
          >
            <FaSearch />
          </button>
        </div>

        <button
          onClick={exportExcel}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-green-600 rounded-lg hover:bg-green-100 text-sm ml-auto"
        >
          <FaFileExcel /> Export Excel
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {loading || currentUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No Users Found
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.contact}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-600 text-xs">
            Total Users: <span className="text-gray-900 font-medium">{filteredUsers.length}</span>
          </p>
          <nav className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 rounded-lg text-sm border border-gray-300 hover:bg-gray-100"
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === index + 1
                    ? "bg-[#FF6A00] text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 rounded-lg text-sm border border-gray-300 hover:bg-gray-100"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;