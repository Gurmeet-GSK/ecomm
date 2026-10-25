import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import authSlice from "./AuthSlice";
import sellerAuthSlice from "./seller/sellerAuthSlice";
import sellerSlice from "./seller/sellerSlice";
import sellerProductSlice from "./seller/sellerProductSlice";
import productSlice from "./customer/ProductSlice";
import cartSlice from "./customer/cartSlice";
import couponSlice from "./customer/couponSlice";
import orderSlice from "./customer/orderSlice";
import sellerOrderSlice from "./seller/sellerOrderSlice";
import wishlistSlice from "./customer/wishlistSlice";
import transactionSlice from "./seller/transactionSlice";
import homeCategorySlice from "./admin/adminSlice";
import homeSlice from "./customer/customerSlice";
import customerSlice from "./customer/customerSlice";
import dealSlice from "./admin/DealSlice";
const rootReducer = combineReducers({
  seller: sellerSlice,
  sellerProduct: sellerProductSlice,
  sellerAuth: sellerAuthSlice,
  sellerOrder: sellerOrderSlice,
  product: productSlice,
  auth: authSlice,
  cart: cartSlice,
  coupon: couponSlice,
  order: orderSlice,
  wishlist: wishlistSlice,
  transaction: transactionSlice,
  homeCategory: homeCategorySlice,
  home: homeSlice,
  customer: customerSlice,
  deal:dealSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;