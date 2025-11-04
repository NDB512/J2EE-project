package com.example.profile.Service.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.profile.Dto.DoctorDropdown;
import com.example.profile.Dto.DoctorDto;
import com.example.profile.Exception.PrException;
import com.example.profile.Models.Doctor;

@Service
public class DoctorServiceImpl implements com.example.profile.Service.DoctorService {

    @Autowired
    private com.example.profile.Repository.DoctorRepository doctorRepository;

    @SuppressWarnings("null")
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

    @SuppressWarnings("null")
    @Override
    public DoctorDto getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new PrException("Doctor with ID " + id + " not found."))
                .toDto();
    }

    @SuppressWarnings("null")
    @Override
    public DoctorDto updateDoctor(Long id, DoctorDto doctor) throws PrException {
        doctorRepository.findById(id)
                .orElseThrow(() -> new PrException("Doctor with ID " + id + " not found."))
                .toDto();

        return doctorRepository.save(doctor.toEntity()).toDto();
    }

    @SuppressWarnings("null")
    @Override
    public Boolean doctorExists(Long id) {
        return doctorRepository.existsById(id);
    }

    @Override
    public List<DoctorDropdown> getDoctorDropdowns() throws PrException{
        return doctorRepository.findAllDoctorDropdowns();
    }

    @Override
    public List<DoctorDropdown> getDoctorsById(List<Long> ids) throws PrException {
        return doctorRepository.findAllDoctorDropdownsByIds(ids);
    }

    @Override
    public List<DoctorDto> getAllDoctors() throws PrException {
        return ((List<Doctor>)doctorRepository.findAll()).stream().map(Doctor::toDto).toList();
    }
    
}
