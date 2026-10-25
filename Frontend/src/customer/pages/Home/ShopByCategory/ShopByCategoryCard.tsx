import React from 'react';
import './ShopByCategory.css';
import type { HomeCategory } from '../../../../types/HomeCategoryType';
import { useNavigate } from 'react-router-dom';

const ShopByCategoryCard = ({ item }: { item: HomeCategory }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/products/${item.categoryId}`)}
            className="flex gap-3 flex-col justify-center items-center group cursor-pointer"
        >
            <div className="custom-border w-37.5 h-37.5 lg:w-62 lg:h-62 rounded-full bg-primary-color p-0.5 transition-transform duration-500 group-hover:scale-105">
                <img
                    className="rounded-full group-hover:scale-95 transition-transform duration-700 object-cover object-top h-full w-full"
                    src={item.image}
                    alt={item.name}
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