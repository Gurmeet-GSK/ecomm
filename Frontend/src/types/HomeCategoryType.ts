import type { Deal } from "./dealTypes";

export type HomeCategorySection =
    | "ELECTRIC_CATEGORIES"
    | "GRID"
    | "SHOP_BY_CATEGORIES"
    | "DEALS";

export interface HomeCategory {
    id?: number;
    name: string;
    image: string;
    categoryId: string;
    section?: HomeCategorySection;
    parentCategoryId?: string;
}

export interface HomeData {
    grid: HomeCategory[];
    shopByCategories: HomeCategory[];
    electricCategories: HomeCategory[];
    dealCategories: HomeCategory[];
    deals: Deal[];
    topDeals?: Deal[];
}
