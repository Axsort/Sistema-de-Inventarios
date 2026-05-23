package com.Inventory.service;

import com.Inventory.dto.request.ProductRequest;
import com.Inventory.dto.response.ProductResponse;
import com.Inventory.entity.*;
import com.Inventory.exception.*;
import com.Inventory.mapper.ProductMapper;
import com.Inventory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductMapper productMapper;

    public Page<ProductResponse> findAll(String search, Long categoryId,
                                          Boolean active, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return productRepository.findByFilters(search, categoryId, active, pageable)
                .map(productMapper::toResponse);
    }

    public ProductResponse findById(Long id) {
        return productMapper.toResponse(getOrThrow(id));
    }

    public List<ProductResponse> findLowStock() {
        return productRepository.findLowStockProducts()
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException(
                "Ya existe un producto con el SKU: " + request.getSku());
        }

        Product product = productMapper.toEntity(request);
        product.setCategory(getCategoryOrThrow(request.getCategoryId()));
        product.setSupplier(getSupplierOrThrow(request.getSupplierId()));

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getOrThrow(id);

        if (productRepository.existsBySkuAndIdNot(request.getSku(), id)) {
            throw new DuplicateResourceException(
                "Ya existe un producto con el SKU: " + request.getSku());
        }

        productMapper.updateEntity(request, product);
        product.setCategory(getCategoryOrThrow(request.getCategoryId()));
        product.setSupplier(getSupplierOrThrow(request.getSupplierId()));

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public void toggleStatus(Long id) {
        Product product = getOrThrow(id);
        product.setActive(!product.getActive());
        productRepository.save(product);
    }

    public Product getOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
    }

    private Category getCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
    }

    private Supplier getSupplierOrThrow(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", id));
    }
}