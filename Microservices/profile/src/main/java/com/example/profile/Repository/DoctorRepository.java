package com.example.profile.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.profile.Dto.DoctorDropdown;
import com.example.profile.Models.Doctor;

public interface DoctorRepository extends CrudRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    Optional<Doctor> findByLicenseNumber(String licenseNumber);

    @Query("SELECT d.id AS id, d.name AS name, d.specialization AS specialization FROM Doctor d")
    List<DoctorDropdown> findAllDoctorDropdowns();
}
