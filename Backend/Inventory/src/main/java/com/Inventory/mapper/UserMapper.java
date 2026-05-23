package com.Inventory.mapper;

import com.Inventory.dto.response.UserResponse;
import com.Inventory.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", expression = "java(user.getRole().getName().name())")
    UserResponse toResponse(User user);
}