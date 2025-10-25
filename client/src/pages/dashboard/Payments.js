import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import useCartStore from "../../stores/useCartStore";
import axios from "axios";

export default function Payments() {
  const { user, isAuthenticated, fetchUser } = useUserStore();
  const { clearCart } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  const savedOrder = sessionStorage.getItem("orderData");
  const [orderData, setOrderData] = useState(
    location.state?.orderData || (savedOrder ? JSON.parse(savedOrder) : null)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderData) {
      sessionStorage.setItem("orderData", JSON.stringify(orderData));
    }
  }, [orderData]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/${user.id}/latest-order`,
          { withCredentials: true }
        );
        setOrderData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch order data:", err);
        navigate("/user");
      }
    };

    const validateUser = async () => {
      if (!isAuthenticated || !user?.id) {
        try {
          // Attempt to fetch user profile to restore session
          await fetchUser();
          if (!user?.id) {
            console.warn("User still not authenticated after fetch");
            navigate("/UserAuth/UserLogin", { state: { from: "/user/user-payments" } });
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
          navigate("/UserAuth/UserLogin", { state: { from: "/user/user-payments" } });
        }
      }
    };

    console.log("orderData:", orderData);
    console.log("user:", user);
    validateUser().then(() => {
      if (!orderData) {
        console.warn("No order data found, attempting to fetch...");
        fetchOrderData();
      } else if (
        !orderData.key ||
        !orderData.razorpayOrderId ||
        !orderData.amount ||
        !orderData.currency ||
        !orderData.orderIds
      ) {
        console.warn("Invalid orderData:", orderData);
        navigate("/user");
      } else {
        loadRazorpay();
      }
    });
  }, [user, isAuthenticated, fetchUser, orderData, navigate]);

  const loadRazorpay = async () => {
    if (window.Razorpay) {
      setLoading(false);
      openPayment();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      setLoading(false);
      openPayment();
    };

    script.onerror = () => {
      setLoading(false);
      alert("Failed to load Razorpay. Please try again.");
      navigate("/user");
    };
  };

  const openPayment = async () => {
    if (!window.Razorpay) {
      alert("Razorpay not loaded yet. Please try again.");
      navigate("/user");
      return;
    }

    const options = {
      key: orderData.key,
      order_id: orderData.razorpayOrderId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Sellaids",
      description: "Payment for your order",
      handler: async function (response) {
        try {
          const verifyRes = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderIds: orderData.orderIds,
            },
            { withCredentials: true }
          );
          if (verifyRes.data.success) {
            alert("Payment Successful!");
            await clearCart();
            sessionStorage.removeItem("orderData");
            setOrderData(null);
            navigate("/user");
          } else {
            alert("Payment verification failed!");
            navigate("/user");
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("Payment verification failed!");
          navigate("/user");
        }
      },
      modal: {
        ondismiss: () => {
          console.warn("Payment modal closed by user");
          alert("Payment was cancelled. Please try again.");
          navigate("/user");
        },
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.mobile || "",
      },
      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading payment gateway...</p>
      </div>
    );
  }

  if (!orderData || !orderData.key || !orderData.razorpayOrderId || !orderData.amount || !orderData.currency || !orderData.orderIds) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">Invalid order data. Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Redirecting to Razorpay...
        </h1>
        <p className="text-gray-600 mb-4">
          Please wait while we open the secure payment window.
        </p>
        <div className="animate-pulse text-blue-600 font-medium">
          Initializing Payment...
        </div>
      </div>
    </div>
  );
}