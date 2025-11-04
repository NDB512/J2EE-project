package com.example.backend.Dto;

import java.time.LocalDateTime;

import com.example.backend.Models.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String password;
    private Roles role;
    private Long profileId;
    private String licenseNumber;
    private Long profileImageUrlId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User toEntity() {
        return new User(this.id, this.name, this.email, this.password, this.role, null, this.profileId, this.licenseNumber, this.profileImageUrlId, this.createdAt, this.updatedAt);
    }
}
