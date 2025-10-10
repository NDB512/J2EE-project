package com.example.profile.Repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.profile.Models.Pharmacy;

public interface PharmacyRepository extends CrudRepository<Pharmacy, Long> {
    Optional<Pharmacy> findByEmail(String email);
    Optional<Pharmacy> findByLicenseNumber(String licenseNumber);
}
