import React from 'react';
import { Outlet, Link } from 'react-router-dom';
// import '../../App.css';  // ✅ Correct path

const VendorDashboardLayout = () => {
    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2>SellAids Vendor</h2>
                <nav>
                    <Link to="/vendor/dashboard">Dashboard</Link>
                    <Link to="/vendor/add-product">Add Product</Link>
                    <Link to="/vendor/my-products">My Products</Link>
                    <Link to="/vendor/orders">Orders</Link>
                    <Link to="/vendor/earnings">Earnings</Link>
                    <Link to="/vendor/profile">Profile</Link>
                    <Link to="/vendor/logout" className="logout">Logout</Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default VendorDashboardLayout;
