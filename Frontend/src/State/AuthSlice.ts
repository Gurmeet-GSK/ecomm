import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../config/Api";

export interface SendOtpPayload {
    email: string;
    role?: string;
}

export interface LoginPayload {
    email: string;
    otp: string;
}

export interface SignupPayload {
    email: string;
    fullName: string;
    otp: string;
}

export const sendLoginSignUpOtp = createAsyncThunk(
    "/auth/sendLoginSignUpOtp",
    async ({ email, role }: SendOtpPayload, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/sent/login-signup-otp", {
                email,
                role,
            });
            console.log("login otp response: ", response);
            return response.data;
        } catch (error: any) {
            console.log("error - - - - ", error);
            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Failed to send OTP";
            return rejectWithValue(message);
        }
    }
);

export const signin = createAsyncThunk<any, LoginPayload>(
    "/auth/signin",
    async (loginRequest, { rejectWithValue }) => {
        try {
            // Backend AuthController has both /auth/signing and /auth/signin
            const response = await api.post("/auth/signing", loginRequest);
            console.log("response data for customer login: ", response.data);
            if (response.data?.jwt) {
                localStorage.setItem("jwt", response.data.jwt);
                localStorage.setItem("role", response.data.role || "ROLE_CUSTOMER");
            }
            return response.data;
        } catch (error: any) {
            console.log("error - - - - ", error);
            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Customer login failed";
            return rejectWithValue(message);
        }
    }
);

export const signup = createAsyncThunk<any, SignupPayload>(
    "/auth/signup",
    async (signupRequest, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/signup", signupRequest);
            console.log("response data for customer signup: ", response.data);
            if (response.data?.jwt) {
                localStorage.setItem("jwt", response.data.jwt);
                localStorage.setItem("role", response.data.role || "ROLE_CUSTOMER");
            }
            return response.data;
        } catch (error: any) {
            console.log("error - - - - ", error);
            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Customer registration failed";
            return rejectWithValue(message);
        }
    }
);

export interface AuthState {
    jwt: string | null;
    role: string | null;
    loading: boolean;
    error: string | null;
    otpSent: boolean;
    isLoggedIn: boolean;
}

const savedJwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
const savedRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;

const initialState: AuthState = {
    jwt: savedJwt,
    role: savedRole,
    loading: false,
    error: null,
    otpSent: false,
    isLoggedIn: Boolean(savedJwt),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.jwt = null;
            state.role = null;
            state.isLoggedIn = false;
            state.otpSent = false;
            state.error = null;
            localStorage.removeItem("jwt");
            localStorage.removeItem("role");
        },
        resetAuthStatus: (state) => {
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // sendLoginSignUpOtp
            .addCase(sendLoginSignUpOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpSent = false;
            })
            .addCase(sendLoginSignUpOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
                state.error = null;
            })
            .addCase(sendLoginSignUpOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to send OTP";
                state.otpSent = false;
            })
            // signin
            .addCase(signin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signin.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.jwt = action.payload?.jwt || null;
                state.role = action.payload?.role || "ROLE_CUSTOMER";
                state.isLoggedIn = Boolean(action.payload?.jwt);
                state.error = null;
            })
            .addCase(signin.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Customer login failed";
            })
            // signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.jwt = action.payload?.jwt || null;
                state.role = action.payload?.role || "ROLE_CUSTOMER";
                state.isLoggedIn = Boolean(action.payload?.jwt);
                state.error = null;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Customer signup failed";
            });
    },
});

export const { logout, resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;