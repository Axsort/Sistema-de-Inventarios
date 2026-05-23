package com.Inventory.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SupplierRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150)
    private String name;

    @Size(max = 20)
    private String phone;

    @Email(message = "El email no tiene un formato válido")
    @Size(max = 100)
    private String email;

    @Size(max = 255)
    private String address;

    @Size(max = 100)
    private String contactName;
}