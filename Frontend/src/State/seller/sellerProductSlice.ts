
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type { Product } from "../../types/ProductTypes";

export const fetchSellerProducts = createAsyncThunk<Product[], any>(
    "sellerProducts/fetchSellerProducts",
    async (jwt: any, { rejectWithValue }) => {
        try {
            const response = await api.get("/sellers/products", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch seller products"
            );
        }
    }
);

export const createProduct = createAsyncThunk<Product, { request: any; jwt: string }>(
    "sellerProducts/createProduct",
    async (args: any, { rejectWithValue }) => {
        const { request, jwt } = args;
        try {
            const response = await api.post("/sellers/products", request, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create product"
            );
        }
    }
);


interface SellerProductState {
    products: Product[];
    loading:boolean;
    error: string | null;
}

const initialState: SellerProductState = {
    products: [],
    loading: false,
    error: null,
};

const sellerProductSlice = createSlice({
    name: "sellerProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchSellerProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSellerProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        })
        .addCase(fetchSellerProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(createProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products.push(action.payload);
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
});

export default sellerProductSlice.reducer;
