import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export const fetchSellerProfile = createAsyncThunk(
  "/sellers/fetchSellerProfile",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const token = jwt.startsWith("Bearer ") ? jwt : `Bearer ${jwt}`;
      const response = await api.get("/sellers/profile", {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error: any) {
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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create seller"
      );
    }
  }
);

export const fetchSellerReport = createAsyncThunk(
  "/sellers/fetchSellerReport",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const token = jwt.startsWith("Bearer ") ? jwt : `Bearer ${jwt}`;
      const response = await api.get("/sellers/report", {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch seller report"
      );
    }
  }
);

interface SellerState {
  sellers: any[];
  selectedSeller: any | null;
  profile: any | null;
  report: any | null;
  loading: boolean;
  error: any;
}

const initialState: SellerState = {
  sellers: [],
  selectedSeller: null,
  profile: null,
  report: null,
  loading: false,
  error: null,
};

const sellerSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {
    resetSellerState: (state) => {
      state.sellers = [];
      state.selectedSeller = null;
      state.profile = null;
      state.report = null;
      state.loading = false;
      state.error = null;
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
      })
      .addCase(fetchSellerProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createSeller
      .addCase(createSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeller.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.selectedSeller = action.payload;
      })
      .addCase(createSeller.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchSellerReport
      .addCase(fetchSellerReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerReport.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchSellerReport.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
