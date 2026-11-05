package com.priyanshu.controller;

import com.priyanshu.exceptions.ProductExceptions;
import com.priyanshu.modal.Product;
import com.priyanshu.modal.Seller;
import com.priyanshu.request.CreateProductRequest;
import com.priyanshu.service.ProductService;
import com.priyanshu.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sellers/products")
public class SellerProductController {

    private final ProductService productService;
    private final SellerService sellerService;

    @GetMapping
    public ResponseEntity<List<Product>> getProductBySellerId(
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Seller seller = sellerService.getSellerProfile(jwt);
        List<Product> products = productService.getProductBySellerId(seller.getId());
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestBody CreateProductRequest request,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Seller seller = sellerService.getSellerProfile(jwt);
        Product product = productService.createProduct(request, seller);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long productId,
            @RequestHeader(value = "Authorization", required = false) String jwt) {
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Authentication required"));
        }
        try {
            Seller seller = sellerService.getSellerProfile(jwt);
            Product product = productService.findProductById(productId);

            if (product.getSeller() == null || !product.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Collections.singletonMap("message", "You are not authorized to delete this product"));
            }

            productService.deleteProduct(productId);
            return ResponseEntity.ok(Collections.singletonMap("message", "Product deleted successfully"));
        } catch (ProductExceptions e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Unauthorized"));
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long productId,
            @RequestBody Product product,
            @RequestHeader(value = "Authorization", required = false) String jwt) {
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Authentication required"));
        }
        try {
            Seller seller = sellerService.getSellerProfile(jwt);
            Product existingProduct = productService.findProductById(productId);

            if (existingProduct.getSeller() == null || !existingProduct.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Collections.singletonMap("message", "You are not authorized to update this product"));
            }

            Product updated = productService.updateProduct(productId, product);
            return ResponseEntity.ok(updated);
        } catch (ProductExceptions e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Unauthorized"));
        }
    }

    @PatchMapping("/{productId}/stock")
    public ResponseEntity<?> updateProductStock(
            @PathVariable Long productId,
            @RequestHeader(value = "Authorization", required = false) String jwt) {
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Authentication required"));
        }
        try {
            Seller seller = sellerService.getSellerProfile(jwt);
            Product existingProduct = productService.findProductById(productId);

            if (existingProduct.getSeller() == null || !existingProduct.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Collections.singletonMap("message", "You are not authorized to update this product"));
            }

            Product updated = productService.updateProductStock(productId);
            return ResponseEntity.ok(updated);
        } catch (ProductExceptions e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Unauthorized"));
        }
    }
}
