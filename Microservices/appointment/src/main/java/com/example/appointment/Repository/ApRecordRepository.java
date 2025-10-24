package com.example.appointment.Repository;

import org.springframework.data.repository.CrudRepository;

import com.example.appointment.Models.ApRecord;

import java.util.List;
import java.util.Optional;


public interface ApRecordRepository extends CrudRepository<ApRecord, Long> {
    Optional<ApRecord> findByAppointment_Id(Long appointmentId);

    List<ApRecord> findByPatientId(Long patientId);

    Boolean existsByAppointment_Id(Long appointmentId);
}
