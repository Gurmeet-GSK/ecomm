import React from 'react';
import ShopByCategoryCard from './ShopByCategoryCard';
import { useAppSelector } from '../../../../State/Store';
import type { HomeCategory } from '../../../../types/HomeCategoryType';
import { homeCategories } from '../../../../data/HomeCategories';

const defaultShopByCategories = homeCategories.filter(
    (item) => item.section === "SHOP_BY_CATEGORIES"
);

// Deduplicate categories by categoryId to avoid duplicate circles
const getUniqueCategories = (categories: HomeCategory[]): HomeCategory[] => {
    const seen = new Set<string>();
    return categories.filter((cat) => {
        const id = cat.categoryId || cat.name;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
    });
};

const ShopByCategory = () => {
    const { customer } = useAppSelector((store) => store);
    const rawShopByCategories =
        customer.homePageData?.shopByCategories && customer.homePageData.shopByCategories.length > 0
            ? customer.homePageData.shopByCategories
            : defaultShopByCategories;

    const shopByCategories = getUniqueCategories(rawShopByCategories);

    return (
        <div className="flex flex-wrap justify-center lg:justify-between items-center lg:px-20 gap-7">
            {shopByCategories.map((item: HomeCategory) => (
                <ShopByCategoryCard key={item.id || item.categoryId} item={item} />
            ))}
        </div>
    );
};

export default ShopByCategory;
