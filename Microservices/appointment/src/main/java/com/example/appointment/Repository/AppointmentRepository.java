package com.example.appointment.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.appointment.Dto.AppointmentDetails;
import com.example.appointment.Dto.AppointmentStatus;
import com.example.appointment.Dto.MonthlyVisitDto;
import com.example.appointment.Dto.ReasonCountDto;
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

    @Query(value = """
        SELECT 
            YEAR(a.appointment_date) AS year,
            MONTHNAME(a.appointment_date) AS month,
            COUNT(a.id) AS visitCount
        FROM appointment a
        WHERE a.patient_id = :patientId
        AND YEAR(a.appointment_date) = YEAR(CURDATE())
        GROUP BY YEAR(a.appointment_date), MONTH(a.appointment_date), MONTHNAME(a.appointment_date)
        ORDER BY MONTH(a.appointment_date)
    """, nativeQuery = true)
    List<MonthlyVisitDto> countCurrentYearVisitsByPatient(Long patientId);


    @Query(value = """
        SELECT 
            YEAR(a.appointment_date) AS year,
            MONTHNAME(a.appointment_date) AS month,
            COUNT(a.id) AS visitCount
        FROM appointment a
        WHERE a.doctor_id = :doctorId
        AND YEAR(a.appointment_date) = YEAR(CURDATE())
        GROUP BY YEAR(a.appointment_date), MONTH(a.appointment_date), MONTHNAME(a.appointment_date)
        ORDER BY MONTH(a.appointment_date)
    """, nativeQuery = true)
    List<MonthlyVisitDto> countCurrentYearVisitsByDoctor(Long doctorId);


    @Query(value = """
            SELECT 
                YEAR(a.appointment_date) AS year,
                MONTHNAME(a.appointment_date) AS month,
                COUNT(a.id) AS visitCount
            FROM appointment a
            GROUP BY YEAR(a.appointment_date), MONTH(a.appointment_date), MONTHNAME(a.appointment_date)
            ORDER BY YEAR(a.appointment_date), MONTH(a.appointment_date)
        """, nativeQuery = true)
    List<MonthlyVisitDto> countAllVisits();


    @Query(value = """
        SELECT 
            a.reason AS reason,
            COUNT(a.id) AS count
        FROM appointment a
        WHERE a.patient_id = :patientId
        GROUP BY a.reason
    """, nativeQuery = true)
    List<ReasonCountDto> countReasonsByPatient(Long patientId);

    @Query(value = """
        SELECT 
            a.reason AS reason,
            COUNT(a.id) AS count
        FROM appointment a
        WHERE a.doctor_id = :doctorId
        GROUP BY a.reason
    """, nativeQuery = true)
    List<ReasonCountDto> countReasonsByDoctor(Long doctorId);

    @Query(value = """
        SELECT 
            a.reason AS reason,
            COUNT(a.id) AS count
        FROM appointment a
        GROUP BY a.reason
    """, nativeQuery = true)
    List<ReasonCountDto> countReasonsForAll();

    List<Appointment> findByAppointmentDateBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

}
