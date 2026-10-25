import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { HomeCategory, HomeData } from "../../types/HomeCategoryType";
import { api } from "../../config/Api";



export const createHomeCategories = createAsyncThunk<
    HomeData,
    HomeCategory[]
>(
    "home/createHomeCategories",
    async (homeCategories, { rejectWithValue }) => {
        try {
            const response = await api.post("/home/categories", homeCategories);
            console.log("home categories ", response.data);
            return response.data;
        } catch (error: any) {
            // Handle the error and return it to be used in rejected action
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to create home categories";
            console.log("err ", errorMessage, error);
            return rejectWithValue(errorMessage);
        }
    }
);

interface HomeState {
    homePageData: HomeData | null;
    homeCategories: HomeCategory[];
    loading: boolean;
    error: string | null;
}

const initialState: HomeState = {
    homePageData: null,
    homeCategories: [],
    loading: false,
    error: null,
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        

        // Handle createHomeCategories lifecycle
        builder.addCase(createHomeCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(
            createHomeCategories.fulfilled,
            (state, action: PayloadAction<HomeData>) => {
                state.loading = false;
                state.homePageData = action.payload;
            }
        );
        builder.addCase(createHomeCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Failed to create home categories";
        });
    },
});

export default homeSlice.reducer;
