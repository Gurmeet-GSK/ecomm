import axios from "axios";

export const API_URL = "http://localhost:5454";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to automatically attach the appropriate token
api.interceptors.request.use(
    (config) => {
        // If an Authorization header is already explicitly provided, keep it
        if (config.headers.Authorization) {
            return config;
        }

        const url = config.url || "";
        // Seller endpoints strictly use seller_jwt
        if (url.startsWith("/sellers") || url.startsWith("/admin")) {
            const sellerToken = localStorage.getItem("seller_jwt") || localStorage.getItem("jwt");
            if (sellerToken) {
                config.headers.Authorization = sellerToken.startsWith("Bearer ")
                    ? sellerToken
                    : `Bearer ${sellerToken}`;
            }
        } else {
            // Customer endpoints use customer_jwt
            const customerToken = localStorage.getItem("customer_jwt") || localStorage.getItem("jwt");
            if (customerToken) {
                config.headers.Authorization = customerToken.startsWith("Bearer ")
                    ? customerToken
                    : `Bearer ${customerToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);
