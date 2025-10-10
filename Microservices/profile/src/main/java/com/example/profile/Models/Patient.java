package com.example.profile.Models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.profile.Dto.BloodType;
import com.example.profile.Dto.PatientDto;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String address;
    private String email;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    private String emergencyContact;

    @Column(columnDefinition = "TEXT")
    private String insuranceDetails;

    private LocalDate dateOfBirth;

    private String citizenId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private BloodType bloodType;

    public PatientDto toDto() {
        PatientDto dto = new PatientDto();
        dto.setId(this.id);
        dto.setName(this.name);
        dto.setPhone(this.phone);
        dto.setAddress(this.address);
        dto.setMedicalHistory(this.medicalHistory);
        dto.setEmergencyContact(this.emergencyContact);
        dto.setInsuranceDetails(this.insuranceDetails);
        dto.setDateOfBirth(this.dateOfBirth);
        dto.setCreatedAt(this.createdAt);
        dto.setUpdatedAt(this.updatedAt);
        dto.setBloodType(this.bloodType);
        return dto;
    }
}
