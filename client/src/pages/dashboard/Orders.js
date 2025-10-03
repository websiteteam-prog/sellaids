import React from "react";
import OrderTable from "../../components/OrderTable";

const Orders = () => {
  return (
    <div className="p-4 sm:p-6">
      {/* Page Heading */}
      <h1 className="text-2xl font-bold mb-2 sm:mb-4">My Orders</h1>
      <p className="text-gray-600 mb-4 sm:mb-6">Here are your recent orders.</p>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto bg-white shadow rounded scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <OrderTable />
      </div>
    </div>
  );
};

export default Orders;
