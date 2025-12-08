package com.example.appointment.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.appointment.Dto.AppointmentDetails;
import com.example.appointment.Dto.AppointmentDto;
import com.example.appointment.Dto.AppointmentStatus;
import com.example.appointment.Dto.MonthlyVisitDto;
import com.example.appointment.Dto.ReasonCountDto;
import com.example.appointment.Exception.ApException;

public interface AppointmentService {
    List<AppointmentDto> getAllAppointments();
    Optional<AppointmentDto> getAppointmentById(Long id);
    AppointmentDto createAppointment(AppointmentDto dto) throws ApException;
    AppointmentDto updateAppointment(Long id, AppointmentDto dto);
    public AppointmentDto updateStatus(Long id, AppointmentStatus newStatus, String reason, LocalDateTime newDateTime) throws ApException;
    void deleteAppointment(Long id);
    public void cancelAppointment(Long id, String reason);
    
    AppointmentDetails getAppointmentDetailsWithName(Long id) throws ApException;
    public List<AppointmentDetails> getAllAppointmentsByPatientId(Long patientId) throws ApException;
    public List<AppointmentDetails> getAllAppointmentsByDoctorId(Long doctorId) throws ApException;

    public List<MonthlyVisitDto> getAppointmentCountByPatient(Long patientId) throws ApException;
    public List<MonthlyVisitDto> getAppointmentCountByDoctor(Long doctorId) throws ApException;
    public List<MonthlyVisitDto> getAppointmentCount() throws ApException;
    public List<ReasonCountDto> getReasonsCountByPatient(Long patientId) throws ApException;
    public List<ReasonCountDto> getReasonsCountByDoctor(Long doctorId) throws ApException;
    public List<ReasonCountDto> getReasonsCountForAll() throws ApException;

    public List<AppointmentDetails> getTodaysAppointments() throws ApException;
    public List<AppointmentDetails> getTodaysAppointmentsByPatient(Long patientId) throws ApException;
}
