package com.priyanshu.service.impl;

import com.priyanshu.domain.HomeCategorySection;
import com.priyanshu.exceptions.ProductExceptions;
import com.priyanshu.modal.Category;
import com.priyanshu.modal.Product;
import com.priyanshu.modal.Seller;
import com.priyanshu.repository.CategoryRepository;
import com.priyanshu.repository.ProductRepository;
import com.priyanshu.request.CreateProductRequest;
import com.priyanshu.service.ProductService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Product createProduct(CreateProductRequest req, Seller seller) {
        Category category1 = categoryRepository.findByCategoryId(req.getCategory());
        if (category1 == null) {
            Category category = new Category();
            category.setCategoryId(req.getCategory());
            category.setLevel(1);
            category.setName(req.getCategory());
            category1 = categoryRepository.save(category);
        }

        Category category2 = categoryRepository.findByCategoryId(req.getCategory2());
        if (category2 == null) {
            Category category = new Category();
            category.setCategoryId(req.getCategory2());
            category.setLevel(2);
            category.setName(req.getCategory2());
            category.setParentCategory(category1);
            category2 = categoryRepository.save(category);
        }

        Category category3 = categoryRepository.findByCategoryId(req.getCategory3());
        if (category3 == null) {
            Category category = new Category();
            category.setCategoryId(req.getCategory3());
            category.setLevel(3);
            category.setName(req.getCategory3());
            category.setParentCategory(category2);
            category3 = categoryRepository.save(category);
        }

        int mrp = Math.max(req.getMrpPrice(), 0);
        int discount = Math.max(0, Math.min(100, req.getDiscountPercent()));
        int finalSellingPrice = (int) Math.round(mrp - (mrp * ((double) discount / 100.0)));

        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category3);
        product.setDescription(req.getDescription());
        product.setCreatedAt(LocalDateTime.now());
        product.setTitle(req.getTitle());
        product.setColor(req.getColor());
        product.setMrpPrice(mrp);
        product.setDiscountPercent(discount);
        product.setSellingPrice(finalSellingPrice);
        product.setImages(req.getImages());
        product.setSizes(req.getSizes());
        product.setIn_stock(true);

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long productId) throws ProductExceptions {
        Product product = findProductById(productId);
        productRepository.delete(product);
    }

    @Override
    public Product updateProduct(Long productId, Product product) throws ProductExceptions {
        Product existingProduct = findProductById(productId);

        if (product.getTitle() != null && !product.getTitle().isEmpty()) {
            existingProduct.setTitle(product.getTitle());
        }
        if (product.getDescription() != null && !product.getDescription().isEmpty()) {
            existingProduct.setDescription(product.getDescription());
        }
        if (product.getMrpPrice() > 0) {
            existingProduct.setMrpPrice(product.getMrpPrice());
        }
        if (product.getDiscountPercent() >= 0 && product.getDiscountPercent() <= 100) {
            existingProduct.setDiscountPercent(product.getDiscountPercent());
        }
        if (product.getColor() != null && !product.getColor().isEmpty()) {
            existingProduct.setColor(product.getColor());
        }
        if (product.getSizes() != null && !product.getSizes().isEmpty()) {
            existingProduct.setSizes(product.getSizes());
        }
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            existingProduct.setImages(product.getImages());
        }
        if (product.getCategory() != null) {
            existingProduct.setCategory(product.getCategory());
        }

        // Recalculate server-side final selling price
        int mrp = existingProduct.getMrpPrice();
        int discount = existingProduct.getDiscountPercent();
        int calculatedSelling = (int) Math.round(mrp - (mrp * ((double) discount / 100.0)));
        existingProduct.setSellingPrice(calculatedSelling);

        return productRepository.save(existingProduct);
    }

    @Override
    public Product updateProductStock(Long productId) throws ProductExceptions {
        Product product = findProductById(productId);
        product.setIn_stock(!product.isIn_stock());
        return productRepository.save(product);
    }

    @Override
    public Product findProductById(Long productId) throws ProductExceptions {
        return productRepository.findById(productId).orElseThrow(() ->
                new ProductExceptions("Product not found with id: " + productId));
    }

    @Override
    public List<Product> searchProduct(String query) {
        return productRepository.searchProduct(query);
    }

    @Override
    public Page<Product> getAllProducts(String category, String brand, String colors, String sizes, Integer minPrice, Integer maxPrice, Integer minDiscount, String sort, String stock, Integer pageNumber) {
        Specification<Product> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null && !category.isEmpty()) {
                Join<Product, Category> categoryJoin = root.join("category", JoinType.LEFT);
                Join<Category, Category> parentCategoryJoin = categoryJoin.join("parentCategory", JoinType.LEFT);
                Join<Category, Category> grandParentCategoryJoin = parentCategoryJoin.join("parentCategory", JoinType.LEFT);

                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.equal(categoryJoin.get("categoryId"), category),
                        criteriaBuilder.equal(parentCategoryJoin.get("categoryId"), category),
                        criteriaBuilder.equal(grandParentCategoryJoin.get("categoryId"), category)
                ));
            }

            if (colors != null && !colors.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("color"), colors));
            }

            if (sizes != null && !sizes.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("size"), sizes));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }

            if (minDiscount != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("discountPercent"), minDiscount));
            }

            if (stock != null) {
                predicates.add(criteriaBuilder.equal(root.get("stock"), stock));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable;
        if (sort != null && !sort.isEmpty()) {
            pageable = switch (sort) {
                case "price_low" -> PageRequest.of(pageNumber, 10, Sort.by("sellingPrice").ascending());
                case "price_high" -> PageRequest.of(pageNumber, 10, Sort.by("sellingPrice").descending());
                default -> PageRequest.of(pageNumber, 10, Sort.unsorted());
            };
        } else {
            pageable = PageRequest.of(pageNumber, 10, Sort.unsorted());
        }

        return productRepository.findAll(spec, pageable);
    }

    @Override
    public List<Product> getProductBySellerId(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }
}
