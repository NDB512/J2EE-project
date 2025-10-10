package com.example.profile.Repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.profile.Models.Doctor;

public interface DoctorRepository extends CrudRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    Optional<Doctor> findByLicenseNumber(String licenseNumber);
}
