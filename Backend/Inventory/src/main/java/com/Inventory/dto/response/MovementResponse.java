package com.Inventory.dto.response;

import com.Inventory.enums.MovementType;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class MovementResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private MovementType type;
    private Integer quantity;
    private String reason;
    private String userName;
    private LocalDateTime createdAt;
}