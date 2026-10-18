import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderItem from "./OrderItem";
import { SAMPLE_ORDERS, type Order } from "./orderTypes";

interface OrdersProps {
    onSelectOrder?: (order: Order) => void;
}

const Orders: React.FC<OrdersProps> = ({ onSelectOrder }) => {
    const navigate = useNavigate();
    const [orders] = useState<Order[]>(SAMPLE_ORDERS);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    const filteredOrders = orders.filter((order) => {
        if (filterStatus === "ALL") return true;
        if (filterStatus === "SHIPPED") return order.orderStatus === "SHIPPED" || order.orderStatus === "ARRIVING";
        if (filterStatus === "DELIVERED") return order.orderStatus === "DELIVERED";
        if (filterStatus === "CANCELLED") return order.orderStatus === "CANCELLED";
        return true;
    });

    const handleOrderClick = (order: Order) => {
        if (onSelectOrder) {
            onSelectOrder(order);
        } else {
            navigate(`/account/order/${order.orderId}/${order.orderItem.id}`);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header matching Screenshot 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                        All orders
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">from anytime</p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {["ALL", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                                filterStatus === status
                                    ? "bg-teal-600 text-white shadow-xs"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {status === "ALL" ? "All Orders" : status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-gray-500 text-sm">No orders found matching this filter.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <OrderItem
                            key={order.id}
                            order={order}
                            onClick={handleOrderClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;