import React from "react";
import { Divider } from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Orders from "./Orders";
import OrderDetails from "./OrderDetails";
import Profile from "./Profile";
import SavedCards from "./SavedCards";
import Addresses from "./Addresses";

const menu = [
    { name: "orders", path: "/account/orders" },
    { name: "profile", path: "/account/profile" },
    { name: "Saved Cards", path: "/account/saved-card" },
    { name: "Addresses", path: "/account/addresses" },
    { name: "Logout", path: "/" },
];

const Account: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (item: { name: string; path: string }) => {
        if (item.name === "Logout") {
            if (window.confirm("Are you sure you want to log out?")) {
                navigate("/");
            }
            return;
        }

        navigate(item.path);
    };

    return (
        <div className="px-5 lg:px-52 min-h-screen mt-8 pb-20">
            {/* Top User Header matching Screenshot 1 */}
            <div>
                <h1 className="text-xl font-bold pb-5 text-gray-900 tracking-tight">
                    Ashok
                </h1>
            </div>
            <Divider />

            {/* 2-Section Grid (Left & Right) matching Screenshot 1 & 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:min-h-[78vh]">
                {/* Left Section: Account Navigation List */}
                <section className="col-span-1 lg:border-r lg:pr-5 py-5 h-full space-y-1">
                    {menu.map((item) => {
                        const isActive =
                            location.pathname === item.path ||
                            (item.path === "/account/orders" &&
                                (location.pathname === "/account" ||
                                    location.pathname.startsWith("/account/order/")));

                        return (
                            <div
                                key={item.name}
                                onClick={() => handleClick(item)}
                                className={`${
                                    isActive
                                        ? "bg-[#008b77] text-white font-semibold"
                                        : "text-gray-700 hover:text-white hover:bg-[#008b77]"
                                } py-3 cursor-pointer px-5 rounded-md border-b border-gray-100 transition-all duration-150 flex items-center justify-between`}
                            >
                                <p className="capitalize text-sm tracking-wide">
                                    {item.name}
                                </p>
                            </div>
                        );
                    })}
                </section>

                {/* Right Section: Content Display via Routes */}
                <section className="right lg:col-span-2 lg:pl-6 py-5">
                    <Routes>
                        <Route path="/" element={<Profile />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/order/:orderId/:orderItemId" element={<OrderDetails />} />
                        <Route path="/addresses" element={<Addresses />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/saved-card" element={<SavedCards />} />
                    </Routes>
                </section>
            </div>
        </div>
    );
};

export default Account;