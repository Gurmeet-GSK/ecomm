import React from "react";
import SellerDrawerList from "../seller/components/SellerDrawerList/SellerDrawerList";
import Products from "../seller/pages/Products/Products";
import AddProduct from "../seller/pages/Products/AddProduct";
import Profile from "../seller/pages/Account/Profile";
import Payment from "../seller/pages/Payment/Payment";
import Transaction from "../seller/pages/Payment/Transaction";
import Orders from "../seller/pages/Orders/Orders";
import Dashboard from "../seller/pages/SellerDashboard/Dashboard";
import { Routes, Route } from "react-router-dom";

const SellerRoutes: React.FC = () => {
    const toggleDrawer = () => {};

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="lg:flex min-h-[calc(100vh-64px)]">
                {/* Left Sidebar / SellerDrawerList */}
                <section className="hidden lg:block h-full bg-white border-r">
                    <SellerDrawerList toggleDrawer={toggleDrawer} />
                </section>

                {/* Main Content Area */}
                <main className="p-6 md:p-8 w-full lg:w-[calc(100%-300px)] overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/transaction" element={<Transaction />} />
                        <Route path="/account" element={<Profile />} />
                        <Route path="/*" element={<Dashboard />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default SellerRoutes;