package com.Inventory.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String sku;
    private BigDecimal purchasePrice;
    private BigDecimal salePrice;
    private Integer stock;
    private Integer minStock;
    private Boolean lowStock;
    private CategoryResponse category;
    private SupplierResponse supplier;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}