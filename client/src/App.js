// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// ✅ Layouts
import Layout from "./Layout";
import VendorDashboardLayout from "./Layout/VendorDashboardLayout";
import DashboardLayout from "./components/DashboardLayout";

// ✅ Public Pages
import About from "./pages/About";
import LandingPage from "./pages/LandingPage";
import SellWithUs from "./pages/SellWithUs";
import Contact from "./pages/Contact";
import TrustedPlatformPage from "./pages/TrustedPlatform";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsConditions from "./pages/TermsConditions";
import RefundReturnPolicy from "./pages/RefundReturnPolicy";
import WeDontSell from "./pages/WeDontSell";
import WhoCanSell from "./pages/WhoCanSell";
import AdviceSellers from "./pages/AdviceSellers";
import Blogs from "./pages/Blogs";
import Luxury from "./pages/Luxury";

// User Aids
import Kidsaids from "./components/aids/Kidsaids";

// ✅ Vendor Auth Pages
import Login from "./pages/vendor/Login";
import Register from "./pages/vendor/MultiStepRegister";

// ✅ User Auth Pages
import UserLogin from "./pages/Userlogin";
import UserRegister from "./pages/UserRegister";

// ✅ Vendor Dashboard Pages
import DashboardHomeVendor from "./pages/vendor/DashboardHome";
import AddProduct from "./pages/vendor/AddProduct";
import AllProducts from "./pages/vendor/AllProducts";
import EditProduct from "./pages/vendor/EditProduct";
import OrdersVendor from "./pages/vendor/Orders";
import Earnings from "./pages/vendor/Earnings";
import ProfileVendor from "./pages/vendor/Profile";

// ✅ User Dashboard Pages
import Orders from "./pages/dashboard/Orders";
import Profile from "./pages/dashboard/Profile";
import Addresses from "./pages/dashboard/Addresses";
import Payments from "./pages/dashboard/Payments";
import Wishlist from "./pages/dashboard/Wishlist";
import Support from "./pages/dashboard/Support";
import DashboardHome from "./pages/dashboard/DashboardHome";
import RaiseTicket from "./pages/dashboard/RaiseTicket";

// ✅ Admin Layout and Pages
import AdminLayout from "./components/admindashboard/Layout"; 
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminVendors from "./pages/Admin/Vendors";
import AdminProducts from "./pages/Admin/Products";
import AdminOrders from "./pages/Admin/Orders";
import AdminPayments from "./pages/Admin/Payments";
import AdminReports from "./pages/Admin/Reports";
import AdminNotifications from "./pages/Admin/Notifications";
import AdminSettings from "./pages/Admin/Settings";
import AdminSecurity from "./pages/Admin/Security";

const App = () => {
  return (
    <Routes>

      {/* ✅ Public Routes */}
      <Route path="/" element={<Layout><LandingPage /></Layout>} />
      <Route path="/landingpage" element={<Layout><LandingPage /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/sellwithus" element={<Layout><SellWithUs /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/trusted-platform" element={<Layout><TrustedPlatformPage /></Layout>} />
      <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path="/shipping-policy" element={<Layout><ShippingPolicy /></Layout>} />
      <Route path="/terms-conditions" element={<Layout><TermsConditions /></Layout>} />
      <Route path="/refund-return-policy" element={<Layout><RefundReturnPolicy /></Layout>} />
      <Route path="/we-dont-sell" element={<Layout><WeDontSell /></Layout>} />
      <Route path="/who-can-sell" element={<Layout><WhoCanSell /></Layout>} />
      <Route path="/advice-sellers" element={<Layout><AdviceSellers /></Layout>} />
      <Route path="/blogs" element={<Layout><Blogs /></Layout>} />
      <Route path="/Fashionaids" element={<Layout><Luxury /></Layout>} />
      <Route path="/Designeraids" element={<Layout><Luxury /></Layout>} />
      <Route path="/kidsaids" element={<Layout><Kidsaids /></Layout>} />

      {/* ✅ User Auth Routes */}
      <Route path="/UserLogin" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />

      {/* ✅ User Dashboard Routes */}
      <Route path="/user" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="orders" element={<Orders />} />
        <Route path="profile" element={<Profile />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="payments" element={<Payments />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="support" element={<Support />} />
        <Route path="raise-ticket" element={<RaiseTicket />} />
      </Route>

      {/* ✅ Vendor Auth Routes */}
      <Route path="/vendor/login" element={<Login />} />
      <Route path="/vendor/register" element={<Register />} />

      {/* ✅ Vendor Dashboard Routes */}
      <Route path="/vendor" element={<VendorDashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHomeVendor />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="all-products" element={<AllProducts />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="orders" element={<OrdersVendor />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="profile" element={<ProfileVendor />} />
      </Route>

      {/* ✅ Admin Dashboard Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="security" element={<AdminSecurity />} />
      </Route>
 
    </Routes>
  );
};

export default App;
