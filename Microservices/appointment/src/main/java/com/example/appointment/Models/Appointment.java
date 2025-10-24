package com.example.appointment.Models;

import java.time.LocalDateTime;

import com.example.appointment.Dto.AppointmentDto;
import com.example.appointment.Dto.AppointmentStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;       // ID bệnh nhân
    private Long doctorId;        // ID bác sĩ
    private LocalDateTime appointmentDate; // Ngày giờ hẹn

    private String reason;        // Lý do khám
    private String notes;         // Ghi chú thêm

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;  // Trạng thái cuộc hẹn

    private String location;      // Địa điểm khám

    @Column(name = "status_reason")
    private String statusReason;  // Lý do hủy hoặc đổi lịch

    @Column(name = "completed_at")
    private LocalDateTime completedAt; // Thời điểm hoàn thành

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt; // Thời điểm hủy

    public AppointmentDto toDto() {
        return new AppointmentDto(
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

    public Appointment(Long id){
        this.id = id;
    }
}
