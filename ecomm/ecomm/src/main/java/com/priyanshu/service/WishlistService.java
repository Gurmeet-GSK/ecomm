package com.priyanshu.service;

import com.priyanshu.modal.Product;
import com.priyanshu.modal.User;
import com.priyanshu.modal.Wishlist;

public interface WishlistService {
    Wishlist createWishList(User user);
    Wishlist getWishlistByUserId(User user);
    Wishlist addProductToWishList(User user, Product product);
}
