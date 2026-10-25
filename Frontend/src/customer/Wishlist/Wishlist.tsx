import React, { useEffect } from "react";
import WishlistProductCard from "./WishlistProductCard";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { getWishlistByUserId } from "../../State/customer/wishlistSlice";
import { Button } from "@mui/material";
import { FavoriteBorderOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { wishlist } = useAppSelector((store) => store);

    useEffect(() => {
        dispatch(getWishlistByUserId());
    }, [dispatch]);

    const products = wishlist.wishlist?.products || [];
    const count = products.length;

    return (
        <div className="min-h-[85vh] px-4 sm:px-8 lg:px-20 py-8 bg-gray-50/40">
            <section className="max-w-7xl mx-auto space-y-6">
                {/* Header with Title & Count */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            My Wishlist
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {count} {count === 1 ? "item" : "items"} saved for later
                        </p>
                    </div>

                    {count > 0 && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate("/")}
                            sx={{
                                color: teal[700],
                                borderColor: teal[600],
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "0.8rem",
                                borderRadius: "8px",
                                "&:hover": {
                                    borderColor: teal[800],
                                    bgcolor: "rgba(13, 148, 136, 0.05)",
                                },
                            }}
                        >
                            Continue Shopping
                        </Button>
                    )}
                </div>

                {/* Empty State vs Products Grid */}
                {count > 0 ? (
                    <div className="flex flex-wrap gap-6 pt-2">
                        {products.map((item) => (
                            <WishlistProductCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-2xl border border-gray-100 p-8 shadow-xs">
                        <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                            <FavoriteBorderOutlined sx={{ fontSize: 42 }} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-gray-900">
                                Your wishlist is empty
                            </h3>
                            <p className="text-xs text-gray-500 max-w-sm">
                                Explore more items and shortlist your favorite pieces to shop them anytime!
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate("/")}
                            variant="contained"
                            startIcon={<ShoppingBagOutlined />}
                            sx={{
                                bgcolor: teal[600],
                                color: "#fff",
                                px: 4,
                                py: 1.2,
                                borderRadius: "10px",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                                "&:hover": { bgcolor: teal[800] },
                            }}
                        >
                            Start Exploring
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Wishlist;