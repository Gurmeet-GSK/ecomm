import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import authReducer from "./AuthSlice";
import sellerAuthReducer from "./seller/sellerAuthSlice";
import sellerReducer from "./seller/sellerSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  sellerAuth: sellerAuthReducer,
  seller: sellerReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;