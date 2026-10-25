import React, { useEffect } from "react";
import OrderItemCard from "./OrderItemCard";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchUserOrderHistory } from "../../../State/customer/orderSlice";

const Orders = () => {
    const dispatch = useAppDispatch();
    const { orders, loading } = useAppSelector((store) => store.order);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            dispatch(fetchUserOrderHistory(jwt));
        }
    }, [dispatch]);

    return (
        <div className="text-sm min-h-screen">
            <div className="pb-5">
                <h1 className="font-semibold text-lg">All orders</h1>
                <p className="text-gray-500">from anytime</p>
            </div>

            {loading ? (
                <div className="py-12 flex justify-center items-center text-gray-500">
                    Loading your orders...
                </div>
            ) : orders && orders.length > 0 ? (
                <div className="space-y-2">
                    {orders.map((order) =>
                        order.orderItems?.map((item) => (
                            <OrderItemCard key={item.id} item={item} order={order} />
                        ))
                    )}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg p-8">
                    <p className="text-base font-medium">No orders found</p>
                    <p className="text-xs text-gray-400 mt-1">You haven't placed any orders yet.</p>
                </div>
            )}
        </div>
    );
};

export default Orders;