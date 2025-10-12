package com.example.appointment.Models;

import java.time.LocalDateTime;

import com.example.appointment.Dto.AppointmentDto;
import com.example.appointment.Dto.AppointmentStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    private Long patientId;       // ID bệnh nhân
    private Long doctorId;        // ID bác sĩ
    private LocalDateTime appointmentDate; // Ngày giờ hẹn

    private String reason;        // Lý do khám
    private String notes;         // Ghi chú thêm

    private AppointmentStatus status;  // Trạng thái cuộc hẹn

    private String location;      // Tùy chọn: địa chỉ khám / phòng khám

    public AppointmentDto toDto() {
        return new AppointmentDto(
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
