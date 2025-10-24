package com.example.appointment.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.appointment.Dto.AppointmentDetails;
import com.example.appointment.Dto.AppointmentStatus;
import com.example.appointment.Models.Appointment;

public interface AppointmentRepository extends CrudRepository<Appointment, Long> {

    @Query("""
        SELECT new com.example.appointment.Dto.AppointmentDetails(
            a.id,
            a.patientId,
            null,
            a.doctorId,
            null,
            a.appointmentDate,
            a.reason,
            a.notes,
            a.status,
            a.location,
            a.statusReason,
            a.completedAt,
            a.cancelledAt
        )
        FROM Appointment a
        WHERE a.patientId = :patientId
    """)
    List<AppointmentDetails> findAllByPatientId(Long patientId);


    @Query("""
        SELECT new com.example.appointment.Dto.AppointmentDetails(
            a.id,
            a.patientId,
            null,
            a.doctorId,
            null,
            a.appointmentDate,
            a.reason,
            a.notes,
            a.status,
            a.location,
            a.statusReason,
            a.completedAt,
            a.cancelledAt
        )
        FROM Appointment a
        WHERE a.doctorId = :doctorId
        """)
    List<AppointmentDetails> findAllByDoctorId(Long doctorId);

    List<AppointmentDetails> findByStatus(AppointmentStatus status);

    Appointment getReferenceById(Long appointmentId);
}
