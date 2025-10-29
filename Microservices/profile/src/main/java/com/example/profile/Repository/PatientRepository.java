package com.example.profile.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.example.profile.Dto.PatientDropdown;
import com.example.profile.Models.Patient;

public interface PatientRepository extends CrudRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByCitizenId(String citizenId);

    @Query("SELECT p.id AS id, p.name AS name, p.phone AS phone FROM Patient p WHERE p.id IN :ids")
    List<PatientDropdown> findAllPatientDropdownByIds(@Param("ids") List<Long> ids);
}
