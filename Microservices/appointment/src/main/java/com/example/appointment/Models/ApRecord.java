package com.example.appointment.Models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.appointment.Dto.ApRecordDto;
import com.example.appointment.Dto.RecordDetail;
import com.example.appointment.Utilities.StringListCoverter;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ApRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;
    private Long doctorId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    private String symptoms;
    private String diagnosis;
    private String tests;
    private String notes;
    private String referal;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    public ApRecordDto toDto(){
        return new ApRecordDto(id, patientId, doctorId, appointment.getId(), StringListCoverter.coverterStringToList(symptoms),diagnosis, StringListCoverter.coverterStringToList(tests), notes, referal, null, followUpDate, createdAt, updateAt);
    }

    public RecordDetail toRecordDetail(){
        return new RecordDetail(id, patientId, doctorId, null, appointment.getId(), StringListCoverter.coverterStringToList(symptoms), diagnosis, StringListCoverter.coverterStringToList(tests), notes, referal, followUpDate, createdAt, updateAt);
    }
}
