// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Layout from "./Layout";

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

// ✅ Vendor Auth Pages
import Login from "./pages/vendor/Login";
import Register from "./pages/vendor/MultiStepRegister";

// ✅ User Auth Pages (case-sensitive)
import UserLogin from "./pages/Userlogin";
import UserRegister from "./pages/UserRegister";

// ✅ Vendor Layout + Pages
import VendorDashboardLayout from "./Layout/VendorDashboardLayout";
import DashboardHome from "./pages/vendor/DashboardHome";
import AddProduct from "./pages/vendor/AddProduct";
import MyProducts from "./pages/vendor/MyProducts";
import EditProduct from "./pages/vendor/EditProduct";
import Orders from "./pages/vendor/Orders";
import Earnings from "./pages/vendor/Earnings";
import Profile from "./pages/vendor/Profile";

// ✅ Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardHome from "./pages/vendor/DashboardHome";

const App = () => {
  return (
    <Routes>
      {/* 🔓 Public Routes with Layout */}
      <Route path="/" element={<Layout><LandingPage /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/landingpage" element={<Layout><LandingPage /></Layout>} />
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
      <Route path="/Userlogin" element={<UserLogin />} />
      <Route path="/UserLogin" element={<UserLogin />} />
      <Route path="/UserRegister" element={<UserRegister />} />
      <Route path="/userragister" element={<UserRegister />} />

      {/* 🔓 Vendor Auth Routes */}
      <Route path="/vendor/login" element={<Login />} />
      <Route path="/vendor/register" element={<Register />} />

      {/* 🔓 User Auth Routes */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />

      {/* 🔐 Vendor Dashboard Layout with nested routes */}
      <Route path="/vendor" element={<VendorDashboardLayout />}>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="my-products" element={<MyProducts />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 🔐 Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
      <Route path="/admindashboard/*" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
