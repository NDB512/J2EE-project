package com.example.appointment.Dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDetails {
    private Long id;

    private Long patientId;       // ID bệnh nhân
    private String patientName;   // Tên bệnh nhân
    private Long doctorId;        // ID bác sĩ
    private String doctorName;    // Tên bác sĩ
    private LocalDateTime appointmentDate; // Ngày giờ hẹn

    private String reason;        // Lý do khám
    private String notes;         // Ghi chú thêm

    private AppointmentStatus status;  // Trạng thái cuộc hẹn

    private String location;      // Tùy chọn: địa chỉ khám / phòng khám
}
