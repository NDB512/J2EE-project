package com.example.appointment.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.example.appointment.Models.ApRecord;
import com.example.appointment.Models.Appointment;
import com.example.appointment.Utilities.StringListCoverter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApRecordDto {
    private Long id;

    private Long patientId;
    private Long doctorId;

    private Long appointmentId;
    private List<String> symptoms;
    private String diagnosis;
    private List<String> tests;
    private String notes;
    private String referal;
    private PrescriptionDto prescriptionDto;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    public ApRecord toEntity(){
        return new ApRecord(
            id, patientId, doctorId, new Appointment(appointmentId), 
            StringListCoverter.coverterListToString(symptoms), diagnosis, 
            StringListCoverter.coverterListToString(tests), notes, referal, 
            followUpDate, createdAt, updateAt);
    }
}
