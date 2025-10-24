package com.example.appointment.Dto;

public enum AppointmentStatus {
    PENDING("Chờ xác nhận"),
    SCHEDULED("Đã lên lịch"),
    RESCHEDULED("Đổi lịch"),
    CANCELLED("Đã hủy"),
    COMPLETED("Đã hoàn thành"),
    NO_SHOW("Không đến");

    private final String vietnameseName;

    AppointmentStatus(String vietnameseName) {
        this.vietnameseName = vietnameseName;
    }

    public String getVietnameseName() {
        return vietnameseName;
    }

    @Override
    public String toString() {
        return vietnameseName; // Khi gọi currentStatus.toString() => hiện tiếng Việt
    }
}
