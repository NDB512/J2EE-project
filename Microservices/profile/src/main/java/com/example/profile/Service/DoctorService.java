package com.example.profile.Service;

import java.util.List;

import com.example.profile.Dto.DoctorDropdown;
import com.example.profile.Dto.DoctorDto;
import com.example.profile.Exception.PrException;

public interface DoctorService {
    public Long addDoctor(DoctorDto doctor) throws PrException;
    public DoctorDto getDoctorById(Long id) throws PrException;
    public DoctorDto updateDoctor(Long id, DoctorDto doctor) throws PrException;
    public Boolean doctorExists(Long id);
    List<DoctorDropdown> getDoctorDropdowns() throws PrException;
    List<DoctorDropdown> getDoctorsById(List<Long> ids) throws PrException;
}
