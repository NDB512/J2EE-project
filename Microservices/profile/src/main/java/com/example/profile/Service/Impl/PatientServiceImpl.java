package com.example.profile.Service.Impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.profile.Dto.PatientDropdown;
import com.example.profile.Dto.PatientDto;
import com.example.profile.Exception.PrException;
import com.example.profile.Models.Patient;
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

        patient.setCreatedAt(LocalDateTime.now());

        return patientRepository.save(patient.toEntity()).getId();
    }

    @Override
    public PatientDto getPatientById(Long id) throws PrException {
        return patientRepository.findById(id)
                .orElseThrow(() -> new PrException("Patient with ID " + id + " not found."))
                .toDto();
    }

    @Override
    public PatientDto updatePatient(Long id, PatientDto patient) throws PrException {
        patientRepository.findById(id)
                .orElseThrow(() -> new PrException("Patient with ID " + id + " not found."))
                .toDto();
        
        patient.setUpdatedAt(LocalDateTime.now());

        return patientRepository.save(patient.toEntity()).toDto();
    }

    @Override
    public Boolean patientExists(Long id) {
        return patientRepository.existsById(id);
    }

    @Override
    public List<PatientDropdown> getPatientsById(List<Long> ids) throws PrException {
        return patientRepository.findAllPatientDropdownByIds(ids);
    }

    @Override
    public List<PatientDto> getAllPatients() throws PrException {
        return ((List<Patient>)patientRepository.findAll()).stream().map(Patient::toDto).toList();
    }
}