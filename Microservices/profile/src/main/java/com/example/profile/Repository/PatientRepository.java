package com.example.profile.Repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.profile.Models.Patient;

public interface PatientRepository extends CrudRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByCitizenId(String citizenId);
}
