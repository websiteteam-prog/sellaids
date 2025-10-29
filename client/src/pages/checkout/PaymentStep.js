// src/pages/checkout/PaymentStep.jsx
import React, { useEffect } from "react";
import Payments from "../../pages/dashboard/Payments";

export default function PaymentStep({ orderData, onPrev }) {
  // inject orderData into location.state so Payments component works unchanged
  useEffect(() => {
    if (!window.location.state?.orderData) {
      window.history.replaceState(
        { ...window.history.state, orderData },
        ""
      );
    }
  }, [orderData]);

  return (
    <div className="space-y-4">
      <Payments />
      <div className="flex justify-start">
        <button
          onClick={onPrev}
          className="px-5 py-2 border rounded hover:bg-gray-100"
        >
          Back to Review
        </button>
      </div>
    </div>
  );
}