import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type {
    Product,
    CreateProductPayload,
    UpdateProductPayload,
    PageResponse,
} from "../../types/ProductTypes";

export const fetchSellerProducts = createAsyncThunk<PageResponse<Product> | Product[], { jwt?: string; page?: number; size?: number } | string | undefined>(
    "sellerProducts/fetchSellerProducts",
    async (arg, { rejectWithValue }) => {
        try {
            const token = typeof arg === "string" ? arg : arg?.jwt;
            const page = typeof arg === "object" ? arg?.page ?? 0 : 0;
            const size = typeof arg === "object" ? arg?.size ?? 20 : 20;

            const authToken = token || localStorage.getItem("seller_jwt") || localStorage.getItem("jwt") || "";
            const formattedToken = authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`;

            const response = await api.get("/sellers/products", {
                headers: {
                    Authorization: formattedToken,
                },
                params: {
                    page,
                    size,
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

export const createProduct = createAsyncThunk<Product, { request: CreateProductPayload; jwt?: string }>(
    "sellerProducts/createProduct",
    async ({ request, jwt }, { rejectWithValue }) => {
        try {
            const token = jwt || localStorage.getItem("seller_jwt") || localStorage.getItem("jwt") || "";
            const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

            const response = await api.post("/sellers/products", request, {
                headers: {
                    Authorization: formattedToken,
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

export const updateProduct = createAsyncThunk<Product, { productId: number; product: UpdateProductPayload; jwt?: string }>(
    "sellerProducts/updateProduct",
    async ({ productId, product, jwt }, { rejectWithValue }) => {
        try {
            const token = jwt || localStorage.getItem("seller_jwt") || localStorage.getItem("jwt") || "";
            const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

            const response = await api.put(`/sellers/products/${productId}`, product, {
                headers: {
                    Authorization: formattedToken,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update product"
            );
        }
    }
);

export const deleteProduct = createAsyncThunk<number, { productId: number; jwt?: string }>(
    "sellerProducts/deleteProduct",
    async ({ productId, jwt }, { rejectWithValue }) => {
        try {
            const token = jwt || localStorage.getItem("seller_jwt") || localStorage.getItem("jwt") || "";
            const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

            await api.delete(`/sellers/products/${productId}`, {
                headers: {
                    Authorization: formattedToken,
                },
            });
            return productId;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete product"
            );
        }
    }
);

export const updateProductStock = createAsyncThunk<Product, { productId: number; jwt?: string }>(
    "sellerProducts/updateProductStock",
    async ({ productId, jwt }, { rejectWithValue }) => {
        try {
            const token = jwt || localStorage.getItem("seller_jwt") || localStorage.getItem("jwt") || "";
            const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

            const response = await api.patch(`/sellers/products/${productId}/stock`, {}, {
                headers: {
                    Authorization: formattedToken,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update product stock"
            );
        }
    }
);

interface SellerProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    totalElements: number;
}

const initialState: SellerProductState = {
    products: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 0,
    totalElements: 0,
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
                if (Array.isArray(action.payload)) {
                    state.products = action.payload;
                    state.totalElements = action.payload.length;
                    state.totalPages = 1;
                } else if (action.payload && Array.isArray(action.payload.content)) {
                    state.products = action.payload.content;
                    state.totalPages = action.payload.totalPages ?? 1;
                    state.currentPage = action.payload.number ?? 0;
                    state.totalElements = action.payload.totalElements ?? action.payload.content.length;
                }
            })
            .addCase(fetchSellerProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.products.unshift(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                const index = state.products.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.products = state.products.filter((p) => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProductStock.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductStock.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                const index = state.products.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProductStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default sellerProductSlice.reducer;
