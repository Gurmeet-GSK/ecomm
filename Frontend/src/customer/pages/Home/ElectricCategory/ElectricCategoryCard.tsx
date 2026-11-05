import React, { useState } from 'react';
import type { HomeCategory } from '../../../../types/HomeCategoryType';
import { useNavigate } from 'react-router-dom';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80";

const ElectricCategoryCard = ({ item }: { item: HomeCategory }) => {
    const navigate = useNavigate();
    const [imgSrc, setImgSrc] = useState(item.image || FALLBACK_IMAGE);

    return (
        <div
            onClick={() => navigate(`/products/${item.categoryId}`)}
            className="flex flex-col gap-2 justify-center items-center cursor-pointer group p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-sm"
        >
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-teal-50 transition-colors p-2 overflow-hidden shadow-inner">
                <img
                    className="object-cover w-full h-full rounded-full group-hover:scale-110 transition-transform duration-300"
                    src={imgSrc}
                    alt={item.name}
                    onError={() => setImgSrc(FALLBACK_IMAGE)}
                    loading="lazy"
                />
            </div>
            <h2 className="font-semibold text-xs md:text-sm text-center text-gray-700 group-hover:text-teal-700 transition-colors capitalize">
                {item.name}
            </h2>
        </div>
    );
};

export default ElectricCategoryCard;