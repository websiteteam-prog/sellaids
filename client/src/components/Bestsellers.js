import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigate hook

import bestseller1 from '../assets/images/bestseller1.webp';
import bestseller2 from '../assets/images/bestseller2.webp';
import bestseller3 from '../assets/images/bestseller3.webp';
import bestseller4 from '../assets/images/bestseller4.webp';

const products = [
    {
        id: 1,
        title: 'Dark Green Gown With Front And Back Feather And Sequin Work',
        price: '₹8,999.00',
        img: bestseller1,
    },
    {
        id: 2,
        title: 'Golden Sequin Gown With Royal Blue Handwork',
        price: '₹9,999.00',
        img: bestseller2,
    },
    {
        id: 3,
        title: 'Pink And Magenta Georgette Floor Length Suit With Gotta Patti Handwork',
        price: '₹5,999.00',
        img: bestseller3,
    },
    {
        id: 4,
        title: 'Royal Blue Velvet Short Kurta With Handwork And Hot Pink Dhoti Salwar',
        price: '₹5,999.00',
        img: bestseller4,
    },
];

function Bestsellers() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const navigate = useNavigate(); // ✅ navigation hook

    return (
        <div className="bg-white py-6 px-4 sm:px-8 lg:px-16">
            <h2 className="text-5xl font-heading text-black leading-tight text-center mt-0 mb-6 md:mb-12">
                Bestseller
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="relative bg-white border border-gray-200 shadow-sm rounded overflow-hidden cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="relative">
                            <img
                                src={product.img}
                                alt={product.title}
                                className="w-full h-[400px] object-cover"
                            />

                            {/* Icon panel */}
                            <div
                                className={`absolute top-1/2 right-0 py-5 transform -translate-y-1/2 bg-white border-l border-gray-300 px-2 flex flex-col space-y-4 shadow-md transition-transform duration-300 ${hoveredIndex === index ? 'translate-x-0' : 'translate-x-full'
                                    }`}
                                style={{ borderRadius: 0, width: '44px', zIndex: 10 }}
                            >
                                {[
                                    {
                                        label: 'Add to Wishlist',
                                        Icon: Heart,
                                        onClick: () =>
                                            alert(`Added "${product.title}" to wishlist!`),
                                    },
                                    {
                                        label: 'Add to Cart',
                                        Icon: ShoppingCart,
                                        onClick: () => navigate('/AddToCart'), // ✅ redirect
                                    },
                                    {
                                        label: 'View Details',
                                        Icon: Eye,
                                        onClick: () =>
                                            navigate(`/product/${product.id}`),
                                    },
                                ].map(({ label, Icon, onClick }) => (
                                    <button
                                        key={label}
                                        aria-label={label}
                                        onClick={onClick}
                                        className="text-black hover:text-orange-600 transition-colors"
                                        style={{ padding: 0 }}
                                    >
                                        <Icon size={24} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-800">
                                <a
                                    href={`/product/${product.id}`}
                                    className="hover:text-orange-600 transition-colors"
                                >
                                    {product.title}
                                </a>
                            </h3>
                            <p className="text-base font-semibold text-black mt-2">
                                {product.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Bestsellers;
