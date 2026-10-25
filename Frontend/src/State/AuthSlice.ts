import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import type { User } from "../types/userTypes";

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

export const sendLoginSignupOtp = createAsyncThunk(
    "/auth/sendLoginSignupOtp",
    async ({ email, role = "ROLE_CUSTOMER" }: SendOtpPayload, { rejectWithValue }) => {
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

// Backward-compatible alias
export const sendLoginSignUpOtp = sendLoginSignupOtp;

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
            return response.data.jwt || response.data;
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

export const fetchUserProfile = createAsyncThunk<any, { jwt: string }>(
    "/auth/fetchUsersProfile",
    async ({ jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/users/profile", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("fetch user profile: ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error - - - ", error);
            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Failed to fetch profile";
            return rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk<any, any>(
    "/auth/logout",
    async (navigate, { rejectWithValue }) => {
        try {
            localStorage.clear();
            console.log("logout success");
            if (navigate) {
                navigate("/login");
            }
            return true;
        } catch (error: any) {
            console.log("error - - - ", error);
            return rejectWithValue(error.message);
        }
    }
);

export interface AuthState {
    jwt: string | null;
    role: string | null;
    user: User | null;
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
    user: null,
    loading: false,
    error: null,
    otpSent: false,
    isLoggedIn: Boolean(savedJwt),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthStatus: (state) => {
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // sendLoginSignupOtp
            .addCase(sendLoginSignupOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpSent = false;
            })
            .addCase(sendLoginSignupOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
                state.error = null;
            })
            .addCase(sendLoginSignupOtp.rejected, (state, action) => {
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
                const token = typeof action.payload === "string" ? action.payload : action.payload?.jwt;
                state.jwt = token || null;
                state.role = action.payload?.role || "ROLE_CUSTOMER";
                state.isLoggedIn = Boolean(token);
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
                const token = typeof action.payload === "string" ? action.payload : action.payload?.jwt;
                state.jwt = token || null;
                state.role = action.payload?.role || "ROLE_CUSTOMER";
                state.isLoggedIn = Boolean(token);
                state.error = null;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Customer signup failed";
            })
            // fetchUserProfile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch user profile";
            })
            // logout
            .addCase(logout.fulfilled, (state) => {
                state.jwt = null;
                state.role = null;
                state.user = null;
                state.isLoggedIn = false;
                state.otpSent = false;
                state.error = null;
            });
    },
});

export const { resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;