// src/pages/UsersManagement.jsx
import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaSearch, FaFileExcel } from "react-icons/fa";
import axios from "axios";

const UsersManagement = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Selection states
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/users"); // replace with your API
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
    const filtered = usersData.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // Export Excel
  const exportExcel = () => {
    const rows = filteredUsers.map((user) => ({
      Name: user.name,
      Email: user.email,
      Contact: user.contact,
      Orders: user.orders,
      "Total Spent": user.spent,
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

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(currentUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const allSelected =
    currentUsers.length > 0 &&
    selectedUsers.length === currentUsers.length;

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
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-3">User</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No Users
                </td>
              </tr>
            ) : currentUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No Users Found
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-3">{user.contact}</td>
                  <td className="p-3">{user.orders}</td>
                  <td className="p-3">Rs. {user.spent}</td>
                  <td className="p-3 flex gap-3">
                    <button className="text-blue-500 hover:text-blue-700">
                      <FaEye size={14} />
                    </button>
                    <button className="text-[#FF6A00] hover:text-orange-500">
                      <FaEdit size={14} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Total Users + Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600 text-xs">
          Total Users:{" "}
          <span className="text-gray-900 font-medium">{filteredUsers.length}</span>
        </p>
        <nav className="flex gap-2">
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
        </nav>
      </div>

      {/* Bottom Action Bar */}
      {selectedUsers.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-3 flex justify-between items-center">
          <p className="text-gray-700 text-sm">{selectedUsers.length} user(s) selected</p>
          <div className="flex gap-3">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">
              Send Mail
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm">
              Deactivate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
