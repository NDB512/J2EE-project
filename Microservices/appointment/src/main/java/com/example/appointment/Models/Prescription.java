package com.example.appointment.Models;

import java.time.LocalDate;

import com.example.appointment.Dto.PrescriptionDetails;
import com.example.appointment.Dto.PrescriptionDto;

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

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;   // ID bệnh nhân
    private Long doctorId;    // ID bác sĩ kê đơn

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment; // Liên kết với cuộc hẹn (1 cuộc hẹn chỉ có 1 đơn thuốc)

    private LocalDate prescriptionDate; // Ngày kê đơn
    private String notes;               // Ghi chú thêm (ví dụ: "Tái khám sau 5 ngày")

    private boolean sold = false;

    public PrescriptionDto toDto() {
        PrescriptionDto dto = new PrescriptionDto();
        dto.setId(id);
        dto.setPatientId(patientId);
        dto.setDoctorId(doctorId);
        dto.setPrescriptionDate(prescriptionDate);
        dto.setNotes(notes);
        dto.setAppointmentId(appointment.getId());
        return dto;
    }

    public Prescription(Long id){
        this.id = id;
    }

    public PrescriptionDetails toDetails(){
        return new PrescriptionDetails(id, patientId, doctorId, null, null, null, appointment.getId(), prescriptionDate, notes, null);
    }
}
