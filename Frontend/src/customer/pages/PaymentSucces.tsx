import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAppDispatch } from "../../State/Store";
import { paymentSuccess } from "../../State/customer/orderSlice";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const paymentId = query.get("razorpay_payment_id");
        const paymentLinkId = query.get("razorpay_payment_link_id");
        if (paymentId) {
            dispatch(
                paymentSuccess({
                    jwt: localStorage.getItem("jwt") || "",
                    paymentId,
                    paymentLinkId: paymentLinkId || "",
                })
            );
        }
    }, [location.search, dispatch]);
    return (
        <div className="min-h-[80vh] flex justify-center items-center px-4">
            <div className="bg-primary-color text-white p-8 w-full max-w-md border rounded-xl shadow-lg flex flex-col gap-5 items-center justify-center text-center">
                <h1 className="text-3xl font-bold">Congratulations!</h1>
                <p className="text-lg opacity-90">Your order has been placed successfully.</p>

                <div className="flex gap-3">
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => navigate("/")}
                    >
                        Shop More
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ color: "#fff", borderColor: "#fff" }}
                        onClick={() => navigate("/account/orders")}
                    >
                        View Orders
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
