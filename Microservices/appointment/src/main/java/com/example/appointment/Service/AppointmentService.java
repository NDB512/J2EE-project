package com.example.appointment.Service;

import java.util.List;
import java.util.Optional;

import com.example.appointment.Dto.AppointmentDetails;
import com.example.appointment.Dto.AppointmentDto;
import com.example.appointment.Dto.AppointmentStatus;
import com.example.appointment.Exception.ApException;

public interface AppointmentService {
    List<AppointmentDto> getAllAppointments();
    Optional<AppointmentDto> getAppointmentById(Long id);
    List<AppointmentDto> getByPatient(Long patientId);
    List<AppointmentDto> getByDoctor(Long doctorId);
    AppointmentDto createAppointment(AppointmentDto dto) throws ApException;
    AppointmentDto updateAppointment(Long id, AppointmentDto dto);
    AppointmentDto updateStatus(Long id, AppointmentStatus newStatus);
    void deleteAppointment(Long id);

    AppointmentDetails getAppointmentDetailsWithName(Long id) throws ApException;
}
