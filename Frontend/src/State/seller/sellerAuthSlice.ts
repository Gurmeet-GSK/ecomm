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
            const response = await api.post("/sellers/login", loginRequest);
            if (response.data?.jwt) {
                localStorage.setItem("seller_jwt", response.data.jwt);
                localStorage.setItem("jwt", response.data.jwt); // backward compatibility
                localStorage.setItem("role", "ROLE_SELLER");
            }
            return response.data;
        } catch (error: any) {
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

const savedSellerJwt =
    typeof window !== "undefined"
        ? localStorage.getItem("seller_jwt") ||
          (localStorage.getItem("role") === "ROLE_SELLER" ? localStorage.getItem("jwt") : null)
        : null;

const initialState: SellerAuthState = {
    jwt: savedSellerJwt,
    role: savedSellerJwt ? "ROLE_SELLER" : null,
    loading: false,
    error: null,
    isSellerLoggedIn: Boolean(savedSellerJwt),
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
            localStorage.removeItem("seller_jwt");
            if (localStorage.getItem("role") === "ROLE_SELLER") {
                localStorage.removeItem("jwt");
                localStorage.removeItem("role");
            }
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
                state.jwt = action.payload.jwt;
                state.role = "ROLE_SELLER";
                state.isSellerLoggedIn = true;
            })
            .addCase(sellerLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isSellerLoggedIn = false;
            });
    },
});

export const { sellerLogout } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;
