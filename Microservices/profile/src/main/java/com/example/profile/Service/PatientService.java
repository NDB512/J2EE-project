package com.example.profile.Service;

import com.example.profile.Dto.PatientDto;
import com.example.profile.Exception.PrException;

public interface PatientService {
    public Long addPaient(PatientDto patient) throws PrException;
    public PatientDto getPatientById(Long id) throws PrException;

}
