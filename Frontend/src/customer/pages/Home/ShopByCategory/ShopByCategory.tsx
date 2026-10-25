import React from 'react';
import ShopByCategoryCard from './ShopByCategoryCard';
import { useAppSelector } from '../../../../State/Store';
import type { HomeCategory } from '../../../../types/HomeCategoryType';

const ShopByCategory = () => {
    const { customer } = useAppSelector((store) => store);
    const shopByCategories = customer.homePageData?.shopByCategories || [];

    if (!shopByCategories.length) {
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center lg:justify-between items-center lg:px-20 gap-7">
            {shopByCategories.map((item: HomeCategory) => (
                <ShopByCategoryCard key={item.id || item.categoryId} item={item} />
            ))}
        </div>
    );
};

export default ShopByCategory;