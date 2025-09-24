// src/App.jsx
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
import Luxury from "./pages/Luxury";
import Kidsaids from "./components/aids/Kidsaids";

// ✅ AddToCart section
import AddToCart from "./pages/AddToCart";
import CheckoutSection from "./components/CartSection/CheckoutSection";

// ✅ Vendor Auth Pages
import Login from "./pages/vendor/Login";
import Register from "./pages/vendor/MultiStepRegister";

// ✅ User Auth Pages
import UserLogin from "./pages/Userlogin";
import UserRegister from "./pages/UserRegister";

// ✅ User Dashboard Pages
import DashboardLayout from "./components/DashboardLayout";

import Orders from "./pages/dashboard/Orders";
import Profile from "./pages/dashboard/Profile";
import Addresses from "./pages/dashboard/Addresses";
import Payments from "./pages/dashboard/Payments";
import Wishlist from "./pages/dashboard/Wishlist";
import Support from "./pages/dashboard/Support";
import DashboardHome from "./pages/dashboard/DashboardHome";
import RaiseTicket from "./pages/dashboard/RaiseTicket";

// ✅ Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardHome from "./pages/vendor/DashboardHome";

// ✅ Vendor Dashboard Layout + Pages
import VendorDashboardLayout from "./Layout/VendorDashboardLayout";
import AddProduct from "./pages/vendor/AddProduct";
import MyProducts from "./pages/vendor/MyProducts";
import EditProduct from "./pages/vendor/EditProduct";
import VendorOrders from "./pages/vendor/Orders";
import Earnings from "./pages/vendor/Earnings";
import VendorProfile from "./pages/vendor/Profile";

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
      <Route path="/Fashionaids" element={<Layout><Luxury /></Layout>} />
      <Route path="/Designeraids" element={<Layout><Luxury /></Layout>} />
      <Route path="/kidsaids" element={<Layout><Luxury /></Layout>} />

{/* 🔓 AddToCart Section Routes */}
 
  <Route path="/addtocart" element={<Layout><AddToCart /></Layout>} />
  <Route path="/checkout" element={<Layout><CheckoutSection /></Layout>} />



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
        <Route path="orders" element={<VendorOrders />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="profile" element={<VendorProfile />} />
      </Route>

      {/* 🔐 Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
      <Route path="/admindashboard/*" element={<AdminDashboard />} />

      {/* 🔐 User Dashboard Layout with nested routes */}
      <Route path="/user" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />
  <Route path="orders" element={<Orders />} />
  <Route path="profile" element={<Profile />} />
  <Route path="addresses" element={<Addresses />} />
  <Route path="payments" element={<Payments />} />
  <Route path="wishlist" element={<Wishlist />} />
  <Route path="support" element={<Support />} />
  <Route path="/user/raise-ticket" element={<RaiseTicket />} />
</Route>

    </Routes>
  );
};

export default App;


