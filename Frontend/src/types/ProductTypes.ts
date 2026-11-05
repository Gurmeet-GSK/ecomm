import type { Seller } from "./SellerTypes";

export interface Category {
    id?: number;
    name?: string | null;
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

export interface PageResponse<T> {
    content: T[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    empty: boolean;
    first: boolean;
    last: boolean;
    size: number;
    number: number;
}

export interface CreateProductPayload {
    title: string;
    description: string;
    mrpPrice: number;
    discountPercent: number;
    sellingPrice?: number;
    color: string;
    sizes: string;
    images: string[];
    category: string;
    category2: string;
    category3: string;
}

export interface UpdateProductPayload {
    title?: string;
    description?: string;
    mrpPrice?: number;
    discountPercent?: number;
    color?: string;
    sizes?: string;
    images?: string[];
    category?: Category;
    in_stock?: boolean;
}
