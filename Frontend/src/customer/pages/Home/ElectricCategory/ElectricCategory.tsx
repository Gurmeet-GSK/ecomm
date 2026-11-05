import React from 'react';
import ElectricCategoryCard from './ElectricCategoryCard';
import { useAppSelector } from '../../../../State/Store';
import type { HomeCategory } from '../../../../types/HomeCategoryType';
import { homeCategories } from '../../../../data/HomeCategories';

const defaultElectricCategories = homeCategories.filter(
    (item) => item.section === "ELECTRIC_CATEGORIES"
);

// Deduplicate categories by categoryId to avoid duplicates
const getUniqueCategories = (categories: HomeCategory[]): HomeCategory[] => {
    const seen = new Set<string>();
    return categories.filter((cat) => {
        const id = cat.categoryId || cat.name;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
    });
};

const ElectricCategory = () => {
    const { customer } = useAppSelector((store) => store);

    const rawElectricCategories =
        customer.homePageData?.electricCategories && customer.homePageData.electricCategories.length > 0
            ? customer.homePageData.electricCategories
            : defaultElectricCategories;

    const electricCategories = getUniqueCategories(rawElectricCategories);

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 py-6 px-4 lg:px-20 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
            {electricCategories.slice(0, 7).map((item: HomeCategory) => (
                <ElectricCategoryCard key={item.id || item.categoryId} item={item} />
            ))}
        </div>
    );
};

export default ElectricCategory;
