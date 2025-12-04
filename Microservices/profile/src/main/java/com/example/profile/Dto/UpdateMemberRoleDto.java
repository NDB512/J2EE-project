package com.example.profile.Dto;

import lombok.Data;

@Data
public class UpdateMemberRoleDto {
    private Long patientId;
    private String roleInFamily;
    private Long requesterId;
    private String requesterRole;
}
