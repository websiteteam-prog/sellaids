import React, { useState } from "react";
import brandImage from "../../assets/images/brand-banner.webp";


const tabs = [
    { id: "value", label: "VALUE" },
    { id: "mission", label: "OUR MISSION" },
    { id: "vision", label: "VISION" },
];

const TabContent = {
    value: (
        <div className="mt-6 text-gray-800 text-[15px] space-y-4 leading-relaxed">
            <p>
                <strong>Sustainability:</strong> At Sellaids, we understand that every
                purchase has an impact. By choosing preloved items, you’re not just
                acquiring unique, high-quality products; you’re actively participating
                in a movement towards a more sustainable future. Our curated collection
                of designer bags, accessories, and fashion reflects our commitment to
                reducing waste, minimizing the carbon footprint and promoting
                eco-friendly practices.
            </p>
            <p>
                <strong>Fashion with a Purpose:</strong> We believe that luxury should
                not come at the expense of our planet. By shopping with us, you are
                contributing to a greener world. Each item sold on Sellaids helps extend
                the lifecycle of luxury goods, reducing the demand for new production
                and decreasing waste. Together, we can combat global warming and its
                effects on climate change, making a positive difference one purchase at
                a time.
            </p>
            <p>
                <strong>Community and Connection:</strong> Sellaids is more than just a
                marketplace; it’s a community of like-minded individuals who share a
                passion for fashion and sustainability. We provide a platform where
                sellers can connect with buyers who appreciate the value of quality over
                quantity. Our commitment to authenticity and transparency ensures that
                every product you purchase has a story and a purpose.
            </p>
        </div>
    ),
    mission: (
        <div className="mt-6 text-gray-800 text-[15px] leading-relaxed">
            <p>
                Our mission is to revolutionize the way luxury fashion is consumed by
                encouraging the resale and purchase of high-quality, preloved designer
                pieces. We aim to create a positive impact on the environment by
                promoting the circular economy and reducing textile waste.
            </p>
        </div>
    ),
    vision: (
        <div className="mt-6 text-gray-800 text-[15px] leading-relaxed">
            <p>
                Our vision is to redefine luxury shopping by creating an accessible and
                responsible marketplace for preloved items. We aim to inspire a new
                generation of conscious consumers who understand the importance of
                making thoughtful purchasing decisions. By choosing Sellaids, you are
                not only elevating your style but also supporting a sustainable
                lifestyle.
            </p>
        </div>
    ),
};

export default function AboutTabs() {
    const [activeTab, setActiveTab] = useState("value");

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Tab Buttons */}
            <div className="flex flex-wrap justify-center gap-4 border-b border-gray-200 pb-4">
                {tabs.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`px-6 py-2 font-semibold text-sm border rounded-sm transition-colors duration-200
              ${activeTab === id
                                ? "bg-orange-500 text-white border-orange-500"
                                : "text-black border-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-8">{TabContent[activeTab]}</div>

            {/* Brand Banner Image */}
            <div className="mt-10 px-4 sm:px-0">
                <img
                    src={brandImage}
                    alt="Brand Banner"
                    className="w-full max-w-full h-auto object-cover"
                />
            </div>
        </section>
    );
}
