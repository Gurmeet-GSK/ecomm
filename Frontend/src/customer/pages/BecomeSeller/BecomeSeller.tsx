import React, { useState } from "react";
import SellerAccountForm from "./SellerAccountForm";
import SellerLoginForm from "./SellerLoginForm";

const BecomeSeller: React.FC = () => {
    const [isLogin, setIsLogin] = useState(false); // Default to registration or login toggle

    return (
        <div className="grid md:gap-10 grid-cols-1 md:grid-cols-3 min-h-screen px-4 md:px-10 lg:px-20 py-8">
            {/* Left Form Section matching video: lg:col-span-1 md:col-span-2 col-span-3 p-6 sm:p-10 shadow-lg rounded-b-md md:border-r */}
            <section className="lg:col-span-1 md:col-span-2 col-span-3 p-6 sm:p-10 shadow-lg rounded-b-md border border-gray-100 bg-white h-fit">
                {!isLogin ? (
                    <SellerAccountForm onToggleLogin={() => setIsLogin(true)} />
                ) : (
                    <SellerLoginForm onToggleRegister={() => setIsLogin(false)} />
                )}
            </section>

            {/* Right Banner Section matching video: hidden md:col-span-1 lg:col-span-2 md:flex justify-center items-center */}
            <section className="hidden md:col-span-1 lg:col-span-2 md:flex flex-col justify-center items-center">
                <div className="lg:w-[70%] px-5 space-y-6 text-center">
                    <div className="space-y-2 font-bold text-center">
                        <p className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Join the Marketplace Revolution
                        </p>
                        <p className="text-lg lg:text-xl font-bold text-[#00897b]">
                            Boost your sales today
                        </p>
                    </div>

                    <div className="flex justify-center pt-4">
                        <img
                            src="https://zosh-bazzar-zosh.vercel.app/seller.jpg"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    "https://i.pinimg.com/736x/87/40/a4/8740a43dcbf4d48a12e2c4ea535a287c.jpg";
                            }}
                            alt="Marketplace illustration"
                            className="max-h-[460px] w-auto object-contain select-none"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BecomeSeller;