package com.example.appointment.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecordDetail {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String doctorName;
    private Long appointmentId;
    private List<String> symptoms;
    private String diagnosis;
    private List<String> tests;
    private String notes;
    private String referal;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
}
