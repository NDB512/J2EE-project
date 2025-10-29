package com.example.appointment.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.appointment.Models.Prescription;

public interface PrescriptionRepository extends CrudRepository<Prescription, Long> {
    Optional<Prescription> findByAppointment_Id(Long appointmentId);
    List<Prescription> findAllByPatientId(Long patientId);
    List<Prescription> findBySoldFalse();
}
