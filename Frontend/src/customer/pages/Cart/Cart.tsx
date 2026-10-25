import React, { useEffect, useState } from "react";
import { CheckCircleOutlined, Close, LocalOffer, ShoppingBagOutlined } from "@mui/icons-material";
import CartItemCard from "./CartItemCard";
import PricingCard from "./PricingCard";
import { teal } from "@mui/material/colors";
import { Alert, Button, CircularProgress, IconButton, Snackbar, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchUserCart } from "../../../State/customer/cartSlice";
import { applyCoupon } from "../../../State/customer/couponSlice";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector((store) => store.cart);

    const [couponCode, setCouponCode] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "info" | "error">("success");

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            dispatch(fetchUserCart(token));
        }
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCouponCode(e.target.value.toUpperCase());
    };

    const handleApplyCoupon = () => {
        const trimmed = couponCode.trim().toUpperCase();
        if (!trimmed) return;

        const jwt = localStorage.getItem("jwt") || "";
        if (!jwt) {
            setSnackbarMessage("Please log in to apply a coupon");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        setIsApplyingCoupon(true);
        dispatch(
            applyCoupon({
                apply: "true",
                code: trimmed,
                orderValue: cart?.totalSellingPrice || 0,
                jwt,
            })
        )
            .then((resultAction) => {
                setIsApplyingCoupon(false);
                if (applyCoupon.fulfilled.match(resultAction)) {
                    setCouponCode("");
                    setSnackbarMessage(`Coupon "${trimmed}" applied successfully!`);
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    // Refresh cart to ensure consistency
                    dispatch(fetchUserCart(jwt));
                } else {
                    setSnackbarMessage(
                        (resultAction.payload as string) || "Invalid coupon code or criteria not met"
                    );
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                }
            })
            .catch(() => {
                setIsApplyingCoupon(false);
                setSnackbarMessage("Failed to apply coupon");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

    const handleRemoveCoupon = () => {
        const jwt = localStorage.getItem("jwt") || "";
        const codeToRemove = cart?.couponCode || "";
        if (!codeToRemove) return;

        setIsApplyingCoupon(true);
        dispatch(
            applyCoupon({
                apply: "false",
                code: codeToRemove,
                orderValue: cart?.totalSellingPrice || 0,
                jwt,
            })
        )
            .then((resultAction) => {
                setIsApplyingCoupon(false);
                if (applyCoupon.fulfilled.match(resultAction)) {
                    setSnackbarMessage(`Coupon "${codeToRemove}" removed`);
                    setSnackbarSeverity("info");
                    setSnackbarOpen(true);
                    dispatch(fetchUserCart(jwt));
                } else {
                    setSnackbarMessage(
                        (resultAction.payload as string) || "Failed to remove coupon"
                    );
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                }
            })
            .catch(() => {
                setIsApplyingCoupon(false);
                setSnackbarMessage("Failed to remove coupon");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

    const handleCloseSnackbar = (
        _event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };

    const hasItems = cart && cart.cartItems && cart.cartItems.length > 0;
    const appliedCoupon = cart?.couponCode || null;

    return (
        <div className="pt-8 pb-16 px-4 sm:px-8 lg:px-16 xl:px-32 min-h-screen bg-gray-50/50">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Shopping Bag</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {hasItems
                        ? `You have ${cart?.cartItems?.length} unique ${
                              cart?.cartItems?.length === 1 ? "product" : "products"
                          } in your bag`
                        : "Review your selected items and proceed to checkout"}
                </p>
            </div>

            {loading && !cart ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
                    <CircularProgress sx={{ color: teal[600] }} />
                    <span className="text-sm font-medium text-gray-500">Loading your cart...</span>
                </div>
            ) : !hasItems ? (
                /* Empty Cart State */
                <div className="border border-dashed border-gray-300 rounded-2xl bg-white p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xs">
                    <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto text-teal-700">
                        <ShoppingBagOutlined sx={{ fontSize: 36 }} />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-900">Your bag is empty</h2>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                            Looks like you haven't added anything to your cart yet. Explore our top
                            categories and find something you love!
                        </p>
                    </div>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/")}
                        sx={{
                            bgcolor: teal[600],
                            color: "#fff",
                            fontWeight: 600,
                            px: 4,
                            py: 1.2,
                            borderRadius: "10px",
                            boxShadow: "0 4px 14px rgba(13, 148, 136, 0.3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            fontSize: "0.85rem",
                            "&:hover": {
                                bgcolor: teal[800],
                            },
                        }}
                    >
                        Explore Products
                    </Button>
                </div>
            ) : (
                /* Cart Grid */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Cart Items List */}
                    <div className="cartItemSection lg:col-span-2 space-y-3.5">
                        {cart?.cartItems?.map((item) => (
                            <CartItemCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Right Sticky Sidebar */}
                    <div className="col-span-1 space-y-4 lg:sticky lg:top-24">
                        {/* Coupon Section */}
                        <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-white shadow-xs">
                            <div className="flex gap-2 text-sm items-center">
                                <LocalOffer sx={{ color: teal[600], fontSize: "18px" }} />
                                <span className="font-semibold text-gray-800 tracking-tight">
                                    Coupons & Offers
                                </span>
                            </div>

                            {!appliedCoupon ? (
                                <div className="flex gap-2 items-center">
                                    <TextField
                                        value={couponCode}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleApplyCoupon();
                                            }
                                        }}
                                        id="coupon-input"
                                        placeholder="ENTER CODE"
                                        size="small"
                                        variant="outlined"
                                        disabled={isApplyingCoupon}
                                        className="flex-1"
                                        slotProps={{
                                            htmlInput: {
                                                style: {
                                                    textTransform: "uppercase",
                                                    fontWeight: 600,
                                                    letterSpacing: "0.06em",
                                                    fontSize: "0.85rem",
                                                },
                                            },
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "8px",
                                                "&.Mui-focused fieldset": {
                                                    borderColor: teal[600],
                                                },
                                            },
                                        }}
                                    />
                                    <Button
                                        size="small"
                                        variant="contained"
                                        disabled={!couponCode.trim() || isApplyingCoupon}
                                        onClick={handleApplyCoupon}
                                        sx={{
                                            bgcolor: teal[600],
                                            color: "#fff",
                                            fontWeight: 600,
                                            px: 2.5,
                                            height: "40px",
                                            borderRadius: "8px",
                                            boxShadow: "none",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.04em",
                                            "&:hover": {
                                                bgcolor: teal[800],
                                                boxShadow: "none",
                                            },
                                        }}
                                    >
                                        {isApplyingCoupon ? "..." : "Apply"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between px-4 py-2.5 border border-teal-300 bg-teal-50/70 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <CheckCircleOutlined sx={{ color: teal[700], fontSize: "18px" }} />
                                        <span className="text-sm font-semibold text-teal-900 tracking-wide">
                                            {appliedCoupon}{" "}
                                            <span className="text-teal-700 font-medium text-xs">
                                                Applied
                                            </span>
                                        </span>
                                    </div>
                                    <IconButton
                                        size="small"
                                        onClick={handleRemoveCoupon}
                                        disabled={isApplyingCoupon}
                                        sx={{
                                            color: "#dc2626",
                                            padding: "4px",
                                            "&:hover": { bgcolor: "rgba(220, 38, 38, 0.08)" },
                                        }}
                                        title="Remove coupon"
                                    >
                                        <Close fontSize="small" sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </div>
                            )}
                        </div>

                        {/* Pricing Card Section */}
                        <PricingCard
                            subtotal={cart?.totalMrpPrice || 0}
                            discount={
                                (cart?.totalMrpPrice || 0) - (cart?.totalSellingPrice || 0)
                            }
                            couponDiscount={cart?.discount || 0}
                            appliedCoupon={appliedCoupon}
                            itemCount={cart?.totalItem || cart?.cartItems?.length || 0}
                            onBuyNow={() => navigate("/checkout")}
                        />
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3500}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{
                        width: "100%",
                        borderRadius: "10px",
                        fontWeight: 500,
                        boxShadow:
                            "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                        bgcolor: snackbarSeverity === "success" ? teal[700] : undefined,
                        color: "#fff",
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Cart;