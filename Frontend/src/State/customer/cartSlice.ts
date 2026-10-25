import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type { Cart, CartItem } from "../../types/cartTypes";
import { sumCartItemMrpPrice, sumCartItemSellingPrice } from "../../Util/sumCartItemMrpPrice";
import { applyCoupon, removeCoupon } from "./couponSlice";

// Define the base URL for the API
const API_URL = "/api/cart";

export const fetchUserCart = createAsyncThunk<Cart, string>(
    "cart/fetchUserCart",
    async (jwt: string, { rejectWithValue }) => {
        try {
            const response = await api.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Cart fetched ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user cart"
            );
        }
    }
);

interface AddItemRequest {
    productId: number | undefined;
    size: string;
    quantity: number;
}

export const addItemToCart = createAsyncThunk<
    CartItem,
    { jwt: string | null; request: AddItemRequest }
>(
    "cart/addItemToCart",
    async ({ jwt, request }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_URL}/add`, request, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("Cart added ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue(
                error.response?.data?.message || "Failed to add item to cart"
            );
        }
    }
);

export const deleteCartItem = createAsyncThunk<
    any,
    { jwt: string; cartItemId: number }
>(
    "cart/deleteCartItem",
    async ({ jwt, cartItemId }, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${API_URL}/item/${cartItemId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete cart item"
            );
        }
    }
);

export const updateCartItem = createAsyncThunk<
    CartItem,
    { jwt: string; cartItemId: number; cartItem: any }
>(
    "cart/updateCartItem",
    async ({ jwt, cartItemId, cartItem }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                `${API_URL}/item/${cartItemId}`,
                cartItem,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update cart item"
            );
        }
    }
);

export interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCartState: (state) => {
            state.cart = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchUserCart
            .addCase(fetchUserCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserCart.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchUserCart.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch user cart";
            })
            // addItemToCart
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
                state.loading = false;
                if (state.cart) {
                    state.cart.cartItems.push(action.payload);
                }
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to add item to cart";
            })
            // deleteCartItem
            .addCase(deleteCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.loading = false;
                if (state.cart) {
                    state.cart.cartItems = state.cart.cartItems.filter(
                        (item) => item.id !== action.meta.arg.cartItemId
                    );
                    const mrpPrice = sumCartItemMrpPrice(state.cart.cartItems);
                    const sellingPrice = sumCartItemSellingPrice(state.cart.cartItems);
                    state.cart.totalMrpPrice = mrpPrice;
                    state.cart.totalSellingPrice = sellingPrice;       
                    state.cart.totalItem = state.cart.cartItems.length;
                }
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to delete cart item";
            })
            // updateCartItem
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem>) => {
                state.loading = false;
                if (state.cart && action.payload) {
                    const index = state.cart.cartItems.findIndex(
                        (item) => item.id === action.payload.id
                    );
                    if (index !== -1) {
                        state.cart.cartItems[index] = action.payload;
                    }
                    const mrpPrice = sumCartItemMrpPrice(state.cart.cartItems);
                    const sellingPrice = sumCartItemSellingPrice(state.cart.cartItems);
                    state.cart.totalMrpPrice = mrpPrice;
                    state.cart.totalSellingPrice = sellingPrice;           
                    state.cart.totalItem = state.cart.cartItems.length;
                }
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to update cart item";
            })

            .addCase(applyCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to apply coupon";
            })  


            .addCase(removeCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCoupon.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(removeCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to remove coupon";
            })  
    },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
