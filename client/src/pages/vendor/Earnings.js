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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}api/product/earnings`, {
          withCredentials: true, // send session/cookie
        });

        if (res.data.success) {
          const data = res.data.data;
          setStats({
            totalEarnings: data.total_earning,
            thisMonth: data.this_month_earning,
            pendingPayouts: data.pending_earning,
            completedPayouts: data.total_earning - data.pending_earning - data.failed_earning,
          });

          const graphData = data.monthly_earning_graph.map((item) => ({
            month: item.month,
            earnings: parseFloat(item.total),
          }));
          setMonthlyEarnings(graphData);
        }
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
              <Bar dataKey="earnings" fill="#f97316" radius={[6, 6, 0, 0]} /> {/* Orange color */}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">No earnings data yet.</p>
        )}
      </div>
    </div>
  );
};

export default Earnings;
