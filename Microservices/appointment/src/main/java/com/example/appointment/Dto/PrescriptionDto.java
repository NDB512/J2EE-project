package com.example.appointment.Dto;

import java.time.LocalDate;
import java.util.List;

import com.example.appointment.Models.Appointment;
import com.example.appointment.Models.Prescription;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDto {

    private Long id;
    private Long patientId;
    private Long doctorId;
    private Long appointmentId;
    private LocalDate prescriptionDate;
    private String notes;

    private List<MedicineDto> medicines;

    public Prescription toEntity() {
        Prescription entity = new Prescription();
        entity.setId(this.id);
        entity.setPatientId(this.patientId);
        entity.setDoctorId(this.doctorId);
        entity.setPrescriptionDate(this.prescriptionDate);
        entity.setNotes(this.notes);
        entity.setAppointment(new Appointment(appointmentId));
        return entity;
    }
}
