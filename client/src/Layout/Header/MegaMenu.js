import React from "react";
import { Link } from "react-router-dom";

// Divider Component
export const Divider1 = () => <div className="hidden lg:block w-px bg-gray-300" />;

// Reusable Section Component
// export const Section = ({ title, items, baseSlug }) => (
//     <div>
//         <h3 className="text-orange-500 font-semibold mb-2">{title}</h3>
//         <ul className="space-y-1 text-gray-800 text-sm">
//             {items.map((item, index) => (
//                 <li key={index}>
//                     <Link
//                         to={`/product-category/${baseSlug}/${title
//                             .toLowerCase()
//                             .replace(/\s+/g, "-")}/${item.toLowerCase().replace(/\s+/g, "-")}`}
//                         className="hover:text-orange-500 cursor-pointer transition"
//                     >
//                         {item}
//                     </Link>
//                 </li>
//             ))}
//             <li className="mt-2 text-orange-500 font-medium border-b-2 border-orange-500 w-fit cursor-pointer">
//                 <Link
//                     to={`/product-category/${baseSlug}/${title
//                         .toLowerCase()
//                         .replace(/\s+/g, "-")}`}
//                 >
//                     View All
//                 </Link>
//             </li>
//         </ul>
//     </div>
// );

export const Section = ({ title, items, baseSlug }) => (
    <div>
        <h3 className="text-orange-500 font-semibold mb-2">{title}</h3>
        <ul className="space-y-1 text-gray-800 text-sm">
            {items?.map((item, index) => (
                <li key={index}>
                    <Link
                        to={`/product-category/${baseSlug}/${title
                            ?.toLowerCase()
                            ?.replace(/\s+/g, "-")}/${item?.slug}`}
                        className="hover:text-orange-500 cursor-pointer transition"
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
            <li className="mt-2 text-orange-500 font-medium border-b-2 border-orange-500 w-fit cursor-pointer">
                <Link
                    to={`/product-category/${baseSlug}/${title
                        ?.toLowerCase()
                        ?.replace(/\s+/g, "-")}`}
                >
                    View All
                </Link>
            </li>
        </ul>
    </div>
);

//
// -----------------------------
// 🧒 KIDS MEGA MENU
// -----------------------------
export const KidsMegaMenu = ({ kidsCategories }) => {
    const sections = [
        {
            title: "Boys",
            items: [
                "Coats and Jackets",
                "Jeans and Joggers",
                "Hoodies and Sweatshirts",
                "Shirts and T-Shirts",
                "Shorts",
                "Tracksuits",
                "Rompers",
                "Co-ord Sets",
                "Shoes",
            ],
        },
        {
            title: "Girls",
            items: [
                "Coats and Jackets",
                "Denims and Leggings",
                "Hoodies and Sweatshirts",
                "Tops and Tees",
                "Shorts and Skirts",
                "Tracksuits and Joggers",
                "Dresses",
                "Rompers",
                "Co-ord Sets",
                "Shoes",
            ],
        },
        {
            title: "Baby Gear",
            items: [
                "Bath Tub/Chair",
                "Stroller",
                "Car Chair",
                "Bouncer",
                "Cradle",
                "Swings",
                "Walker",
                "High Chair",
                "Bottle Warmer",
                "Sterilizer",
            ],
        },
    ];

    if (!kidsCategories?.slug) return null;
    const baseSlug = kidsCategories?.slug
    console.log(kidsCategories)

    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
            <div className="w-[1000px] bg-white shadow-lg py-6 px-8 border border-gray-200">
                <div className="flex justify-center gap-10">
                    {sections.map((sec, index) => (
                        <React.Fragment key={sec.title}>
                            <Section title={sec.title} items={sec.items} baseSlug={baseSlug} />
                            {index < sections.length - 1 && <Divider1 />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

//
// -----------------------------
// 👨 MEN MEGA MENU
// -----------------------------
export const MensMegaMenu = ({ menCategories }) => {
    const sections = [
        {
            title: "Designer Aid",
            items: [
                "Bespoke Studio",
                "Nehru Jackets",
                "Formal Suits",
                "Sherwanis and Kurta Sets",
            ],
        },
        {
            title: "Bags",
            items: ["Travel and Laptop Bags", "Wallets and Pouches", "Cross Body"],
        },
        {
            title: "Shoes",
            items: [
                "Formal and Casual Shoes",
                "Sports Shoes and Sneakers",
                "Sandals and Slippers",
            ],
        },
        {
            title: "Apparel",
            items: [
                "Jackets and Coats",
                "Sweaters and Sweatshirts",
                "Shirts and T-Shirts",
                "Bottoms",
            ],
        },
        {
            title: "Accessories",
            items: ["Ties and Eyewear", "Belts and Caps", "Watches"],
        },
    ];

    if (!menCategories?.slug) return null;
    const baseSlug = menCategories?.slug
    console.log(menCategories)

    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
            <div className="w-[1100px] bg-white shadow-lg py-6 px-8 border border-gray-200">
                <div className="flex justify-center gap-10">
                    {sections.map((sec, index) => (
                        <React.Fragment key={sec.title}>
                            <Section title={sec.title} items={sec.items} baseSlug={baseSlug} />
                            {index < sections.length - 1 && <Divider1 />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

//
// -----------------------------
// 👩 WOMEN MEGA MENU
// -----------------------------
export const MegaMenu = ({ womenCategories }) => {
    if (!womenCategories?.slug) return null;
    const baseSlug = womenCategories?.slug
    // console.log(womenCategories)

    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
            <div className="w-[1100px] bg-white shadow-lg py-6 px-8 border border-gray-200">
                <div className="flex justify-center gap-10">
                    {womenCategories.subCategories.map((mainSection, index) => (
                        <React.Fragment key={mainSection.id}>
                            <div>
                                {/* Main Title: e.g. Designer Aid / Fashion Aid */}
                                <h2 className="text-center text-lg font-serif tracking-wide mb-4 uppercase">
                                    {mainSection.name}
                                </h2>

                                {/* Inner Sections: e.g. Indian Edit, Sarees, etc */}
                                <div className="flex gap-8">
                                    {mainSection.subCategories?.map((sub) => (
                                        <Section
                                            key={sub.slug}
                                            title={sub.name}
                                            items={sub.subCategories || []}
                                            baseSlug={`${baseSlug}/${mainSection.slug}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {index < womenCategories.subCategories.length - 1 && <Divider1 />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};
