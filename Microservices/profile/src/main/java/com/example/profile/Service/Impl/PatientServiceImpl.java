package com.example.profile.Service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.profile.Dto.PatientDto;
import com.example.profile.Exception.PrException;
import com.example.profile.Repository.PatientRepository;
import com.example.profile.Service.PatientService;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public Long addPaient(PatientDto patient) throws PrException {
        if(patient.getEmail()!=null && patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            throw new PrException("Patient with ID " + patient.getId() + " already exists.");
        }
        if(patient.getCitizenId()!=null && patientRepository.findByCitizenId(patient.getCitizenId()).isPresent()) {
            throw new PrException("Patient with Citizen ID " + patient.getCitizenId() + " already exists.");
        }

        return patientRepository.save(patient.toEntity()).getId();
    }

    @Override
    public PatientDto getPatientById(Long id) throws PrException {
        return patientRepository.findById(id)
                .orElseThrow(() -> new PrException("Patient with ID " + id + " not found."))
                .toDto();
    }

    
}