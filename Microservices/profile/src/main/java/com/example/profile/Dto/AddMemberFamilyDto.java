package com.example.profile.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddMemberFamilyDto {
    private Long familyId;
    private Long patientId;
    private String roleInFamily;
}
