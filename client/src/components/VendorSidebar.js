import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaSignOutAlt } from 'react-icons/fa';
import '../../App.css'; // src ke bahar se import (client/App.css)

const VendorSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/vendor/dashboard', icon: <FaTachometerAlt /> },
        { name: 'Products', path: '/vendor/my-products', icon: <FaBoxOpen /> },
        { name: 'Logout', path: '/', icon: <FaSignOutAlt /> },
    ];

    const isActive = (path) =>
        location.pathname === path ? 'sidebar-link active' : 'sidebar-link';

    return (
        <div className="vendor-sidebar">
            {/* Logo */}
            <div className="vendor-logo">
                Sell<span className="logo-highlight">Aids</span>
            </div>

            {/* Menu */}
            <nav className="vendor-menu">
                {menuItems.map((item, idx) => (
                    <Link key={idx} to={item.path} className={isActive(item.path)}>
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-text">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="vendor-footer">&copy; 2025 SellAids</div>
        </div>
    );
};

export default VendorSidebar;
