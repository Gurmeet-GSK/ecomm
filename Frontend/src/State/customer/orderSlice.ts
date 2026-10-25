import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Order, OrderItem, OrderState } from "../../types/orderTypes";
import type { Address } from "../../types/userTypes";
import { api } from "../../config/Api";

const initialState: OrderState = {
    orders: [],
    orderItem: null,
    currentOrder: null,
    paymentOrder: null,
    loading: false,
    error: null,
    orderCanceled: false,
};

const API_URL = "/api/orders";

// Fetch user order history
export const fetchUserOrderHistory = createAsyncThunk<Order[], string>(
    "orders/fetchUserOrderHistory",
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/user`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            console.log("order history fetched ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue(
                error.response?.data?.error || "Failed to fetch order history"
            );
        }
    }
);

// Fetch order by id
export const fetchOrderById = createAsyncThunk<
    Order,
    { orderId: number; jwt: string }
>(
    "orders/fetchOrderById",
    async ({ orderId, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/${orderId}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            console.log("order fetched by id ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue(
                error.response?.data?.error || "Failed to fetch order"
            );
        }
    }
);

// Create order
export const createOrder = createAsyncThunk<
    any,
    { address: Address; jwt: string; paymentGateway: string }
>(
    "orders/createOrder",
    async ({ address, jwt, paymentGateway }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                API_URL,
                address,
                {
                    params: { paymentMethod: paymentGateway },
                    headers: { Authorization: `Bearer ${jwt}` },
                }
            );
            console.log("order created ", response.data);
            if (response.data.payment_link_url) {
                window.location.href = response.data.payment_link_url;
            }
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue(
                error.response?.data?.error || "Failed to create order"
            );
        }
    }
);

// Fetch order item by id
export const fetchOrderItemById = createAsyncThunk<
    OrderItem,
    { orderItemId: number; jwt: string }
>(
    "orders/fetchOrderItemById",
    async ({ orderItemId, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/item/${orderItemId}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            console.log("order item fetched ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue(
                error.response?.data?.error || "Failed to fetch order item"
            );
        }
    }
);

// Cancel order
export const cancelOrder = createAsyncThunk<
    Order,
    { orderId: number; jwt: string }
>(
    "orders/cancelOrder",
    async ({ orderId, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                `${API_URL}/${orderId}/cancel`,
                {},
                {
                    headers: { Authorization: `Bearer ${jwt}` },
                }
            );
            console.log("order canceled ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue(
                error.response?.data?.error || "Failed to cancel order"
            );
        }
    }
);

// Payment success handler
export const paymentSuccess = createAsyncThunk<
    any,
    { paymentId: string; jwt: string; paymentLinkId: string },
    { rejectValue: string }
>(
    "orders/paymentSuccess",
    async ({ paymentId, jwt, paymentLinkId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/payment/${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                params: { paymentLinkId },
            });

            console.log("payment success ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to process payment success"
            );
        }
    }
);

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.orderItem = null;
            state.currentOrder = null;
            state.paymentOrder = null;
            state.loading = false;
            state.error = null;
            state.orderCanceled = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchUserOrderHistory
            .addCase(fetchUserOrderHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.orderCanceled = false;
            })
            .addCase(
                fetchUserOrderHistory.fulfilled,
                (state, action: PayloadAction<Order[]>) => {
                    state.loading = false;
                    state.orders = action.payload;
                }
            )
            .addCase(fetchUserOrderHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch order history";
            })

            // fetchOrderById
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchOrderById.fulfilled,
                (state, action: PayloadAction<Order>) => {
                    state.loading = false;
                    state.currentOrder = action.payload;
                }
            )
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch order";
            })

            // createOrder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.paymentOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to create order";
            })

            // fetchOrderItemById
            .addCase(fetchOrderItemById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchOrderItemById.fulfilled,
                (state, action: PayloadAction<OrderItem>) => {
                    state.loading = false;
                    state.orderItem = action.payload;
                }
            )
            .addCase(fetchOrderItemById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch order item";
            })

            // cancelOrder
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.orderCanceled = false;
            })
            .addCase(
                cancelOrder.fulfilled,
                (state, action: PayloadAction<Order>) => {
                    state.loading = false;
                    state.orders = state.orders.map((order) =>
                        order.id === action.payload.id ? action.payload : order
                    );
                    state.currentOrder = action.payload;
                    state.orderCanceled = true;
                }
            )
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to cancel order";
                state.orderCanceled = false;
            })

            // paymentSuccess
            .addCase(paymentSuccess.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(paymentSuccess.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                console.log("payment success response in state", action.payload);
            })
            .addCase(paymentSuccess.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Payment processing failed";
            });
    },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
