package com.example.profile.Service;

import java.util.List;

import com.example.profile.Dto.PatientDropdown;
import com.example.profile.Dto.PatientDto;
import com.example.profile.Exception.PrException;

public interface PatientService {
    public Long addPaient(PatientDto patient) throws PrException;
    public PatientDto getPatientById(Long id) throws PrException;
    public PatientDto updatePatient(Long id, PatientDto patient) throws PrException;
    public Boolean patientExists(Long id);
    List<PatientDropdown> getPatientsById(List<Long> ids) throws PrException;
}
