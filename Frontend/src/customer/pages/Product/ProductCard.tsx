import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Favorite, FavoriteBorder, ModeComment } from "@mui/icons-material";
import { teal, red } from "@mui/material/colors";
import type { Product } from "../../../types/ProductTypes";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { addProductToWishlist } from "../../../State/customer/wishlistSlice";

interface ProductCardProps {
    item: Product;
}

const ProductCard = ({ item }: ProductCardProps) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { wishlist } = useAppSelector((store) => store.wishlist);

    // Check if current product is already in user's wishlist
    const isWishlisted = Boolean(
        wishlist?.products?.some((p) => p.id === item.id)
    );

    const handleWishlist = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (item.id) {
            dispatch(addProductToWishlist({ productId: item.id }));
        }
    };

    useEffect(() => {
        let interval: any = null;
        if (isHovered && item.images?.length) {
            interval = window.setInterval(() => {
                setCurrentImage((prevImage) => (prevImage + 1) % item.images.length);
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isHovered, item.images?.length]);

    return (
        <div
            onClick={() =>
                navigate(
                    `/product-details/${item.category?.categoryId || "item"}/${item.title}/${item.id}`
                )
            }
            className="group px-4 relative cursor-pointer"
        >
            <div
                className="card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {item.images?.map((itemImg, index) => (
                    <img
                        className="card-media object-top"
                        key={index}
                        src={itemImg}
                        alt=""
                        style={{
                            transform: `translateX(${(index - currentImage) * 100}%)`,
                        }}
                    />
                ))}

                {/* Permanent subtle top-right wishlist button for mobile / instant save */}
                <div className="absolute top-2 right-2 z-10 sm:hidden">
                    <IconButton
                        size="small"
                        onClick={handleWishlist}
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(4px)",
                            "&:hover": { bgcolor: "#fff" },
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        }}
                    >
                        {isWishlisted ? (
                            <Favorite sx={{ color: red[500], fontSize: 18 }} />
                        ) : (
                            <FavoriteBorder sx={{ color: "#555", fontSize: 18 }} />
                        )}
                    </IconButton>
                </div>

                {isHovered && (
                    <div className="indicator flex flex-col items-center space-y-2">
                        <div className="gap-3 flex">
                            <Tooltip
                                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                                arrow
                            >
                                <Button
                                    onClick={handleWishlist}
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        minWidth: "40px",
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        p: 0,
                                        bgcolor: isWishlisted ? "#ffebee" : "#fff",
                                        "&:hover": {
                                            bgcolor: isWishlisted ? "#ffcdd2" : "#f5f5f5",
                                            transform: "scale(1.08)",
                                        },
                                        transition: "all 0.2s ease-in-out",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                    }}
                                >
                                    {isWishlisted ? (
                                        <Favorite sx={{ color: red[500] }} />
                                    ) : (
                                        <FavoriteBorder sx={{ color: teal[600] }} />
                                    )}
                                </Button>
                            </Tooltip>

                            <Tooltip title="Comments" arrow>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(
                                            `/product-details/${item.category?.categoryId || "item"}/${item.title}/${item.id}`
                                        );
                                    }}
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        minWidth: "40px",
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        p: 0,
                                        bgcolor: "#fff",
                                        "&:hover": {
                                            bgcolor: "#f5f5f5",
                                            transform: "scale(1.08)",
                                        },
                                        transition: "all 0.2s ease-in-out",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                    }}
                                >
                                    <ModeComment sx={{ color: teal[600] }} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-1 group-hover-effect rounded-md details pt-3">
                <div className="name">
                    <h1 className="font-semibold text-gray-900 text-sm">
                        {item?.seller?.businessDetails?.businessName || "Brand"}
                    </h1>
                    <p className="text-gray-500 text-xs truncate">
                        {item?.title || "Product Title"}
                    </p>
                </div>

                <div className="price flex items-center gap-3 pt-1">
                    <span className="font-semibold text-gray-900 text-sm">
                        ₹{item?.sellingPrice}
                    </span>
                    <span className="line-through text-gray-400 text-xs">
                        ₹{item?.mrpPrice}
                    </span>
                    <span className="text-teal-700 font-bold text-xs">
                        {item?.discountPercent}% OFF
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;