package com.priyanshu.service;

import com.priyanshu.exceptions.ProductExceptions;
import com.priyanshu.modal.Product;
import com.priyanshu.modal.Seller;
import com.priyanshu.request.CreateProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    public Product createProduct(CreateProductRequest req, Seller seller);
    public void deleteProduct(Long productId) throws ProductExceptions;
    public Product updateProduct(Long productId, Product product) throws ProductExceptions;
    Product findProductById(Long productId) throws ProductExceptions;
    List<Product> searchProduct(String query);
    public Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String sizes,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber

    );

    List<Product> getProductBySellerId(Long sellerId);
}
