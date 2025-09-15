import React, { useState } from 'react';
import '../App.css';
import popupImage from '../assets/images/popup-banner.webp'; // ✅ Import your image

const Popup = ({ onClose }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Match zoom-out animation
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div
                className={`relative bg-white w-full max-w-4xl flex transition-all duration-300 ${isClosing ? 'animate-zoom-out' : 'animate-zoom-in'
                    }`}
            >
                {/* ✅ Left Side Image */}
                <div className="w-1/2">
                    <img
                        src={popupImage} // ✅ Correct usage of imported image
                        alt="Popup"
                        className="h-[420px] w-full object-cover"
                    />
                </div>

                {/* Right Side Form */}
                <div className="relative w-1/2 p-8">
                    <button
                        onClick={handleClose}
                        aria-label="Close popup"
                        className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
                    >
                        &times;
                    </button>

                    <h1 className="text-3xl font-bold mb-2">JOIN US!</h1>
                    <p className="text-gray-600 mb-6 text-sm">
                        Sign up now to get the latest updates, offers, and exciting news from Sellaids.
                    </p>

                    <form>
                        <label className="block mb-4 font-semibold">
                            Name <span className="text-red-600">*</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Enter your name"
                            />
                        </label>

                        <label className="block mb-6 font-semibold">
                            Phone <span className="text-red-600">*</span>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                maxLength={10}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Enter your phone number"
                            />
                            <div className="text-right text-xs text-gray-400">{phone.length} / 10</div>
                        </label>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
                        >
                            SUBMIT
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Popup;
