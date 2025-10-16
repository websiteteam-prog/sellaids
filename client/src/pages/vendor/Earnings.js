import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Earnings = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
  });
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = transactions.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const statsRes = await axios.get("http://localhost:5000/api/vendor/earnings");
        // const txnRes = await axios.get("http://localhost:5000/api/vendor/transactions");

        setStats(statsRes.data);
        setMonthlyEarnings(statsRes.data.monthlyData || []);
        // setTransactions(txnRes.data || []);
      } catch (err) {
        console.error("Error fetching earnings data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Earnings</h1>

      {/* Top Earnings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Earnings</h3>
          <p className="text-2xl font-bold">₹{stats.totalEarnings}</p>
         
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">This Month</h3>
          <p className="text-2xl font-bold">₹{stats.thisMonth}</p>
          
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Pending Payouts</h3>
          <p className="text-2xl font-bold">₹{stats.pendingPayouts}</p>
        
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Completed Payouts</h3>
          <p className="text-2xl font-bold">₹{stats.completedPayouts}</p>
         
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Earnings</h2>
        {monthlyEarnings.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <Tooltip />
              <Bar dataKey="earnings" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">No earnings data yet.</p>
        )}
      </div>

      {/* Recent Transactions Table - Hidden for now */}
      {/*
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No transactions yet.</p>
        ) : (
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
        )}

        {transactions.length > 0 && (
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
        )}
      </div>
      */}
    </div>
  );
};

export default Earnings;
