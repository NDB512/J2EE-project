package com.example.profile.Dto;

import java.time.LocalDate;

import lombok.Data;
@Data
public class AddMemberFamilyDto {
    private Long familyId;          // Required
    private Long requesterId;       // ID người thêm (head/creator)
    private String requesterRole;   // "HEAD" hoặc "ADMIN"

    // Patient info
    private String name;            // Required
    private String phone;
    private String address;         // Optional, sync từ family
    private String email;           // Required cho independent
    private String gender;
    private LocalDate dateOfBirth;  // Required cho dependent
    private String citizenId;
    private BloodType bloodType;
    private String allergies;
    private String medicalHistory;
    private String emergencyContact;
    private String insuranceDetails;
    private String roleInFamily;    // Required cho dependent ("Con", "Bố/Mẹ")

    // Loại thành viên
    private Boolean isDependent = false;  // Default false (independent)
    private Long existingPatientId;       // Optional: Link patient có sẵn (chỉ independent)
}