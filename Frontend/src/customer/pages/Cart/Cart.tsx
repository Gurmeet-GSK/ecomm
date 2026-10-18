import { CheckCircleOutlined, Close, LocalOffer } from "@mui/icons-material";
import CartItem from "./CartItem"
import PricingCard from "./PricingCard"
import { teal } from "@mui/material/colors";
import { Alert, Button, IconButton, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "info" | "error">("success");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Automatically convert any lowercase text to uppercase
        setCouponCode(e.target.value.toUpperCase());
    }

    const handleApplyCoupon = () => {
        const trimmed = couponCode.trim().toUpperCase();
        if (trimmed) {
            setAppliedCoupon(trimmed);
            setCouponCode("");
            setSnackbarMessage(`Coupon "${trimmed}" applied successfully!`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        }
    }

    const handleRemoveCoupon = () => {
        const removed = appliedCoupon;
        setAppliedCoupon(null);
        setSnackbarMessage(removed ? `Coupon "${removed}" removed` : "Coupon removed");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
    }

    const handleCloseSnackbar = (
        _event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    }

    return (
        <div className="pt-10 px-4 sm:px-8 lg:px-16 xl:px-32 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="cartItemSection lg:col-span-2 space-y-4">
                    {[1, 1, 1, 1].map((_item, index) => <CartItem key={index} />)}
                </div>

                <div className="col-span-1 space-y-4 h-fit">
                    {/* Coupon Section */}
                    <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-white shadow-xs">
                        <div className="flex gap-2 text-sm items-center">
                            <LocalOffer sx={{ color: teal[600], fontSize: "18px" }} />
                            <span className="font-semibold text-gray-800 tracking-tight">Apply Coupons</span>
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
                                    id="outlined-basic"
                                    placeholder="COUPON CODE"
                                    size="small"
                                    variant="outlined"
                                    className="flex-1"
                                    slotProps={{
                                        htmlInput: {
                                            style: {
                                                textTransform: "uppercase",
                                                fontWeight: 500,
                                                letterSpacing: "0.04em",
                                            }
                                        }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            '&.Mui-focused fieldset': {
                                                borderColor: teal[600],
                                            }
                                        }
                                    }}
                                />
                                <Button 
                                    size="small"
                                    variant="contained"
                                    onClick={handleApplyCoupon}
                                    sx={{
                                        bgcolor: teal[600],
                                        color: '#fff',
                                        fontWeight: 600,
                                        px: 2.5,
                                        height: '40px',
                                        borderRadius: '8px',
                                        boxShadow: 'none',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04em',
                                        '&:hover': {
                                            bgcolor: teal[800],
                                            boxShadow: 'none'
                                        }
                                    }}
                                >
                                    Apply
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between px-4 py-2.5 border border-teal-300 bg-teal-50/70 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <CheckCircleOutlined sx={{ color: teal[700], fontSize: "18px" }} />
                                    <span className="text-sm font-semibold text-teal-900 tracking-wide">
                                        {appliedCoupon} <span className="text-teal-700 font-medium">Applied</span>
                                    </span>
                                </div>
                                <IconButton 
                                    size="small" 
                                    onClick={handleRemoveCoupon}
                                    sx={{ 
                                        color: '#dc2626',
                                        padding: '4px',
                                        '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.08)' }
                                    }}
                                    title="Remove coupon"
                                >
                                    <Close fontSize="small" />
                                </IconButton>
                            </div>
                        )}
                    </div>

                    {/* Pricing Card Section */}
                    <PricingCard 
                        appliedCoupon={appliedCoupon} 
                        onBuyNow={() => navigate("/checkout")} 
                    />
                </div>
            </div>

            {/* Bottom-Right Popup Notification */}
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
                        width: '100%',
                        borderRadius: '10px',
                        fontWeight: 500,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        bgcolor: snackbarSeverity === 'success' ? teal[700] : undefined,
                        color: '#fff',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Cart;