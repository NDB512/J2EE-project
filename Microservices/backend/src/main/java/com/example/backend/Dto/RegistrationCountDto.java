package com.example.backend.Dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationCountDto {
    List<MonthRoleCountDto> doctorCounts;
    List<MonthRoleCountDto> patientCounts;
}
