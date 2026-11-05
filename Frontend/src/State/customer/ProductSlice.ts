import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type { Product } from "../../types/ProductTypes";

export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",
    async (productId: number, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/${productId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const SearchProduct = createAsyncThunk(
    "products/searchProduct",
    async (query: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/search?query=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAllProducts = createAsyncThunk<any, any>(
    "products/fetchAllProducts",
    async (params: any, { rejectWithValue }) => {
        try {
            // Clean undefined, null, or empty string params so backend doesn't apply empty filters
            const cleanParams: Record<string, any> = {};
            Object.keys(params || {}).forEach((key) => {
                const val = params[key];
                if (val !== undefined && val !== null && val !== "") {
                    cleanParams[key] = val;
                }
            });

            cleanParams.pageNumber = cleanParams.pageNumber ?? 0;

            const response = await api.get("/products", {
                params: cleanParams,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

interface ProductState {
    products: Product[] | null;
    product: Product | null;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    searchProducts: Product[] | null;
}

const initialState: ProductState = {
    products: null,
    product: null,
    loading: false,
    error: null,
    currentPage: 0,
    totalPages: 1,
    searchProducts: [],
};

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
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.content || [];
                state.currentPage = action.payload.number ?? action.payload.currentPage ?? 0;
                state.totalPages = action.payload.totalPages ?? 1;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch all products";
                state.products = [];
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
