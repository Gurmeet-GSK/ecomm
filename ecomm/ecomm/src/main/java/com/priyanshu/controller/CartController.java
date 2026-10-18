package com.priyanshu.controller;

import com.priyanshu.modal.Cart;
import com.priyanshu.modal.CartItem;
import com.priyanshu.modal.Product;
import com.priyanshu.modal.User;
import com.priyanshu.request.AddItemRequest;
import com.priyanshu.response.ApiResponse;
import com.priyanshu.service.CartItemService;
import com.priyanshu.service.CartService;
import com.priyanshu.service.ProductService;
import com.priyanshu.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Cart> findUserCartHandler(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Cart cart = cartService.findUserCart(user);

        return new ResponseEntity<Cart>(cart, HttpStatus.OK);
    }

    @PutMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(@RequestBody AddItemRequest req,
                                                  @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Product product = productService.findProductById(req.getProductId());

        CartItem item = cartService.addCartItem(user,
                product,
                req.getSize(),
                req.getQuantity());

        ApiResponse res = new ApiResponse();
        res.setMessage("Item added to cart successfully");

        return new ResponseEntity<>(item, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItemHandler(
            @PathVariable Long cartItemId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        cartItemService.removeCartItem(user.getId(), cartItemId);

        ApiResponse res = new ApiResponse();
        res.setMessage("Item removed from cart");

        return new ResponseEntity<ApiResponse>(res, HttpStatus.ACCEPTED);
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItemHandler(
            @PathVariable Long cartItemId,
            @RequestBody CartItem cartItem,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        CartItem updateCartItem = null;
        if(cartItem.getQuantity()>0){
            updateCartItem = cartItemService.updateCartItem(user.getId(),
                    cartItemId, cartItem);
        }

        return new ResponseEntity<>(updateCartItem, HttpStatus.ACCEPTED);
    }


}
