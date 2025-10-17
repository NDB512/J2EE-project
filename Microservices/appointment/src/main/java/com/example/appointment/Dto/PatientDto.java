package com.example.appointment.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientDto {
    private Long id;

    private String name;
    private String phone;
    private String address;
    private String email;
    private String gender;
    private String medicalHistory;
    private String emergencyContact;
    private String insuranceDetails;
    private LocalDate dateOfBirth;
    private String citizenId;
    private BloodType bloodType;
    private String allergies; // Dị ứng
    private String chronicDisease; // Bệnh mã

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
