import React, { useEffect } from 'react';
import './App.css';
import Navbar from "./customer/components/Navbar/Navbar"
import { ThemeProvider } from "@mui/material";
import customTheme from "./Theme/customTheme";
import { Routes, Route, useNavigate } from 'react-router-dom';
import Review from './customer/pages/Review/Review';
import Product from './customer/pages/Product/Product';
import Home from './customer/pages/Home/Home';
import Cart from './customer/pages/Cart/Cart';
import Checkout from './customer/pages/Checkout/Checkout';
import Account from './customer/pages/Account/Account';
import ProductDetails from './customer/pages/Product Details/ProductDetails';
import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
import AdminDashboard from './admin/Pages/Dashboard/Dashboard';
import SellerRoutes from './Routes/SellerRoutes';
import Auth from './customer/pages/Auth/Auth';
import { useAppDispatch, useAppSelector } from './State/Store';
import { fetchSellerProfile } from './State/seller/sellerSlice';
import { fetchUserProfile } from './State/AuthSlice';
import PaymentSuccess from './customer/pages/PaymentSucces';
import Wishlist from './customer/Wishlist/Wishlist';
import { homeCategories } from './data/HomeCategories';
import { createHomeCategories } from './State/customer/customerSlice';

function App() {

  const dispatch = useAppDispatch();
  const { seller, auth } = useAppSelector(store => store);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSellerProfile(localStorage.getItem("jwt") || ""));
    dispatch(createHomeCategories(homeCategories));
  }, [dispatch]);

  useEffect(() => {
    if (seller.profile) {
      navigate("/seller");
    }
  }, [seller.profile, navigate]);

  useEffect(() => {
    dispatch(fetchUserProfile({ jwt: auth.jwt || localStorage.getItem("jwt") || "" }));
  }, [auth.jwt, dispatch]);

  return (

    <ThemeProvider theme={customTheme}>
      <div className="p-0">
        <Navbar />
        {/* <Home/> */}
        {/* <Product/> */}
        {/* <ProductDetails/> */}
        {/* <Review/> */}
        {/* <Cart/> */}
        {/* <Checkout /> */}
        {/* <Account/> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          
          <Route path="/products/:category" element={<Product />} />
          <Route path="/reviews/producId" element={<Review />} />
          <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success/:orderId" element={<PaymentSuccess />} /> 
          <Route path="/account/*" element={<Account />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/seller/*" element={<SellerRoutes />} />
          <Route path="/admin/*" element={<AdminDashboard />} />


        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
