package com.example.profile.Service;

import com.example.profile.Dto.DoctorDto;
import com.example.profile.Exception.PrException;

public interface DoctorService {
    public Long addDoctor(DoctorDto doctor) throws PrException;
    public DoctorDto getDoctorById(Long id) throws PrException;
}
