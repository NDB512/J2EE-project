package com.example.profile.Service;

import com.example.profile.Dto.PharmacyDto;
import com.example.profile.Exception.PrException;

public interface PharmacyService {
    public Long addPharmacy(PharmacyDto pharmacy) throws PrException;
    public PharmacyDto getPharmacyById(Long id) throws PrException;
    public PharmacyDto updatePharmacy(Long id, PharmacyDto pharmacy) throws PrException;
    public Boolean pharmacyExists(Long id);
}
