package com.Inventory.repository;

import com.Inventory.entity.InventoryMovement;
import com.Inventory.enums.MovementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {

    @Query("SELECT m FROM InventoryMovement m WHERE " +
           "(:productId IS NULL OR m.product.id = :productId) " +
           "AND (:type IS NULL OR m.type = :type)")
    Page<InventoryMovement> findByFilters(
            @Param("productId") Long productId,
            @Param("type") MovementType type,
            Pageable pageable);

    List<InventoryMovement> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT m.type, COUNT(m) FROM InventoryMovement m " +
           "WHERE m.createdAt >= :since GROUP BY m.type")
    List<Object[]> countByTypeAfter(@Param("since") LocalDateTime since);
}