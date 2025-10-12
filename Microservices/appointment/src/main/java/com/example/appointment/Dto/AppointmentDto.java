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

    private Long patientId;       // ID bệnh nhân
    private Long doctorId;        // ID bác sĩ
    private LocalDateTime appointmentDate; // Ngày giờ hẹn

    private String reason;        // Lý do khám
    private String notes;         // Ghi chú thêm

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;  // Trạng thái cuộc hẹn

    private String location;      // Tùy chọn: địa chỉ khám / phòng khám

    public Appointment toEntity() {
        return new Appointment(
            this.id,
            this.patientId,
            this.doctorId,
            this.appointmentDate,
            this.reason,
            this.notes,
            this.status,
            this.location
        );
    }
}
