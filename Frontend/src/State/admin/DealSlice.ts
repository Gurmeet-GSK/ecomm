import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type { ApiResponse, Deal, DealsState } from "../../types/dealTypes";

const API_URL = "/admin/deals";

export const getAllDeals = createAsyncThunk<
    Deal[],
    void,
    { rejectValue: string }
>(
    "deal/getAllDeals",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            console.log("get all deals ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch deals"
            );
        }
    }
);

export const getDeals = getAllDeals;

export const createDeal = createAsyncThunk<
    Deal,
    any,
    { rejectValue: string }
>(
    "deal/createDeal",
    async (deal, { rejectWithValue }) => {
        try {
            const response = await api.post(API_URL, deal, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            console.log("create deal ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to create deal"
            );
        }
    }
);

export const updateDeal = createAsyncThunk<
    Deal,
    { id: number; deal: any },
    { rejectValue: string }
>(
    "deal/updateDeal",
    async ({ id, deal }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`${API_URL}/${id}`, deal, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            console.log("update deal ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to update deal"
            );
        }
    }
);

export const deleteDeal = createAsyncThunk<
    ApiResponse & { id: number },
    number,
    { rejectValue: string }
>(
    "deal/deleteDeal",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            console.log("delete deal ", response.data);
            return { ...response.data, id };
        } catch (error: any) {
            console.log("error ", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete deal"
            );
        }
    }
);

// Backward-compatible aliases matching common tutorial naming
export const updateDealCategory = updateDeal;
export const deleteDealCategory = deleteDeal;

const initialState: DealsState = {
    deals: [],
    loading: false,
    error: null,
    dealCreated: false,
    dealUpdated: false,
};

const dealSlice = createSlice({
    name: "deal",
    initialState,
    reducers: {
        resetDealState: (state) => {
            state.dealCreated = false;
            state.dealUpdated = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Get All Deals
        builder.addCase(getAllDeals.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAllDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
            state.loading = false;
            state.deals = action.payload;
        });
        builder.addCase(getAllDeals.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Failed to fetch deals";
        });

        // Create Deal
        builder.addCase(createDeal.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.dealCreated = false;
        });
        builder.addCase(createDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
            state.loading = false;
            state.dealCreated = true;
            state.deals.push(action.payload);
        });
        builder.addCase(createDeal.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Failed to create deal";
        });

        // Update Deal
        builder.addCase(updateDeal.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.dealUpdated = false;
        });
        builder.addCase(updateDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
            state.loading = false;
            state.dealUpdated = true;
            state.deals = state.deals.map((item) =>
                item.id === action.payload.id ? action.payload : item
            );
        });
        builder.addCase(updateDeal.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Failed to update deal";
        });

        // Delete Deal
        builder.addCase(deleteDeal.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteDeal.fulfilled, (state, action) => {
            state.loading = false;
            state.deals = state.deals.filter((item) => item.id !== action.payload.id);
        });
        builder.addCase(deleteDeal.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Failed to delete deal";
        });
    },
});

export const { resetDealState } = dealSlice.actions;
export default dealSlice.reducer;
