import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import {
    AutorenewOutlined,
    Favorite,
    FavoriteBorder,
    InfoOutlined,
    KeyboardArrowRight,
    LocalShippingOutlined,
    LockOutlined,
    VerifiedUserOutlined,
} from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

interface PricingCardProps {
    subtotal?: number;
    discount?: number;
    shippingFee?: number;
    platformFee?: number;
    appliedCoupon?: string | null;
    couponDiscount?: number;
    itemCount?: number;
    buttonText?: string;
    showWishlistCard?: boolean;
    showTrustBadges?: boolean;
    onBuyNow?: () => void;
    onWishlistClick?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
    subtotal = 1399,
    discount = 600,
    shippingFee = 0, // Free delivery
    platformFee = 0, // Free platform fee
    appliedCoupon = null,
    couponDiscount = 100,
    itemCount = 4,
    buttonText = "Buy Now",
    showWishlistCard = true,
    showTrustBadges = true,
    onBuyNow,
    onWishlistClick,
}) => {
    const navigate = useNavigate();
    const [isWishlistLiked, setIsWishlistLiked] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate actual total
    const effectiveCouponDiscount = appliedCoupon ? couponDiscount : 0;
    const totalAmount = Math.max(0, subtotal - discount - effectiveCouponDiscount + shippingFee + platformFee);
    const totalSavings = discount + effectiveCouponDiscount + (shippingFee === 0 ? 79 : 0) + (platformFee === 0 ? 20 : 0);

    const handleBuyNow = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            if (onBuyNow) {
                onBuyNow();
            } else {
                navigate("/checkout");
            }
        }, 400);
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsWishlistLiked(!isWishlistLiked);
        if (onWishlistClick) {
            onWishlistClick();
        }
    };

    return (
        <div className="space-y-3.5">
            {/* Main Price Details Card */}
            <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-xs space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Price Details
                    </span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {itemCount} {itemCount === 1 ? "Item" : "Items"}
                    </span>
                </div>

                {/* Free Delivery Perk Bar */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-50/70 border border-teal-200/50 text-xs text-teal-800">
                    <LocalShippingOutlined sx={{ fontSize: "18px", color: teal[700] }} />
                    <span className="font-medium">
                        Yay! You unlocked <strong>FREE Standard Delivery</strong>
                    </span>
                </div>

                {/* Line Items */}
                <div className="space-y-3 text-sm text-gray-600">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-800">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>

                    {/* Discount */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Discount</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                                -{Math.round((discount / subtotal) * 100)}%
                            </span>
                            <span className="font-semibold text-teal-700">
                                -₹{discount.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* Coupon Discount (if applied) */}
                    {appliedCoupon && (
                        <div className="flex justify-between items-center animate-fadeIn">
                            <div className="flex items-center gap-1 text-teal-800">
                                <span>Coupon ({appliedCoupon})</span>
                            </div>
                            <span className="font-semibold text-teal-700">
                                -₹{couponDiscount.toLocaleString("en-IN")}
                            </span>
                        </div>
                    )}

                    {/* Shipping */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                            <span>Shipping</span>
                            <Tooltip title="Free shipping on orders above ₹499" arrow>
                                <InfoOutlined sx={{ fontSize: "14px", color: "#9ca3af", cursor: "pointer" }} />
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="line-through text-gray-400 text-xs">₹79</span>
                            <span className="text-teal-700 font-semibold text-xs tracking-wide uppercase bg-teal-50 px-2 py-0.5 rounded border border-teal-200/40">
                                Free
                            </span>
                        </div>
                    </div>

                    {/* Platform Fee */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                            <span>Platform Fee</span>
                            <Tooltip title="Charged for order processing and platform maintenance" arrow>
                                <InfoOutlined sx={{ fontSize: "14px", color: "#9ca3af", cursor: "pointer" }} />
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="line-through text-gray-400 text-xs">₹20</span>
                            <span className="text-teal-700 font-semibold text-xs tracking-wide uppercase bg-teal-50 px-2 py-0.5 rounded border border-teal-200/40">
                                Free
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-200" />

                {/* Total */}
                <div className="flex justify-between items-baseline">
                    <div>
                        <span className="font-bold text-gray-800 text-base">Total</span>
                        <p className="text-[11px] text-gray-400 font-normal">Inclusive of all taxes</p>
                    </div>
                    <span className="font-extrabold text-xl text-gray-900 tracking-tight">
                        ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                </div>

                {/* Total Savings Pill */}
                {totalSavings > 0 && (
                    <div className="text-xs font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 rounded-lg p-2.5 text-center flex items-center justify-center gap-1.5">
                        <span>✨</span>
                        <span>You will save <strong>₹{totalSavings.toLocaleString("en-IN")}</strong> on this order</span>
                    </div>
                )}

                {/* Buy Now CTA */}
                <Button
                    variant="contained"
                    fullWidth
                    disabled={isProcessing}
                    onClick={handleBuyNow}
                    endIcon={<KeyboardArrowRight sx={{ fontSize: "20px !important" }} />}
                    sx={{
                        bgcolor: teal[600],
                        color: "#fff",
                        py: 1.4,
                        borderRadius: "10px",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        boxShadow: "0 4px 14px rgba(13, 148, 136, 0.3)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                            bgcolor: teal[800],
                            boxShadow: "0 6px 20px rgba(13, 148, 136, 0.4)",
                            transform: "translateY(-1px)",
                        },
                        "&:active": {
                            transform: "translateY(0)",
                        },
                    }}
                >
                    {isProcessing ? "Processing..." : buttonText}
                </Button>
            </div>

            {/* Add From Wishlist Card */}
            {showWishlistCard && (
                <div
                    onClick={handleWishlistToggle}
                    className="border border-gray-200 hover:border-teal-400 rounded-xl p-4 bg-white shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-between group"
                >
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-teal-900 transition-colors">
                            Add From Wishlist
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                            Explore items saved for later
                        </span>
                    </div>

                    <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-teal-50/70 group-hover:bg-teal-100 transition-colors"
                        title={isWishlistLiked ? "Saved in wishlist" : "Add to wishlist"}
                    >
                        {isWishlistLiked ? (
                            <Favorite sx={{ color: teal[600], fontSize: "20px" }} />
                        ) : (
                            <FavoriteBorder sx={{ color: teal[600], fontSize: "20px" }} />
                        )}
                    </div>
                </div>
            )}

            {/* Trust Badges */}
            {showTrustBadges && (
                <div className="grid grid-cols-3 gap-2 py-2 px-1 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-1">
                        <VerifiedUserOutlined sx={{ fontSize: "20px", color: teal[600] }} />
                        <span className="text-[10px] font-medium leading-tight text-gray-600">
                            100% Genuine
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-x border-gray-200">
                        <AutorenewOutlined sx={{ fontSize: "20px", color: teal[600] }} />
                        <span className="text-[10px] font-medium leading-tight text-gray-600">
                            7-Day Returns
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <LockOutlined sx={{ fontSize: "20px", color: teal[600] }} />
                        <span className="text-[10px] font-medium leading-tight text-gray-600">
                            Secure Payments
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingCard;