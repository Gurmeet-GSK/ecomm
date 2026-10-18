package com.priyanshu.controller;

import com.priyanshu.exceptions.ProductExceptions;
import com.priyanshu.exceptions.SellerException;
import com.priyanshu.modal.Product;
import com.priyanshu.modal.Seller;
import com.priyanshu.request.CreateProductRequest;
import com.priyanshu.service.ProductService;
import com.priyanshu.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sellers/products")
public class SellerProductController {

    private final ProductService productService;
    private final SellerService sellerService;

    @GetMapping
    public ResponseEntity<List<Product>> getProductBySellerId(@RequestHeader("Authorization") String jwt) throws Exception {
        Seller seller = sellerService.getSellerProfile(jwt);
        List<Product> products = productService.getProductBySellerId(seller.getId());
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Product> createProduct(
            @RequestBody CreateProductRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception{
        Seller seller = sellerService.getSellerProfile(jwt);
        Product product = productService.createProduct(request, seller);
//        Product product = new Product();
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        try{
            productService.deleteProduct(productId);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(ProductExceptions e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long productId,
                                                 @RequestBody Product product){
        try{
            Product updateProduct = productService.updateProduct(productId, product);
            return new ResponseEntity<>(updateProduct, HttpStatus.OK);
        }catch (ProductExceptions e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
