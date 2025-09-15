import React from "react";
import Sidebar from "./Sidebar";
import { Routes, Route } from "react-router-dom";
import PendingProducts from "./PendingProducts";
import { UserCircle, Package, Clock, CheckCircle, Users } from "lucide-react";

// Dummy Components
const ApprovedProducts = () => <h2 className="p-6">Approved Products</h2>;
const Vendors = () => <h2 className="p-6">Vendors List</h2>;

// 🔹 Dashboard Home Component (Overview)
const DashboardHome = () => {
    const stats = [
        { name: "Total Products", value: 150, icon: <Package size={24} />, color: "bg-blue-100 text-blue-700" },
        { name: "Pending Products", value: 12, icon: <Clock size={24} />, color: "bg-yellow-100 text-yellow-700" },
        { name: "Approved Products", value: 138, icon: <CheckCircle size={24} />, color: "bg-green-100 text-green-700" },
        { name: "Vendors", value: 25, icon: <Users size={24} />, color: "bg-purple-100 text-purple-700" },
    ];

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Dashboard Overview</h2>

            {/* Stats in single row (4 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="p-6 rounded-2xl shadow-md flex items-center gap-4 bg-white hover:shadow-lg transition"
                    >
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{stat.name}</p>
                            <h3 className="text-lg font-semibold">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminDashboardSection = () => {
    const user = { name: "Admin User" };

    return (
        <div className="flex min-h-screen">
            {/* 🔹 Sidebar (Always Visible) */}
            <Sidebar />

            {/* 🔹 Main Content */}
            <div className="flex-1 bg-gray-100 flex flex-col">
                {/* Top Navbar */}
                <div className="flex items-center justify-between bg-white shadow px-6 py-3">
                    <h1 className="text-3xl font-heading  text-orange-500">Welcome!</h1>
                    <div className="flex items-center gap-3">
                        <UserCircle size={28} className="text-gray-600" />
                        <span className="font-medium text-gray-700">{user.name}</span>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="pending" element={<PendingProducts />} />
                        <Route path="approved" element={<ApprovedProducts />} />
                        <Route path="vendors" element={<Vendors />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardSection;
