package com.example.appointment.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientName {
    private Long id;
    private String name;
    private String phone;
}
