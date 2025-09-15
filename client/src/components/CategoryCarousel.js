import React, { useRef, useState } from 'react';

import cat1 from '../assets/images/cat1.webp';
import cat2 from '../assets/images/cat2.webp';
import cat3 from '../assets/images/cat3.webp';
import cat4 from '../assets/images/cat4.webp';
import cat5 from '../assets/images/cat5.webp';
import cat6 from '../assets/images/cat6.webp';
import cat7 from '../assets/images/cat7.webp';
import cat8 from '../assets/images/cat8.webp';
import cat9 from '../assets/images/cat9.webp';
import cat10 from '../assets/images/cat10.webp';
import cat11 from '../assets/images/cat11.webp';
import cat12 from '../assets/images/cat12.webp';
import cat13 from '../assets/images/cat13.webp';

const categories = [
    { name: 'Indian Edit', img: cat1 },
    { name: 'Men Apparel', img: cat2 },
    { name: 'Shoes', img: cat3 },
    { name: 'Bespoke Studio', img: cat4 },
    { name: 'Accessories', img: cat5 },
    { name: 'Baby Gear', img: cat6 },
    { name: 'Kidswear', img: cat7 },
    { name: 'Home Decor', img: cat8 },
    { name: 'Grooming', img: cat9 },
    { name: 'Watches', img: cat10 },
    { name: 'Women Apparel', img: cat11 },
    { name: 'Boutique Fit', img: cat12 },
    { name: 'Saree', img: cat13 },
];

function CategoryCarousel() {
    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;
        const itemWidth = container.offsetWidth / 6;
        const scrollAmount = itemWidth * 6;

        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? categories.length - 1 : prev - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev === categories.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="relative w-full bg-white py-6 mt-10">
            {/* 🔹 Desktop / Tablet View (6 items scrollable) */}
            <div className="hidden md:block relative">
                {/* Left Arrow */}
                <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                    onClick={() => scroll('left')}
                >
                    &#8592;
                </button>

                {/* Scrollable Container */}
                <div className="overflow-hidden px-16">
                    <div
                        ref={scrollRef}
                        className="flex gap-6 scroll-smooth no-scrollbar"
                        style={{
                            overflowX: 'auto',
                            scrollBehavior: 'smooth',
                        }}
                    >
                        {categories.map((cat, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center flex-shrink-0 
                  w-1/6 max-w-[240px]"
                            >
                                <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg">
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                                <p className="mt-2 text-sm font-semibold text-center text-black">
                                    {cat.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                    onClick={() => scroll('right')}
                >
                    &#8594;
                </button>
            </div>

            {/* 🔹 Mobile View (1 item at a time) */}
            <div className="md:hidden relative w-full flex flex-col items-center">
                <div className="w-60 h-60 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg">
                    <img
                        src={categories[currentIndex].img}
                        alt={categories[currentIndex].name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="mt-2 text-base font-semibold text-center text-black">
                    {categories[currentIndex].name}
                </p>

                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                    ❮
                </button>

                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                    ❯
                </button>
            </div>
        </div>
    );
}

export default CategoryCarousel;
