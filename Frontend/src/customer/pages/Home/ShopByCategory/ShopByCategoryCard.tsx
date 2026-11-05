import React, { useState } from 'react';
import './ShopByCategory.css';
import type { HomeCategory } from '../../../../types/HomeCategoryType';
import { useNavigate } from 'react-router-dom';

const FALLBACK_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80";

const ShopByCategoryCard = ({ item }: { item: HomeCategory }) => {
    const navigate = useNavigate();
    const [imgSrc, setImgSrc] = useState(item.image || FALLBACK_CATEGORY_IMAGE);

    return (
        <div
            onClick={() => navigate(`/products/${item.categoryId}`)}
            className="flex gap-3 flex-col justify-center items-center group cursor-pointer"
        >
            <div className="custom-border w-37.5 h-37.5 lg:w-62 lg:h-62 rounded-full bg-primary-color p-0.5 transition-transform duration-500 group-hover:scale-105 overflow-hidden shadow-md">
                <img
                    className="rounded-full group-hover:scale-95 transition-transform duration-700 object-cover object-top h-full w-full"
                    src={imgSrc}
                    alt={item.name}
                    onError={() => setImgSrc(FALLBACK_CATEGORY_IMAGE)}
                    loading="lazy"
                />
            </div>
            <h1 className="font-semibold text-sm lg:text-base text-gray-800 group-hover:text-teal-700 transition-colors text-center capitalize">
                {item.name}
            </h1>
        </div>
    );
};

export default ShopByCategoryCard;