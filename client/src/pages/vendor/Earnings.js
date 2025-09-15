import React from 'react';

const Earnings = () => {
    return (
        <div className="page-container">
            <h1 className="page-title">My Earnings</h1>

            <div className="card">
                <p><strong>Total Earnings:</strong> ₹25,000</p>
                <p><strong>Pending:</strong> ₹5,000</p>
                <p><strong>Last Payout:</strong> ₹10,000 (12 Aug 2025)</p>
            </div>
        </div>
    );
};

export default Earnings;
