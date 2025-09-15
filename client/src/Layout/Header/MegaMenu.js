import React from 'react';

const SectionColumn = ({ title, items }) => (
    <div>
        <h5 className="font-medium text-orange-500 mb-1">{title}</h5>
        <ul className="space-y-1 text-sm text-gray-800 font-body">
            {items.map((item, idx) => (
                <li
                    key={idx}
                    className={`cursor-pointer ${item === 'View All' ? 'underline text-orange-500' : ''}`}
                >
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

const MegaMenuLayout = ({ title, sections }) => (
    <div className="w-full lg:w-1/2">
        <h4 className="text-lg uppercase font-heading mb-6 tracking-wide text-center">{title}</h4>
        <div className="grid grid-cols-2 gap-8 px-4">
            {sections.map((section, index) => (
                <SectionColumn key={index} title={section.title} items={section.items} />
            ))}
        </div>
    </div>
);

const Divider = () => <div className="hidden lg:block w-px bg-gray-300" />;

const MenuWrapper = ({ left, right }) => (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1000px] bg-white shadow-lg py-6 px-8 z-50 hidden group-hover:block border border-gray-200">
        <div className="flex flex-col lg:flex-row justify-center gap-8">
            {left}
            {right && <Divider />}
            {right}
        </div>
    </div>
);

// WOMEN
export const MegaMenu = () => (
    <MenuWrapper
        left={
            <MegaMenuLayout
                title="Designer Aid"
                sections={[
                    { title: 'Indian Edit', items: ['Lehengas', 'Skirt Sets', 'Gowns', 'View All'] },
                    { title: 'Sarees', items: ['Regular Sarees', 'Draped Sarees', 'View All'] },
                    { title: 'Boutique Fit', items: ['Long Suit Sets', 'Short Suit Sets', 'Indowestern', 'View All'] },
                    { title: 'Accessories', items: ['Jewelry', 'Ethnic Clutches and Bags', 'Juttis', 'View All'] },
                ]}
            />
        }
        right={
            <MegaMenuLayout
                title="Fashion Aid"
                sections={[
                    { title: 'Bags', items: ['Cross-body and Shoulder Bags', 'Totes and Carryalls', 'Clutches and Wallets', 'View All'] },
                    { title: 'Shoes', items: ['Bellies and Heels', 'Sneakers and Sport Shoes', 'Sandals and Slippers', 'View All'] },
                    { title: 'Apparel', items: ['Dresses and Jumpsuit', 'Jackets and Coats', 'Tops and T-Shirts', 'Bottoms', 'View All'] },
                    { title: 'Accessories', items: ['Belts', 'Scarves & Stoles', 'Eyewear and Caps', 'Watches', 'View All'] },
                ]}
            />
        }
    />
);

// MEN
export const MensMegaMenu = () => (
    <MenuWrapper
        left={
            <MegaMenuLayout
                title="Designer Aid"
                sections={[
                    {
                        title: 'Bespoke Studio',
                        items: ['Nehru Jacket and Waist Coats', 'Formal Suits', 'Sherwanis and Kurta Sets', 'View All'],
                    },
                ]}
            />
        }
        right={
            <MegaMenuLayout
                title="Fashion Aid"
                sections={[
                    {
                        title: 'Bags',
                        items: ['Travel and Laptop Bags', 'Wallets and Pouches', 'Cross body', 'View All'],
                    },
                    {
                        title: 'Shoes',
                        items: ['Formal and Casual Shoes', 'Sports Shoes and Sneakers', 'Sandals and Slippers', 'View All'],
                    },
                    {
                        title: 'Apparel',
                        items: ['Jackets and Coats', 'Sweaters and Sweatshirts', 'Shirts and T-Shirts', 'Bottoms', 'View All'],
                    },
                    {
                        title: 'Accessories',
                        items: ['Ties and Eyewear', 'Belts and Caps', 'Watches', 'View All'],
                    },
                ]}
            />
        }
    />
);

// KIDS
export const KidsMegaMenu = () => (
    <MenuWrapper
        left={
            <div className="w-full">
                <h4 className="text-lg uppercase font-heading mb-6 tracking-wide text-center">Kids Collection</h4>
                <div className="grid grid-cols-3 gap-8 px-4">
                    {/* Boys */}
                    <div className="pr-6 border-r border-gray-200">
                        <SectionColumn
                            title="Boys"
                            items={[
                                'Coats and Jackets',
                                'Jeans and Joggers',
                                'Hoodies and Sweatshirts',
                                'Shirts and T-Shirts',
                                'Shorts',
                                'Tracksuits',
                                'Rompers',
                                'Co-ord Sets',
                                'Shoes',
                                'View All',
                            ]}
                        />
                    </div>

                    {/* Girls */}
                    <div className="px-6 border-r border-gray-200">
                        <SectionColumn
                            title="Girls"
                            items={[
                                'Coats and Jackets',
                                'Denims and Leggings',
                                'Hoodies and Sweatshirts',
                                'Tops and Tees',
                                'Shorts and Skirts',
                                'Tracksuits and Joggers',
                                'Dresses',
                                'Rompers',
                                'Co-ord Sets',
                                'Shoes',
                                'View All',
                            ]}
                        />
                    </div>

                    {/* Baby Gear */}
                    <div className="pl-6">
                        <SectionColumn
                            title="Baby Gear"
                            items={[
                                'Bath Tub/Chair',
                                'Stroller',
                                'Car Chair',
                                'Bouncer',
                                'Cradle',
                                'Swings',
                                'Walker',
                                'High Chair',
                                'Bottle Warmer',
                                'Sterilizer',
                                'View All',
                            ]}
                        />
                    </div>
                </div>
            </div>
        }
    />
);
