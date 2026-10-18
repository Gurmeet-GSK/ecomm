package com.priyanshu.service;

import com.priyanshu.modal.Cart;
import com.priyanshu.modal.CartItem;
import com.priyanshu.modal.Product;
import com.priyanshu.modal.User;

public interface CartService {
    public CartItem addCartItem(
            User user,
            Product product,
            String size,
            int quantity
    );
    public Cart findUserCart(User user);
}
