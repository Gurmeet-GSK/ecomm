import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Transaction } from "../../types/Transaction";
import { api } from "../../config/Api";

export interface TransactionState {
    transactions: Transaction[];
    transaction: Transaction | null;
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: TransactionState = {
    transactions: [],
    transaction: null,
    loading: false,
    error: null,
};

// Thunks
export const fetchTransactionsBySeller = createAsyncThunk<
    Transaction[],
    string,
    { rejectValue: string }
>(
    "transactions/fetchTransactionsBySeller",
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get<Transaction[]>("/api/transactions/seller", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("fetchTransactionsBySeller", response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch transactions");
        }
    }
);

export const fetchAllTransactions = createAsyncThunk<
    Transaction[],
    void,
    { rejectValue: string }
>(
    "transactions/fetchAllTransactions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<Transaction[]>("/api/transactions");
            console.log("fetchAllTransactions", response.data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch all transactions");
        }
    }
);

const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactionsBySeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionsBySeller.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchTransactionsBySeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAllTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchAllTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default transactionSlice.reducer;
