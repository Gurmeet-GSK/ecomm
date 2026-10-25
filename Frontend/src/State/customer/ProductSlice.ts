import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "../../config/Api";
import type { Product } from "../../types/ProductTypes";

const API_URL = "http://localhost:5454";

export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",
    async (productId: number, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/${productId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const SearchProduct = createAsyncThunk(
    "products/searchProduct",
    async (query: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/products/search?query=${query}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchAllProducts = createAsyncThunk<any, any>(
    "products/fetchAllProducts",
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}`, {
                params: {
                    ...params,
                    pageNumber: params.pageNumber || 0,
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

interface ProductState{
    products: Product[] | null;
    product: Product | null;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    searchProducts: Product[] | null;
}

const initialState : ProductState = {
    products: null,
    product: null,
    loading: false,
    error: null,
    currentPage: 0,
    totalPages: 1,
    searchProducts: [],
}   

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch product";
            })  
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.content;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch all products";
            })
            .addCase(SearchProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(SearchProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.searchProducts = action.payload;
            })
            .addCase(SearchProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to search products";
            });
    },
});

export default productSlice.reducer;    