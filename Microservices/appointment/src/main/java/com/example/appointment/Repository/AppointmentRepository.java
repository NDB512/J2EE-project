package com.example.appointment.Repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.appointment.Dto.AppointmentStatus;
import com.example.appointment.Models.Appointment;

public interface AppointmentRepository extends CrudRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByStatus(AppointmentStatus status);
}
