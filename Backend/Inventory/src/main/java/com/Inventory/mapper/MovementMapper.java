package com.Inventory.mapper;

import com.Inventory.dto.response.MovementResponse;
import com.Inventory.entity.InventoryMovement;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MovementMapper {

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "productSku", source = "product.sku")
    @Mapping(target = "userName", source = "user.name")
    MovementResponse toResponse(InventoryMovement movement);
}