package com.priyanshu.repository;

import com.priyanshu.modal.Cart;
import com.priyanshu.modal.CartItem;
import com.priyanshu.modal.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}
