package com.example.profile.Service;

import java.util.List;

import com.example.profile.Dto.AddMemberFamilyDto;
import com.example.profile.Dto.FamilyDto;
import com.example.profile.Dto.FamilyMemberList;
import com.example.profile.Dto.PatientDto;
import com.example.profile.Exception.PrException;

public interface FamilyService {
    public Long addFamily(FamilyDto familyDto) throws PrException;
    public FamilyDto getFamilyById(Long id) throws PrException;
    public FamilyDto updateFamily(Long id, FamilyDto familyDto) throws PrException;
    public List<FamilyDto> getAllFamilies() throws PrException;
    public List<FamilyMemberList> getPatientsByFamilyId(Long familyId) throws PrException;
    public void deleteFamily(Long id, Long requesterId, String requesterRole) throws PrException;
    public void deleteFamilyMember(Long familyId, Long patientId) throws PrException;
    public void addMemberToFamily(AddMemberFamilyDto dto) throws PrException;
}