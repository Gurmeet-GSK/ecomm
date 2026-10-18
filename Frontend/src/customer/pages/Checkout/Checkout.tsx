import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import {
    CheckCircleOutlined,
} from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import AddressDetail from "./AddressDetail";
import type { Address } from "./AddressForm";

const Checkout: React.FC = () => {
    const [orderSuccessModal, setOrderSuccessModal] = useState(false);
    const [lastOrderDetails, setLastOrderDetails] = useState<{
        address: Address;
        gateway: string;
        orderId: string;
    } | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
        open: false,
        message: "",
    });

    const handleCheckoutSuccess = (orderData: { address: Address; gateway: string }) => {
        const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        setLastOrderDetails({
            ...orderData,
            orderId: generatedOrderId,
        });
        setOrderSuccessModal(true);
    };

    return (
        <div className="pt-6 pb-20 px-4 sm:px-8 lg:px-16 xl:px-32 min-h-screen bg-gray-50/40">
            {/* Top Checkout Progress Header */}
            <div className="max-w-7xl mx-auto mb-8">
                {/* Stepper Bar */}
                <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
                        <div className="flex items-center gap-1.5 text-teal-700">
                            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                                ✓
                            </span>
                            <span>Bag</span>
                        </div>
                        <div className="w-8 sm:w-16 h-0.5 bg-teal-600" />

                        <div className="flex items-center gap-1.5 text-teal-800">
                            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                                2
                            </span>
                            <span className="text-gray-900 font-bold">Address & Payment</span>
                        </div>
                        <div className="w-8 sm:w-16 h-0.5 bg-gray-200" />

                        <div className="flex items-center gap-1.5 text-gray-400">
                            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
                                3
                            </span>
                            <span>Confirmation</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                <AddressDetail onCheckoutSuccess={handleCheckoutSuccess} />
            </div>

            {/* Order Confirmation Modal */}
            <Dialog
                open={orderSuccessModal}
                onClose={() => setOrderSuccessModal(false)}
                maxWidth="xs"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "20px",
                            p: 3,
                            textAlign: "center",
                        },
                    },
                }}
            >
                <DialogContent sx={{ p: 0 }}>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center border-2 border-teal-200">
                            <CheckCircleOutlined sx={{ fontSize: "36px", color: teal[600] }} />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Order Placed Successfully!
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Order ID: <span className="font-semibold text-gray-800">{lastOrderDetails?.orderId}</span>
                            </p>
                        </div>

                        {lastOrderDetails && (
                            <div className="w-full bg-gray-50 rounded-xl p-3.5 text-left text-xs space-y-1.5 border border-gray-100">
                                <p className="text-gray-500">
                                    <strong className="text-gray-700">Delivering to: </strong>
                                    {lastOrderDetails.address.name} ({lastOrderDetails.address.city})
                                </p>
                                <p className="text-gray-500">
                                    <strong className="text-gray-700">Payment Method: </strong>
                                    {lastOrderDetails.gateway === "cod"
                                        ? "Pay on Delivery"
                                        : lastOrderDetails.gateway === "razorpay"
                                        ? "Razorpay (Online)"
                                        : lastOrderDetails.gateway === "stripe"
                                        ? "Stripe (Card)"
                                        : lastOrderDetails.gateway.toUpperCase()}
                                </p>
                                <p className="text-teal-700 font-semibold pt-1">
                                    Estimated Delivery: 2-3 Business Days
                                </p>
                            </div>
                        )}

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setOrderSuccessModal(false)}
                            sx={{
                                bgcolor: teal[600],
                                py: 1.2,
                                borderRadius: "10px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                "&:hover": { bgcolor: teal[800] },
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Notification Toast */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ open: false, message: "" })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ open: false, message: "" })}
                    severity="success"
                    variant="filled"
                    sx={{ bgcolor: teal[700], color: "#fff", borderRadius: "8px" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Checkout;
