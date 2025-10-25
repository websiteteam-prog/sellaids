import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import useCartStore from "../../stores/useCartStore";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast"; // Import toast and Toaster

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
        setTimeout(() => {
          navigate("/user");
        }, 1500); // Delay navigation
      }
    };

    const validateUser = async () => {
      if (!isAuthenticated || !user?.id) {
        try {
          // Attempt to fetch user profile to restore session
          await fetchUser();
          if (!user?.id) {
            console.warn("User still not authenticated after fetch");
            toast.error("Please log in to continue ❌");
            setTimeout(() => {
              navigate("/UserAuth/UserLogin", { state: { from: "/user/user-payments" } });
            }, 1500); // Delay navigation
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
          toast.error("Authentication failed. Please log in ❌");
          setTimeout(() => {
            navigate("/UserAuth/UserLogin", { state: { from: "/user/user-payments" } });
          }, 1500); // Delay navigation
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
        toast.error("Invalid order data. Redirecting to dashboard... ❌");
        setTimeout(() => {
          navigate("/user");
        }, 1500); // Delay navigation
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
      toast.error("Failed to load Razorpay. Please try again ❌");
      setTimeout(() => {
        navigate("/user");
      }, 1500); // Delay navigation
    };
  };

  const openPayment = async () => {
    if (!window.Razorpay) {
      toast.error("Razorpay not loaded yet. Please try again ❌");
      setTimeout(() => {
        navigate("/user");
      }, 1500); // Delay navigation
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
            toast.success("Payment Successful! ✅");
            await clearCart();
            sessionStorage.removeItem("orderData");
            setOrderData(null);
            setTimeout(() => {
              navigate("/user");
            }, 1500); // Delay navigation
          } else {
            toast.error("Payment verification failed! ❌");
            setTimeout(() => {
              navigate("/user");
            }, 1500); // Delay navigation
          }
        } catch (err) {
          console.error("Verification error:", err);
          toast.error("Payment verification failed! ❌");
          setTimeout(() => {
            navigate("/user");
          }, 1500); // Delay navigation
        }
      },
      modal: {
        ondismiss: () => {
          console.warn("Payment modal closed by user");
          toast.error("Payment was cancelled. Please try again ❌");
          setTimeout(() => {
            navigate("/user");
          }, 1500); // Delay navigation
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
        <Toaster /> {/* Add Toaster component */}
        <p className="text-gray-600 text-lg">Loading payment gateway...</p>
      </div>
    );
  }

  if (!orderData || !orderData.key || !orderData.razorpayOrderId || !orderData.amount || !orderData.currency || !orderData.orderIds) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Toaster /> {/* Add Toaster component */}
        <p className="text-red-600 text-lg">Invalid order data. Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Toaster /> {/* Add Toaster component */}
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