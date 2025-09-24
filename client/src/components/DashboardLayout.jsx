import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  // For demo, let's say user info is stored here
  const [user, setUser] = useState({ name: "User" });

  useEffect(() => {
    // In real case, fetch user info from API or get from localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.name) {
      setUser(savedUser);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar username={user.name} />
        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
