import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Clock, CheckCircle, Users, Settings, LogOut } from "lucide-react";

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/admindashboard/", icon: <Home size={18} /> },
        { name: "Pending Products", path: "/admindashboard/pending", icon: <Clock size={18} /> },
        { name: "Approved Products", path: "/admindashboard/approved", icon: <CheckCircle size={18} /> },
        { name: "Vendors", path: "/admindashboard/vendors", icon: <Users size={18} /> },
    ];

    const bottomItems = [
        { name: "Settings", path: "/admindashboard/settings", icon: <Settings size={18} /> },
        { name: "Logout", path: "/logout", icon: <LogOut size={18} /> },
    ];

    return (
        <div className="w-60 bg-gray-900 text-white h-auto p-3 rounded-md shadow-md">
            {/* Top Menu */}
            <ul className="space-y-2">
                {menuItems.map((item, idx) => (
                    <li key={idx}>
                        <Link
                            to={item.path}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${location.pathname === item.path
                                    ? "bg-gray-700 text-orange-500"
                                    : "hover:bg-gray-800"
                                }`}
                        >
                            {item.icon}
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Bottom Menu */}
            <ul className="space-y-2 mt-4 border-t border-gray-700 pt-3">
                {bottomItems.map((item, idx) => (
                    <li key={idx}>
                        <Link
                            to={item.path}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${location.pathname === item.path
                                    ? "bg-gray-700 text-orange-500"
                                    : "hover:bg-gray-800"
                                }`}
                        >
                            {item.icon}
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
