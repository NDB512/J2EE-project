package com.example.profile.Models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.profile.Dto.FamilyDto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "families")
public class Family {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String familyName; // Tên gia đình
    private String familyAddress; // Địa chỉ chung của gia đình
    private String headOfFamily; // Người đứng đầu gia đình
    private Integer memberCount; // Số thành viên (tự động cập nhật)

    @Column(name = "creator_id")
    private Long creatorId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Patient> patients = new ArrayList<>(); // Danh sách thành viên (Patient)

    // Method để thêm Patient vào Family (tự động cập nhật memberCount)
    public void addPatient(Patient patient) {
        patients.add(patient);
        patient.setFamily(this);
        updateMemberCount();
    }

    // Method để xóa Patient
    public void removePatient(Patient patient) {
        patients.remove(patient);
        patient.setFamily(null);
        updateMemberCount();
    }

    private void updateMemberCount() {
        this.memberCount = patients.size();
    }

    public Family(Long id){
        this.id = id;
    }

    public FamilyDto toDto() {
        FamilyDto dto = new FamilyDto();
        dto.setId(this.id);
        dto.setFamilyName(this.familyName);
        dto.setFamilyAddress(this.familyAddress);
        dto.setHeadOfFamily(this.headOfFamily);
        dto.setMemberCount(this.memberCount);
        dto.setCreatedAt(this.createdAt);
        dto.setUpdatedAt(this.updatedAt);
        dto.setCreatorId(this.creatorId);
        return dto;
    }
}