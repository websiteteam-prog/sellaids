import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
          withCredentials: true,
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

  if (loading) return <p className="p-6 text-gray-500 text-center">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Earnings Overview</h1>

      {/* Top Earnings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Earnings", value: stats.totalEarnings },
          { title: "This Month", value: stats.thisMonth },
          { title: "Pending Payouts", value: stats.pendingPayouts },
          { title: "Completed Payouts", value: stats.completedPayouts },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-sm font-medium text-gray-500 uppercase">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">₹{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Earnings Trend</h2>
        {monthlyEarnings.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyEarnings} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#4b5563", fontSize: 12 }}
                tickMargin={10}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                tick={{ fill: "#4b5563", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="earnings"
                fill="#f97316"
                radius={[8, 8, 0, 0]}
                barSize={40}
                background={{ fill: "#f3f4f6", radius: 8 }}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">No earnings data available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Earnings;