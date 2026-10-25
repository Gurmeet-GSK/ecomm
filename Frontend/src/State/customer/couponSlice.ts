import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type { Cart } from "../../types/cartTypes";
import type { Coupon, CouponState } from "../../types/couponTypes";

const API_URL = "/api/coupon";

// Async thunks
export const applyCoupon = createAsyncThunk<
    Cart,
    {
        apply: string;
        code: string;
        orderValue: number;
        jwt: string;
    },
    { rejectValue: string }
>(
    "coupon/applyCoupon",
    async ({ apply, code, orderValue, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/apply`, null, {
                params: { apply, code, orderValue },
                headers: { Authorization: `Bearer ${jwt}` },
            });
            console.log("apply coupon ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error", error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to apply coupon"
            );
        }
    }
);

export const removeCoupon = createAsyncThunk<
    Cart,
    {
        code: string;
        orderValue: number;
        jwt: string;
    },
    { rejectValue: string }
>(
    "coupon/removeCoupon",
    async ({ code, orderValue, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/apply`, null, {
                params: { apply: "false", code, orderValue },
                headers: { Authorization: `Bearer ${jwt}` },
            });
            console.log("remove coupon ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error", error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to remove coupon"
            );
        }
    }
);

export const createCoupon = createAsyncThunk<
    Coupon,
    { coupon: any; jwt: string },
    { rejectValue: string }
>(
    "coupon/createCoupon",
    async ({ coupon, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/admin/create`, coupon, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create coupon"
            );
        }
    }
);

export const fetchAllCoupons = createAsyncThunk<
    Coupon[],
    string,
    { rejectValue: string }
>(
    "coupon/fetchAllCoupons",
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/admin/all`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch coupons"
            );
        }
    }
);

export const deleteCoupon = createAsyncThunk<
    number,
    { id: number; jwt: string },
    { rejectValue: string }
>(
    "coupon/deleteCoupon",
    async ({ id, jwt }, { rejectWithValue }) => {
        try {
            await api.delete(`${API_URL}/admin/delete/${id}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete coupon"
            );
        }
    }
);

const initialState: CouponState = {
    coupons: [],
    cart: null,
    loading: false,
    error: null,
    couponCreated: false,
    couponApplied: false,
};

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        resetCouponState: (state) => {
            state.loading = false;
            state.error = null;
            state.couponCreated = false;
            state.couponApplied = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // applyCoupon
            .addCase(applyCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.couponApplied = false;
            })
            .addCase(applyCoupon.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload;
                state.couponApplied = true;
                state.error = null;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to apply coupon";
                state.couponApplied = false;
            })

            // removeCoupon
            .addCase(removeCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCoupon.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload;
                state.couponApplied = false;
                state.error = null;
            })
            .addCase(removeCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to remove coupon";
            })

            // createCoupon
            .addCase(createCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.couponCreated = false;
            })
            .addCase(createCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
                state.loading = false;
                state.coupons.push(action.payload);
                state.couponCreated = true;
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create coupon";
                state.couponCreated = false;
            })

            // fetchAllCoupons
            .addCase(fetchAllCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(fetchAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch coupons";
            })

            // deleteCoupon
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCoupon.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.coupons = state.coupons.filter((c) => c.id !== action.payload);
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete coupon";
            });
    },
});

export const { resetCouponState } = couponSlice.actions;
export default couponSlice.reducer;