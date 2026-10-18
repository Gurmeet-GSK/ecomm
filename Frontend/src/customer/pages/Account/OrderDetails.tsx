import React from "react";
import { Box, Button, Divider } from "@mui/material";
import {
    ArrowBack,
    LocationOnOutlined,
    PaymentOutlined,
    RateReviewOutlined,
} from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import { useNavigate, useParams } from "react-router-dom";
import OrderStepper from "./OrderStepper";
import { SAMPLE_ORDERS, type Order } from "./orderTypes";

interface OrderDetailsProps {
    order?: Order;
    onBack?: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
    order: propOrder,
    onBack,
}) => {
    const { orderId, orderItemId } = useParams<{ orderId?: string; orderItemId?: string }>();
    const navigate = useNavigate();

    // If order is passed via props, use it; otherwise find matching order from params or fallback to first order
    const order =
        propOrder ||
        SAMPLE_ORDERS.find(
            (o) =>
                o.orderId === orderId ||
                o.id === orderId ||
                o.orderItem.id === orderItemId
        ) ||
        SAMPLE_ORDERS[0];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate("/account/orders");
        }
    };
    const handleWriteReview = () => {
        alert(`Write review for: ${order.orderItem.product.title}`);
    };

    return (
        <Box className="space-y-6">
            {/* Top Navigation & Order Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleBack}
                        size="small"
                        startIcon={<ArrowBack fontSize="small" />}
                        sx={{
                            color: teal[700],
                            textTransform: "none",
                            fontWeight: 600,
                            px: 1,
                            "&:hover": { bgcolor: "rgba(13, 148, 136, 0.08)" },
                        }}
                    >
                        Back to Orders
                    </Button>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                            Order #{order.orderId}
                        </h2>
                        <p className="text-xs text-gray-500">
                            Placed on {order.orderDate}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">Total:</span>
                    <span className="text-base font-bold text-gray-900">
                        ₹{order.paymentDetails.total.toLocaleString("en-IN")}
                    </span>
                </div>
            </div>

            {/* Product Summary Card matching Screenshot 3 & 4 */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-xs">
                <section className="flex flex-col gap-4 justify-center items-center text-center">
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-white border border-gray-200/80 p-1 flex items-center justify-center shadow-xs">
                        <img
                            className="w-full h-full object-cover rounded-lg"
                            src={order.orderItem.product.images[0]}
                            alt={order.orderItem.product.title}
                        />
                    </div>

                    <div className="text-sm space-y-1.5 max-w-lg">
                        <h3 className="font-bold text-gray-900 text-base">
                            {order.orderItem.product.seller?.businessDetails.businessName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            {order.orderItem.product.title}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            <strong>Size: </strong>
                            <span className="uppercase">{order.orderItem.size}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <strong>Qty: </strong>
                            {order.orderItem.quantity}
                        </p>
                    </div>

                    <div className="pt-1">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleWriteReview}
                            startIcon={<RateReviewOutlined fontSize="small" />}
                            sx={{
                                color: teal[700],
                                borderColor: teal[600],
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                borderRadius: "8px",
                                textTransform: "uppercase",
                                px: 2.5,
                                py: 0.8,
                                letterSpacing: "0.04em",
                                "&:hover": {
                                    borderColor: teal[800],
                                    bgcolor: "rgba(13, 148, 136, 0.06)",
                                },
                            }}
                        >
                            Write Review
                        </Button>
                    </div>
                </section>
            </div>

            {/* Order Stepper Tracking Card matching Screenshot*/}
            <div className="border border-gray-200 rounded-xl p-5 sm:p-6 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm tracking-tight uppercase">
                        Order Status Tracking
                    </h3>
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                        {order.statusTitle}
                    </span>
                </div>

                <div className="pt-2">
                    <OrderStepper orderStatus={order.orderStatus} />
                </div>
            </div>

            {/* Delivery Address & Payment Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Shipping Address */}
                <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <LocationOnOutlined sx={{ fontSize: "16px", color: teal[600] }} />
                        <span>Delivery Address</span>
                    </div>
                    <Divider className="my-1.5!" />
                    <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}, {order.shippingAddress.locality}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                        <p className="text-gray-700 pt-1">
                            <strong>Mobile: </strong>{order.shippingAddress.mobile}
                        </p>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <PaymentOutlined sx={{ fontSize: "16px", color: teal[600] }} />
                        <span>Payment Details</span>
                    </div>
                    <Divider className="my-1.5!" />
                    <div className="text-xs text-gray-600 space-y-1.5">
                        <div className="flex justify-between">
                            <span>Payment Method</span>
                            <span className="font-semibold text-gray-800">{order.paymentDetails.method}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{order.paymentDetails.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-teal-700 font-medium">
                            <span>Discount</span>
                            <span>-₹{order.paymentDetails.discount}</span>
                        </div>
                        <Divider className="my-1!" />
                        <div className="flex justify-between font-bold text-gray-900 text-sm">
                            <span>Total Paid</span>
                            <span>₹{order.paymentDetails.total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default OrderDetails;