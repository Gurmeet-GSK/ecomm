import React, { useEffect } from "react";
import { Box, Button, Divider } from "@mui/material";
import { Payments } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchOrderById, fetchOrderItemById } from "../../../State/customer/orderSlice";
import OrderStepper from "./OrderStepper";

const OrderDetails = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { orderId, orderItemId } = useParams();
    const { currentOrder, orderItem } = useAppSelector((store) => store.order);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt") || "";
        if (orderId) {
            dispatch(fetchOrderById({ orderId: Number(orderId), jwt }));
        }
        if (orderItemId) {
            dispatch(fetchOrderItemById({ orderItemId: Number(orderItemId), jwt }));
        }
    }, [orderId, orderItemId, dispatch]);

    return (
        <Box className="space-y-5">
            <section className="flex flex-col gap-5 justify-center items-center">
                <img
                    className="w-[100px]"
                    src={orderItem?.product.images[0]}
                    alt=""
                />
                <div className="text-sm space-y-1 text-center">
                    <h1 className="font-bold">
                        {orderItem?.product.seller?.businessDetails.businessName}
                    </h1>
                    <p>{orderItem?.product.title}</p>
                    <p>
                        <strong>Size:</strong>
                        {orderItem?.size || "M"}
                    </p>
                </div>
                <div>
                    <Button
                        onClick={() => navigate(`/reviews/${orderItem?.product.id}/create`)}
                    >
                        Write Review
                    </Button>
                </div>
            </section>

            <section className="border p-5">
                <OrderStepper orderStatus={currentOrder?.orderStatus || "PENDING"} />
            </section>

            <div className="border p-5">
                <h1 className="font-bold pb-3">Delivery Address</h1>
                <div className="text-sm space-y-2">
                    <div className="flex gap-5 font-medium">
                        <p>{currentOrder?.shippingAddress?.name}</p>
                        <Divider flexItem orientation="vertical" />
                        <p>{currentOrder?.shippingAddress?.mobile}</p>
                    </div>
                    <p>
                        {currentOrder?.shippingAddress?.address},{" "}
                        {currentOrder?.shippingAddress?.locality},{" "}
                        {currentOrder?.shippingAddress?.city},{" "}
                        {currentOrder?.shippingAddress?.state} -{" "}
                        {currentOrder?.shippingAddress?.pinCode}
                    </p>
                </div>
            </div>

            <div className="border space-y-4">
                <div className="flex justify-between text-sm pt-5 px-5">
                    <div className="space-y-1">
                        <p className="font-bold">Total Item Price</p>
                        <p>
                            You saved{" "}
                            <span className="text-green-500 font-medium text-xs">
                                ₹
                                {(
                                    (orderItem?.mrpPrice || 0) -
                                    (orderItem?.sellingPrice || 0)
                                ).toFixed(2)}
                            </span>{" "}
                            on this item
                        </p>
                    </div>
                    <p className="font-medium">₹{orderItem?.sellingPrice}.00</p>
                </div>

                <div className="px-5">
                    <div className="bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3">
                        <Payments />
                        <p>Pay On Delivery</p>
                    </div>
                </div>

                <Divider />
                <div className="px-5 pb-5">
                    <p className="text-xs text-gray-500">
                        <strong>Payment Status:</strong>{" "}
                        {currentOrder?.paymentDetails?.status || "PENDING"}
                    </p>
                </div>
            </div>
        </Box>
    );
};

export default OrderDetails;