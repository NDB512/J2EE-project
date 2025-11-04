package com.example.profile.Service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.profile.Dto.PharmacyDto;
import com.example.profile.Exception.PrException;
import com.example.profile.Repository.PharmacyRepository;
import com.example.profile.Service.PharmacyService;

@Service
public class PharmacyServiceImpl implements PharmacyService {
    @Autowired
    private PharmacyRepository pharmacyRepository;

    @Override
    public Long addPharmacy(PharmacyDto pharmacy) throws PrException {
        if(pharmacy == null) {
            throw new PrException("Pharmacy data cannot be null.");
        }
        if(pharmacy.getEmail()!=null && pharmacyRepository.findByEmail(pharmacy.getEmail()).isPresent()) {
            throw new PrException("Pharmacy with ID " + pharmacy.getId() + " already exists.");
        }
        if(pharmacy.getLicenseNumber()!=null && pharmacyRepository.findByLicenseNumber(pharmacy.getLicenseNumber()).isPresent()) {
            throw new PrException("Pharmacy with License Number " + pharmacy.getLicenseNumber() + " already exists.");
        }

        var entity = pharmacy.toEntity();
        if(entity == null) {
            throw new PrException("Failed to convert pharmacy data to entity.");
        }
        return pharmacyRepository.save(entity).getId();
    }

    @SuppressWarnings("null")
    @Override
    public PharmacyDto getPharmacyById(Long id) throws PrException {
        return pharmacyRepository.findById(id)
                .orElseThrow(() -> new PrException("Pharmacy with ID " + id + " not found."))
                .toDto();
    }
    @SuppressWarnings("null")
    @Override
    public PharmacyDto updatePharmacy(Long id, PharmacyDto pharmacy) throws PrException {
        pharmacyRepository.findById(id)
                .orElseThrow(() -> new PrException("Pharmacy with ID " + id + " not found."))
                .toDto();

        return pharmacyRepository.save(pharmacy.toEntity()).toDto();
    }

    @SuppressWarnings("null")
    @Override
    public Boolean pharmacyExists(Long id) {
        return pharmacyRepository.existsById(id);
    }
}