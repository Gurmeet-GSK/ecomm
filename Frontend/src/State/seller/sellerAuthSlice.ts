import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export interface SellerLoginRequest {
    email: string;
    otp: string;
}

export const sellerLogin = createAsyncThunk<any, SellerLoginRequest>(
    "/sellerAuth/sellerLogin",
    async (loginRequest, { rejectWithValue }) => {
        try {
            // Primary seller login endpoint is /sellers/login
            const response = await api.post("/sellers/login", loginRequest);
            console.log("response data for seller login: ", response.data);
            if (response.data?.jwt) {
                localStorage.setItem("jwt", response.data.jwt);
                localStorage.setItem("role", "ROLE_SELLER");
            }
            return response.data;
        } catch (error: any) {
            console.log("error in sellerLogin: ", error);
            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Seller login failed. Please check your credentials.";
            return rejectWithValue(message);
        }
    }
);

export interface SellerAuthState {
    jwt: string | null;
    role: string | null;
    loading: boolean;
    error: string | null;
    isSellerLoggedIn: boolean;
}

const savedJwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
const savedRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;
const isSeller = Boolean(savedJwt && savedRole === "ROLE_SELLER");

const initialState: SellerAuthState = {
    jwt: isSeller ? savedJwt : null,
    role: isSeller ? savedRole : null,
    loading: false,
    error: null,
    isSellerLoggedIn: isSeller,
};

const sellerAuthSlice = createSlice({
    name: "sellerAuth",
    initialState,
    reducers: {
        sellerLogout: (state) => {
            state.jwt = null;
            state.role = null;
            state.isSellerLoggedIn = false;
            state.error = null;
            localStorage.removeItem("jwt");
            localStorage.removeItem("role");
        },
        resetSellerAuthStatus: (state) => {
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sellerLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sellerLogin.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.jwt = action.payload?.jwt || null;
                state.role = action.payload?.role || "ROLE_SELLER";
                state.isSellerLoggedIn = Boolean(action.payload?.jwt);
                state.error = null;
            })
            .addCase(sellerLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Seller login failed";
                state.isSellerLoggedIn = false;
            });
    },
});

export const { sellerLogout, resetSellerAuthStatus } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;