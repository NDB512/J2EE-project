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
    private String gender;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    private String emergencyContact;

    @Column(columnDefinition = "TEXT")
    private String insuranceDetails;

    private String allergies;

    private LocalDate dateOfBirth;

    private String citizenId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private BloodType bloodType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private Family family;

    @Column(name = "role_in_family")
    private String roleInFamily;

    public PatientDto toDto() {
        PatientDto dto = new PatientDto();
        dto.setId(this.id);
        dto.setName(this.name);
        dto.setPhone(this.phone);
        dto.setEmail(this.email);
        dto.setGender(gender);
        dto.setAllergies(this.allergies);
        dto.setAddress(this.address);
        dto.setMedicalHistory(this.medicalHistory);
        dto.setEmergencyContact(this.emergencyContact);
        dto.setInsuranceDetails(this.insuranceDetails);
        dto.setDateOfBirth(this.dateOfBirth);
        dto.setCitizenId(this.citizenId);
        dto.setCreatedAt(this.createdAt);
        dto.setUpdatedAt(this.updatedAt);
        dto.setBloodType(this.bloodType);

        dto.setFamilyId(this.family != null ? this.family.getId() : null);
        dto.setRoleInFamily(this.roleInFamily);
        return dto;
    }
}
