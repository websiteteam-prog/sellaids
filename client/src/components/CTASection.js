import React from 'react';
import { Link } from 'react-router-dom';  // 🔑 Link import
import ctaImage from '../assets/images/cta-image.webp';

function CTASection() {
    return (
        <section
            className="relative h-[500px] md:h-[550px] w-full overflow-hidden bg-fixed bg-center bg-cover mt-6"
            style={{ backgroundImage: `url(${ctaImage})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-20 text-white">
                <p className="uppercase text-sm tracking-widest font-medium mb-4">
                    declutter, cash in and stay ahead !!!
                </p>
                <h2 className="text-3xl md:text-5xl font-heading max-w-xl leading-snug mb-6">
                    Sell Your Preowned Collection With Us Today - Simple, Secure And Rewarding.
                </h2>
                <Link
                    to="/sellwithus" 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-all"
                >
                    Sell Now
                </Link>
            </div>
        </section>
    );
}

export default CTASection;