import React from "react";
import { Close, Remove } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, Divider, IconButton } from "@mui/material";
import type { CartItem } from "../../../types/cartTypes";
import { useAppDispatch } from "../../../State/Store";
import { deleteCartItem, updateCartItem } from "../../../State/customer/cartSlice";

interface CartItemCardProps {
    item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
    const dispatch = useAppDispatch();
    const jwt = localStorage.getItem("jwt") || "";

    const handleUpdateQuantity = (value: number) => {
        const newQuantity = item.quantity + value;
        if (newQuantity < 1) return;
        dispatch(
            updateCartItem({
                jwt,
                cartItemId: item.id,
                cartItem: { quantity: newQuantity },
            })
        );
    };

    const handleDeleteCartItem = () => {
        dispatch(
            deleteCartItem({
                jwt,
                cartItemId: item.id,
            })
        );
    };

    const discountPercent =
        item.mrpPrice > item.sellingPrice
            ? Math.round(((item.mrpPrice - item.sellingPrice) / item.mrpPrice) * 100)
            : 0;

    const sellerName =
        item.product?.seller?.businessDetails?.businessName ||
        item.product?.seller?.sellerName ||
        "Retail Partner";

    return (
        <div className="border border-gray-200 hover:border-gray-300 rounded-xl relative p-4 sm:p-5 bg-white shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-21.25 h-21.25 sm:w-23.75 sm:h-23.75 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <img
                        className="w-full h-full object-cover"
                        src={
                            item.product?.images?.[0] ||
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                        }
                        alt={item.product?.title || "Product"}
                    />
                </div>

                {/* Product Details */}
                <div className="space-y-1 flex-1 pr-6">
                    <h2 className="font-semibold text-base sm:text-lg text-gray-900 tracking-tight line-clamp-1">
                        {item.product?.title}
                    </h2>
                    <p className="text-gray-500 font-normal text-xs sm:text-sm line-clamp-1">
                        {item.product?.description}
                    </p>
                    <p className="text-gray-400 text-xs">
                        <strong>Sold by: </strong>
                        <span className="text-gray-600">{sellerName}</span>
                    </p>
                    {item.size && (
                        <p className="text-xs text-gray-600 font-medium">
                            <strong>Size: </strong>
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] font-semibold text-gray-700">
                                {item.size}
                            </span>
                        </p>
                    )}
                    <p className="text-[11px] text-teal-700 font-medium pt-0.5">
                        ✓ 7 days replacement available
                    </p>
                </div>
            </div>

            <Divider className="!my-3.5" />

            {/* Bottom Row: Quantity Controls & Price */}
            <div className="flex justify-between items-center">
                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5">
                    <Button
                        size="small"
                        variant="outlined"
                        sx={{
                            minWidth: 30,
                            width: 30,
                            height: 30,
                            p: 0,
                            borderColor: "#e5e7eb",
                            color: "#374151",
                            borderRadius: "6px",
                            "&:hover": {
                                borderColor: "#0d9488",
                                bgcolor: "#f0fdfa",
                            },
                        }}
                        onClick={() => handleUpdateQuantity(-1)}
                        disabled={item.quantity <= 1}
                    >
                        <Remove fontSize="small" sx={{ fontSize: 16 }} />
                    </Button>
                    <span className="px-3 font-semibold text-sm select-none text-gray-800">
                        {item.quantity}
                    </span>
                    <Button
                        size="small"
                        variant="outlined"
                        sx={{
                            minWidth: 30,
                            width: 30,
                            height: 30,
                            p: 0,
                            borderColor: "#e5e7eb",
                            color: "#374151",
                            borderRadius: "6px",
                            "&:hover": {
                                borderColor: "#0d9488",
                                bgcolor: "#f0fdfa",
                            },
                        }}
                        onClick={() => handleUpdateQuantity(1)}
                    >
                        <AddIcon fontSize="small" sx={{ fontSize: 16 }} />
                    </Button>
                </div>

                {/* Price Information */}
                <div className="flex items-center gap-2">
                    {item.mrpPrice > item.sellingPrice && (
                        <span className="line-through text-gray-400 text-xs sm:text-sm">
                            ₹{item.mrpPrice}
                        </span>
                    )}
                    <span className="font-bold text-base sm:text-lg text-teal-800">
                        ₹{item.sellingPrice}
                    </span>
                    {discountPercent > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            {discountPercent}% off
                        </span>
                    )}
                </div>
            </div>

            {/* Remove Item Button */}
            <div className="absolute top-2.5 right-2.5">
                <IconButton
                    size="small"
                    onClick={handleDeleteCartItem}
                    sx={{
                        color: "#9ca3af",
                        transition: "all 0.15s ease",
                        "&:hover": {
                            color: "#ef4444",
                            bgcolor: "#fee2e2",
                        },
                    }}
                    title="Remove item"
                >
                    <Close fontSize="small" sx={{ fontSize: 18 }} />
                </IconButton>
            </div>
        </div>
    );
};

export default CartItemCard;