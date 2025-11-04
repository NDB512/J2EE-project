package com.example.profile.Dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.profile.Models.Family;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FamilyDto {
    private Long id;
    private String familyName;
    private String familyAddress;
    private String headOfFamily;
    private Integer memberCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<PatientDto> patients;
    private Long creatorId;

    public Family toEntity() {
        Family family = new Family();
        family.setId(id);
        family.setFamilyName(familyName);
        family.setFamilyAddress(familyAddress);
        family.setHeadOfFamily(headOfFamily);
        family.setMemberCount(memberCount);
        family.setCreatorId(creatorId);
        return family;
    }
}