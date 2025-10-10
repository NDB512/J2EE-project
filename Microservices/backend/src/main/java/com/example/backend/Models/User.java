package com.example.backend.Models;

import com.example.backend.Dto.Roles;
import com.example.backend.Dto.UserDto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private Roles role;

    public enum AuthProvider {
        LOCAL, GOOGLE
    }

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private AuthProvider provider = AuthProvider.LOCAL;

    // private String providerId;

    private Long profileId;

    private String licenseNumber;

    public UserDto toDto() {
        return new UserDto(this.id, this.name, this.email, this.password, this.role, this.profileId, this.licenseNumber);
    }
}