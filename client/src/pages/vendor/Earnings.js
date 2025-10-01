import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Dummy Earnings Data
const monthlyEarnings = [
  { name: "Jan", earnings: 12000 },
  { name: "Feb", earnings: 15000 },
  { name: "Mar", earnings: 20000 },
  { name: "Apr", earnings: 18000 },
  { name: "May", earnings: 22000 },
  { name: "Jun", earnings: 24000 },
  { name: "Jul", earnings: 27000 },
  { name: "Aug", earnings: 25000 },
  { name: "Sep", earnings: 30000 },
  { name: "Oct", earnings: 32000 },
  { name: "Nov", earnings: 35000 },
  { name: "Dec", earnings: 20000 },
];

// Dummy Transactions Data
const transactions = [
  { id: "TXN001", type: "Sale", amount: "₹2,999", status: "Completed", reference: "#ORD001", customer: "Priya Sharma", date: "15/12/2024" },
  { id: "TXN002", type: "Sale", amount: "₹8,999", status: "Completed", reference: "#ORD002", customer: "Amit Singh", date: "14/12/2024" },
  { id: "TXN003", type: "Payout", amount: "₹25,000", status: "Processing", reference: "PAYOUT001", customer: "Bank Transfer", date: "13/12/2024" },
  { id: "TXN004", type: "Sale", amount: "₹1,599", status: "Pending", reference: "#ORD003", customer: "Neha Gupta", date: "12/12/2024" },
  { id: "TXN005", type: "Sale", amount: "₹599", status: "Completed", reference: "#ORD004", customer: "Rohit Kumar", date: "11/12/2024" },
  { id: "TXN006", type: "Sale", amount: "₹4,200", status: "Completed", reference: "#ORD005", customer: "Sneha Verma", date: "10/12/2024" },
  { id: "TXN007", type: "Sale", amount: "₹6,750", status: "Pending", reference: "#ORD006", customer: "Vikas Yadav", date: "09/12/2024" },
];

const Earnings = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = transactions.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Earnings</h1>

      {/* Top Earnings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Earnings</h3>
          <p className="text-2xl font-bold">₹1,24,580</p>
          <p className="text-green-600 text-sm">+18% from last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">This Month</h3>
          <p className="text-2xl font-bold">₹45,230</p>
          <p className="text-green-600 text-sm">+16% from last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Pending Payouts</h3>
          <p className="text-2xl font-bold">₹12,340</p>
          <p className="text-yellow-600 text-sm">Processing</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Completed Payouts</h3>
          <p className="text-2xl font-bold">₹1,12,240</p>
          <p className="text-green-600 text-sm">Completed</p>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Earnings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyEarnings}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="earnings" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Transaction ID</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Order/Reference</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginatedData.map((txn) => (
                <tr key={txn.id} className="border-t">
                  <td className="px-4 py-3">{txn.id}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        txn.type === "Sale"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{txn.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        txn.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : txn.status === "Processing"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer">
                    {txn.reference}
                  </td>
                  <td className="px-4 py-3">{txn.customer}</td>
                  <td className="px-4 py-3">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
