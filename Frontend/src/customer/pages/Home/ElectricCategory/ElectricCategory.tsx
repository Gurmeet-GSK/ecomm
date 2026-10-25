import React from 'react';
import ElectricCategoryCard from './ElectricCategoryCard';
import { useAppSelector } from '../../../../State/Store';
import type { HomeCategory } from '../../../../types/HomeCategoryType';

const ElectricCategory = () => {
    const { customer } = useAppSelector((store) => store);

    const electricCategories = customer.homePageData?.electricCategories || [];

    if (!electricCategories.length) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 py-6 px-4 lg:px-20 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
            {electricCategories.slice(0, 7).map((item: HomeCategory) => (
                <ElectricCategoryCard key={item.id || item.categoryId} item={item} />
            ))}
        </div>
    );
};

export default ElectricCategory;
