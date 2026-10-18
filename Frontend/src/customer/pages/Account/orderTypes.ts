export interface OrderProduct {
    id: string;
    title: string;
    seller: {
        businessDetails: {
            businessName: string;
        };
    };
    images: string[];
}

export interface OrderItemDetail {
    id: string;
    product: OrderProduct;
    size: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    orderId: string;
    orderDate: string;
    orderStatus: "PLACED" | "CONFIRMED" | "SHIPPED" | "ARRIVING" | "DELIVERED" | "CANCELLED";
    statusTitle: string;
    statusDate: string;
    orderItem: OrderItemDetail;
    shippingAddress: {
        name: string;
        address: string;
        locality: string;
        city: string;
        state: string;
        pinCode: string;
        mobile: string;
    };
    paymentDetails: {
        method: string;
        paymentId: string;
        subtotal: number;
        discount: number;
        total: number;
    };
}

export const SAMPLE_ORDERS: Order[] = [
    {
        id: "ord-1",
        orderId: "ORD-948210",
        orderDate: "Thu, 11 Jul 2026",
        orderStatus: "SHIPPED",
        statusTitle: "SHIPPED",
        statusDate: "Arriving by Fri, Oct 04",
        orderItem: {
            id: "item-1",
            product: {
                id: "prod-1",
                title: "Cellecor RAY 1.43\" AMOLED Display | 700 NITS | AOD | BT-Calling | AI Voice | Split Screen Smartwatch (Black Strap, Free Size)",
                seller: {
                    businessDetails: {
                        businessName: "Your Style",
                    },
                },
                images: [
                    "https://i.pinimg.com/736x/09/8d/6f/098d6fa5bdcb82307d8b465b58997c76.jpg",
                ],
            },
            size: "FREE",
            quantity: 1,
            price: 799,
        },
        shippingAddress: {
            name: "Ashok Singh",
            address: "Ambavadi choke",
            locality: "Banglor",
            city: "Banglor",
            state: "Karnataka",
            pinCode: "530068",
            mobile: "9023379136",
        },
        paymentDetails: {
            method: "Razorpay (UPI)",
            paymentId: "pay_N9k3hX19zL",
            subtotal: 1399,
            discount: 600,
            total: 799,
        },
    },
    {
        id: "ord-2",
        orderId: "ORD-837192",
        orderDate: "Tue, 16 Jul 2026",
        orderStatus: "CANCELLED",
        statusTitle: "CANCELLED",
        statusDate: "Cancelled on Fri, Oct 04",
        orderItem: {
            id: "item-2",
            product: {
                id: "prod-1",
                title: "Cellecor RAY 1.43\" AMOLED Display | 700 NITS | AOD | BT-Calling | AI Voice | Split Screen Smartwatch (Black Strap, Free Size)",
                seller: {
                    businessDetails: {
                        businessName: "Raam Clothing",
                    },
                },
                images: [
                    "https://i.pinimg.com/736x/09/8d/6f/098d6fa5bdcb82307d8b465b58997c76.jpg",
                ],
            },
            size: "FREE",
            quantity: 1,
            price: 799,
        },
        shippingAddress: {
            name: "Ashok Singh",
            address: "Ambavadi choke",
            locality: "Banglor",
            city: "Banglor",
            state: "Karnataka",
            pinCode: "530068",
            mobile: "9023379136",
        },
        paymentDetails: {
            method: "Stripe Card",
            paymentId: "ch_3M4oZ2LkdIw",
            subtotal: 1399,
            discount: 600,
            total: 799,
        },
    },
    {
        id: "ord-3",
        orderId: "ORD-729401",
        orderDate: "Sat, 21 Sep 2026",
        orderStatus: "DELIVERED",
        statusTitle: "DELIVERED",
        statusDate: "Delivered on Mon, 28 Sep",
        orderItem: {
            id: "item-3",
            product: {
                id: "prod-2",
                title: "Men Slim Fit Casual Cotton Shirt - Solid Grey",
                seller: {
                    businessDetails: {
                        businessName: "Black Mason",
                    },
                },
                images: [
                    "https://i.pinimg.com/1200x/23/67/e5/2367e55711f6ade916ff7805700b942f.jpg",
                ],
            },
            size: "M",
            quantity: 1,
            price: 899,
        },
        shippingAddress: {
            name: "Ashok Singh",
            address: "Ambavadi choke",
            locality: "Banglor",
            city: "Banglor",
            state: "Karnataka",
            pinCode: "530068",
            mobile: "9023379136",
        },
        paymentDetails: {
            method: "Razorpay (Card)",
            paymentId: "pay_M8k2aP88zX",
            subtotal: 1599,
            discount: 700,
            total: 899,
        },
    },
    {
        id: "ord-4",
        orderId: "ORD-619042",
        orderDate: "Sun, 29 Sep 2026",
        orderStatus: "CONFIRMED",
        statusTitle: "CONFIRMED",
        statusDate: "Arriving by Wed, Oct 09",
        orderItem: {
            id: "item-4",
            product: {
                id: "prod-3",
                title: "boAt Rockerz 450 Bluetooth On Ear Headphones with Mic (Hazel Beige)",
                seller: {
                    businessDetails: {
                        businessName: "Imagine Marketing",
                    },
                },
                images: [
                    "https://i.pinimg.com/736x/09/8d/6f/098d6fa5bdcb82307d8b465b58997c76.jpg",
                ],
            },
            size: "FREE",
            quantity: 1,
            price: 1499,
        },
        shippingAddress: {
            name: "Zosh",
            address: "Ambavadi choke",
            locality: "Banglor",
            city: "Banglor",
            state: "Karnataka",
            pinCode: "530068",
            mobile: "9023379136",
        },
        paymentDetails: {
            method: "Pay on Delivery",
            paymentId: "PAY-ON-DELIVERY",
            subtotal: 1999,
            discount: 500,
            total: 1499,
        },
    },
];
