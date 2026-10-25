import type { Seller } from "./SellerTypes";

export interface Category {
    id?: number;
    name: string;
    categoryId: string;
    parentCategory?: Category;
    level: number;
    subcategories?: Category[];
}

export interface Product {
    id?: number;
    title: string;
    description: string;
    mrpPrice: number;
    sellingPrice: number;
    discountPercent: number;
    quantity: number;
    color: string;
    images: string[];
    numRatings?: number;
    category?: Category;
    seller?: Seller;
    createdAt?: string;
    sizes?: string;
    in_stock?: boolean;
}