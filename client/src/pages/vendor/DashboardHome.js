import React from 'react';
import { FaCheckCircle, FaBoxOpen, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import "../../App.css";

const DashboardHome = () => {
    return (
        <div className="page-container">
            <h2 className="page-title">
                <img src="/vite.svg" alt="icon" style={{ width: "30px", marginRight: "10px" }} />
                Vendor Dashboard
            </h2>

            <p style={{ marginBottom: "20px", color: "#555" }}>
                Welcome to your dashboard. Use the sidebar to manage your products, orders, and profile.
            </p>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <FaBoxOpen style={{ fontSize: "24px", color: "#2563eb" }} />
                    <p className="dashboard-card-title">Total Products</p>
                    <h3 className="dashboard-card-value">12</h3>
                </div>

                <div className="dashboard-card">
                    <FaClipboardList style={{ fontSize: "24px", color: "#f59e0b" }} />
                    <p className="dashboard-card-title">Pending Orders</p>
                    <h3 className="dashboard-card-value">5</h3>
                </div>

                <div className="dashboard-card">
                    <FaMoneyBillWave style={{ fontSize: "24px", color: "#16a34a" }} />
                    <p className="dashboard-card-title">Earnings</p>
                    <h3 className="dashboard-card-value">₹12,500</h3>
                </div>

                <div className="dashboard-card">
                    <FaCheckCircle style={{ fontSize: "24px", color: "#16a34a" }} />
                    <p className="dashboard-card-title">Account Status</p>
                    <h3 className="dashboard-card-value">✅ Active</h3>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
