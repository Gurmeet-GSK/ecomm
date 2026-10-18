import { FlashOn, CancelOutlined, ChevronRight, CheckCircle } from "@mui/icons-material";
import type { Order } from "./orderTypes";

interface OrderItemProps {
    order: Order;
    onClick: (order: Order) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onClick }) => {
    const isCancelled = order.orderStatus === "CANCELLED";
    const isDelivered = order.orderStatus === "DELIVERED";

    let badgeBg = "bg-teal-600";
    let textColor = "text-teal-700";

    if (isCancelled) {
        badgeBg = "bg-red-500";
        textColor = "text-red-600";
    } else if (isDelivered) {
        badgeBg = "bg-teal-600";
        textColor = "text-teal-800";
    }

    return (
        <div
            onClick={() => onClick(order)}
            className="border border-gray-200 rounded-xl p-4 sm:p-5 bg-white shadow-xs hover:border-teal-400 hover:shadow-sm transition-all duration-200 cursor-pointer space-y-3.5 group"
        >
            {/* Top Status Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Circle Icon Badge */}
                    <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xs ${badgeBg}`}
                    >
                        {isCancelled ? (
                            <CancelOutlined sx={{ fontSize: "17px" }} />
                        ) : isDelivered ? (
                            <CheckCircle sx={{ fontSize: "17px" }} />
                        ) : (
                            <FlashOn sx={{ fontSize: "17px" }} />
                        )}
                    </div>

                    <div>
                        <span
                            className={`text-xs font-bold tracking-wider uppercase block ${textColor}`}
                        >
                            {order.statusTitle}
                        </span>
                        <span className="text-xs text-gray-500 font-normal">
                            {order.statusDate}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-teal-700 transition-colors">
                    <span className="hidden sm:inline">View Details</span>
                    <ChevronRight fontSize="small" />
                </div>
            </div>

            {/* Product Item Box with soft tint matching reference */}
            <div className="bg-teal-50/30 border border-teal-100/60 rounded-xl p-3 sm:p-4 flex gap-4 items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200/60 flex items-center justify-center">
                    <img
                        src={order.orderItem.product.images[0]}
                        alt={order.orderItem.product.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base tracking-tight">
                        {order.orderItem.product.seller.businessDetails.businessName}
                    </h4>

                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {order.orderItem.product.title}
                    </p>

                    <div className="flex items-center gap-3 pt-0.5">
                        <span className="text-xs text-gray-500 font-medium">
                            size :{" "}
                            <strong className="text-gray-800 uppercase font-semibold">
                                {order.orderItem.size}
                            </strong>
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs font-bold text-gray-900">
                            ₹{order.orderItem.price.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;