import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export const fetchSellerProfile = createAsyncThunk(
  "/sellers/fetchSellerProfile",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/sellers/profile", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("error fetching seller profile: ", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch seller profile"
      );
    }
  }
);

export const createSeller = createAsyncThunk(
  "/sellers/createSeller",
  async (sellerData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/sellers", sellerData);
      console.log("seller created response: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error creating seller: ", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create seller"
      );
    }
  }
);

export interface SellerState {
  profile: any | null;
  sellers: any[];
  loading: boolean;
  error: string | null;
  sellerCreated: boolean;
}

const initialState: SellerState = {
  profile: null,
  sellers: [],
  loading: false,
  error: null,
  sellerCreated: false,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    resetSellerState: (state) => {
      state.error = null;
      state.loading = false;
      state.sellerCreated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSellerProfile
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch seller profile";
      })
      // createSeller
      .addCase(createSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sellerCreated = false;
      })
      .addCase(createSeller.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload;
        state.sellerCreated = true;
        state.error = null;
      })
      .addCase(createSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create seller";
        state.sellerCreated = false;
      });
  },
});

export const { resetSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
