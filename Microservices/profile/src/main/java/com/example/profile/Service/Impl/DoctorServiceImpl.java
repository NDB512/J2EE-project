package com.example.profile.Service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.profile.Dto.DoctorDto;
import com.example.profile.Exception.PrException;

@Service
public class DoctorServiceImpl implements com.example.profile.Service.DoctorService {

    @Autowired
    private com.example.profile.Repository.DoctorRepository doctorRepository;

    @Override
    public Long addDoctor(DoctorDto doctor) throws PrException {
        if(doctor.getEmail()!=null && doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
            throw new PrException("Doctor with ID " + doctor.getId() + " already exists.");
        }
        if(doctor.getLicenseNumber()!=null && doctorRepository.findByLicenseNumber(doctor.getLicenseNumber()).isPresent()) {
            throw new PrException("Doctor with License Number " + doctor.getLicenseNumber() + " already exists.");
        }
        return doctorRepository.save(doctor.toEntity()).getId();
    }

    @Override
    public DoctorDto getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new PrException("Doctor with ID " + id + " not found."))
                .toDto();
    }
    
}
