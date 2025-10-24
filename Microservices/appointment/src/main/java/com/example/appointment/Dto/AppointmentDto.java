package com.example.appointment.Dto;

import java.time.LocalDateTime;

import com.example.appointment.Models.Appointment;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class AppointmentDto {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDate;
    private String reason;
    private String notes;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private String location;
    private String statusReason;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;

    public Appointment toEntity() {
        return new Appointment(
            this.id,
            this.patientId,
            this.doctorId,
            this.appointmentDate,
            this.reason,
            this.notes,
            this.status,
            this.location,
            this.statusReason,
            this.completedAt,
            this.cancelledAt
        );
    }
}
