// src/pages/UsersManagement.jsx
import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const UsersManagement = () => {
  const usersData = [
    { id: 1, name: "Ahmad Ali", email: "ahmad.ali@email.com", contact: "+92 300 1234567", status: "Active", joinDate: "2024-01-15", orders: 12, spent: "45,000" },
    { id: 2, name: "Fatima Khan", email: "fatima.khan@email.com", contact: "+92 301 2345678", status: "Active", joinDate: "2024-02-20", orders: 8, spent: "32,500" },
    { id: 3, name: "Hassan Ahmed", email: "hassan.ahmed@email.com", contact: "+92 302 3456789", status: "Inactive", joinDate: "2024-01-10", orders: 5, spent: "18,750" },
    { id: 4, name: "Ayesha Malik", email: "ayesha.malik@email.com", contact: "+92 303 4567890", status: "Active", joinDate: "2024-03-05", orders: 15, spent: "67,200" },
    { id: 5, name: "Usman Shah", email: "usman.shah@email.com", contact: "+92 304 5678901", status: "Active", joinDate: "2024-02-28", orders: 3, spent: "12,300" },
    { id: 6, name: "Zara Hussain", email: "zara.hussain@email.com", contact: "+92 305 6789012", status: "Active", joinDate: "2024-03-12", orders: 7, spent: "28,900" },
    { id: 7, name: "Ali Raza", email: "ali.raza@email.com", contact: "+92 306 7890123", status: "Inactive", joinDate: "2024-01-25", orders: 2, spent: "8,500" },
  ];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = usersData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(usersData.length / usersPerPage);

  // ✅ Selection states
  const [selectedUsers, setSelectedUsers] = useState([]);

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
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800 text-sm relative">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Users Management</h2>
        <button className="bg-[#FF6A00] text-white px-4 py-2 rounded-lg shadow hover:bg-orange-500 transition">
          + Add New User
        </button>
      </div>

      {/* 🔹 Search + Filter + Export */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 w-full md:w-1/3 text-sm"
        />
        <select className="border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 w-full md:w-1/6 text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <div className="flex gap-2 ml-auto">
          <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 text-sm">
            Export CSV
          </button>
          <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 text-sm">
            Export Excel
          </button>
        </div>
      </div>

      {/* 🔹 Users Table */}
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
              <th className="p-3">Status</th>
              <th className="p-3">Join Date</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
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
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">{user.joinDate}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Total Users + Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600 text-xs">
          Total Users:{" "}
          <span className="text-gray-900 font-medium">{usersData.length}</span>
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

      {/* 🔹 Bottom Action Bar (Show only if any selected) */}
      {selectedUsers.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-3 flex justify-between items-center">
          <p className="text-gray-700 text-sm">
            {selectedUsers.length} user(s) selected
          </p>
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
