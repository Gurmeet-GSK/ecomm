import React from 'react';
import type { HomeCategory } from '../../../../types/HomeCategoryType';
import { useNavigate } from 'react-router-dom';

const ElectricCategoryCard = ({ item }: { item: HomeCategory }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/products/${item.categoryId}`)}
            className="flex flex-col gap-2 justify-center items-center cursor-pointer group p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-sm"
        >
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-teal-50 transition-colors p-2">
                <img
                    className="object-contain w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                    src={item.image}
                    alt={item.name}
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