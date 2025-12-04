package com.example.profile.Dto;

import lombok.Data;

@Data
public class FamilyMemberList {
    private Long id;
    private String name;
    private String email;
    private Long familyId;
    private String roleInFamily;
    private String phone;
    private Boolean isDependent = false;  // THÊM: Để frontend hiển thị badge
}