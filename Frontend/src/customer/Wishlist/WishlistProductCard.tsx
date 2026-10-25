import React from "react";
import { Close } from "@mui/icons-material";
import { useAppDispatch } from "../../State/Store";
import { addProductToWishlist } from "../../State/customer/wishlistSlice";
import type { Product } from "../../types/ProductTypes";
import { useNavigate } from "react-router-dom";

interface WishlistProductCardProps {
    item: Product;
}

const WishlistProductCard: React.FC<WishlistProductCardProps> = ({ item }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleRemoveFromWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (item.id) {
            dispatch(addProductToWishlist({ productId: item.id }));
        }
    };

    return (
        <div
            onClick={() =>
                navigate(
                    `/product-details/${item.category?.categoryId || "item"}/${item.title}/${item.id}`
                )
            }
            className="w-60 relative cursor-pointer group"
        >
            <div className="w-full">
                <img
                    className="w-full object-top object-cover h-[300px] rounded"
                    src={item.images?.[0]}
                    alt={item.title}
                />
            </div>
            <div className="pt-3 space-y-1">
                <p className="font-semibold">{item.title}</p>
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">
                        ₹{item.sellingPrice}
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                        ₹{item.mrpPrice}
                    </span>
                    <span className="text-teal-600 font-semibold text-xs">
                        {item.discountPercent}% OFF
                    </span>
                </div>
            </div>
            <div className="absolute top-1 right-1">
                <button
                    onClick={handleRemoveFromWishlist}
                    className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-600 shadow"
                >
                    <Close fontSize="small" />
                </button>
            </div>
        </div>
    );
};

export default WishlistProductCard;
