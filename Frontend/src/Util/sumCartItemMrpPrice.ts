import type { CartItem } from "../types/cartTypes";

export const sumCartItemMrpPrice = (cartItems?: CartItem[]) => {
    return cartItems?.reduce((total, item) => total + item.mrpPrice * item.quantity, 0) || 0;
}

export const sumCartItemSellingPrice = (cartItems?: CartItem[]) => {
    return cartItems?.reduce((total, item) => total + item.sellingPrice * item.quantity, 0) || 0;
}   