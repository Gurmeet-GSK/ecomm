import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import type { User } from "../types/userTypes";

export const sendLoginSignupOtp = createAsyncThunk(
    "/auth/sendLoginSignupOtp",
    async ({ email }: { email: string }, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/sent/login-signup-otp", { email });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to send OTP"
            );
        }
    }
);

export const signing = createAsyncThunk<any, any>(
    "/auth/signing",
    async (loginRequest, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/signing", loginRequest);
            if (response.data.jwt) {
                localStorage.setItem("customer_jwt", response.data.jwt);
                localStorage.setItem("jwt", response.data.jwt); // backward compatibility
                localStorage.setItem("role", "ROLE_CUSTOMER");
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);

export const signup = createAsyncThunk<any, any>(
    "/auth/signup",
    async (signupRequest, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/signup", signupRequest);
            if (response.data.jwt) {
                localStorage.setItem("customer_jwt", response.data.jwt);
                localStorage.setItem("jwt", response.data.jwt); // backward compatibility
                localStorage.setItem("role", "ROLE_CUSTOMER");
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Signup failed"
            );
        }
    }
);

export const fetchUserProfile = createAsyncThunk<any, any>(
    "/auth/fetchUserProfile",
    async ({ jwt }: { jwt: string }, { rejectWithValue }) => {
        try {
            const token = jwt?.startsWith("Bearer ") ? jwt : `Bearer ${jwt}`;
            const response = await api.get("/api/users/profile", {
                headers: {
                    Authorization: token,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch profile"
            );
        }
    }
);

export const logout = createAsyncThunk<any, any>(
    "/auth/logout",
    async (navigate, { rejectWithValue }) => {
        try {
            localStorage.removeItem("customer_jwt");
            // If the legacy jwt belongs to customer, remove it
            if (localStorage.getItem("role") === "ROLE_CUSTOMER") {
                localStorage.removeItem("jwt");
                localStorage.removeItem("role");
            }
            if (navigate) navigate("/");
            return true;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );
        }
    }
);

interface AuthState {
    jwt: string | null;
    otpSent: boolean;
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

const savedJwt =
    typeof window !== "undefined"
        ? localStorage.getItem("customer_jwt") ||
          (localStorage.getItem("role") === "ROLE_CUSTOMER" ? localStorage.getItem("jwt") : null)
        : null;

const initialState: AuthState = {
    jwt: savedJwt,
    otpSent: false,
    isLoggedIn: Boolean(savedJwt),
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendLoginSignupOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendLoginSignupOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(sendLoginSignupOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signing.fulfilled, (state, action) => {
                state.jwt = action.payload.jwt;
                state.isLoggedIn = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.jwt = action.payload.jwt;
                state.isLoggedIn = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoggedIn = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.jwt = null;
                state.isLoggedIn = false;
                state.user = null;
            });
    },
});

export default authSlice.reducer;
