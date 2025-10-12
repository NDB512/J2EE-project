package com.example.appointment.Dto;

public enum AppointmentStatus {
    PENDING,       // Chờ xác nhận
    SCHEDULED,     // Đã lên lịch
    RESCHEDULED,   // Đổi lịch
    CANCELLED,     // Đã hủy
    COMPLETED,     // Đã hoàn thành
    NO_SHOW        // Không đến
}
