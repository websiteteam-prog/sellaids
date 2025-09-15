import React from 'react';

const VendorTopbar = () => {
    return (
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b">
            <h1 className="text-xl font-bold text-gray-800">Vendor Dashboard</h1>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">👤 Hello, Vendor</span>
                {/* Profile or logout buttons later */}
            </div>
        </header>
    );
};

export default VendorTopbar;
