package com.example.profile.Service.Impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.profile.Dto.AddMemberFamilyDto;
import com.example.profile.Dto.FamilyDto;
import com.example.profile.Dto.PatientDto;
import com.example.profile.Exception.PrException;
import com.example.profile.Models.Family;
import com.example.profile.Models.Patient;
import com.example.profile.Repository.FamilyRepository;
import com.example.profile.Repository.PatientRepository;
import com.example.profile.Service.FamilyService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FamilyServiceImpl implements FamilyService {

    private final FamilyRepository familyRepository;
    private final PatientRepository patientRepository;

    /**
     * Tạo mới hồ sơ gia đình, tự động gán người tạo làm "Head"
     */
    @Override
    public Long addFamily(FamilyDto familyDto, Long creatorId) throws PrException {
        // Tạo mới hồ sơ gia đình
        Family family = new Family();
        family.setFamilyName(familyDto.getFamilyName());
        family.setFamilyAddress(familyDto.getFamilyAddress());
        family.setHeadOfFamily(familyDto.getHeadOfFamily());
        family.setCreatedAt(LocalDateTime.now());
        family.setCreatorId(creatorId);
        family.setMemberCount(1); // người tạo là thành viên đầu tiên

        Family savedFamily = familyRepository.save(family);

        // Gán vai trò cho người tạo
        Patient creator = patientRepository.findById(creatorId)
            .orElseThrow(() -> new PrException("Người tạo không tồn tại trong hệ thống bệnh nhân."));

        creator.setFamily(savedFamily);
        creator.setRoleInFamily("Head");
        patientRepository.save(creator);

        return savedFamily.getId();
    }

    /**
     * Lấy thông tin hồ sơ gia đình
     */
    @Override
    public FamilyDto getFamilyById(Long id) throws PrException {
        Family family = familyRepository.findById(id)
                .orElseThrow(() -> new PrException("Hồ sơ gia đình ID " + id + " không tìm thấy."));
        return family.toDto();
    }

    /**
     * Cập nhật thông tin gia đình
     */
    @Override
    public FamilyDto updateFamily(Long id, FamilyDto familyDto) throws PrException {
        Family family = familyRepository.findById(id)
                .orElseThrow(() -> new PrException("Hồ sơ gia đình ID " + id + " không tìm thấy."));
        family.setFamilyName(familyDto.getFamilyName());
        family.setFamilyAddress(familyDto.getFamilyAddress());
        family.setHeadOfFamily(familyDto.getHeadOfFamily());
        family.setUpdatedAt(LocalDateTime.now());
        return familyRepository.save(family).toDto();
    }

    /**
     * Lấy tất cả hồ sơ gia đình
     */
    @Override
    public List<FamilyDto> getAllFamilies() throws PrException {
        return familyRepository.findAll().stream()
                .map(Family::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách thành viên trong 1 gia đình
     */
    @Override
    public List<PatientDto> getPatientsByFamilyId(Long familyId) throws PrException {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new PrException("Gia đình ID " + familyId + " không tồn tại."));
        return family.getPatients().stream()
                .map(Patient::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Xóa hồ sơ gia đình
     */
    @Override
    public void deleteFamily(Long id, Long requesterId, String requesterRole) throws PrException {
        Family family = familyRepository.findById(id)
                .orElseThrow(() -> new PrException("Hồ sơ gia đình ID " + id + " không tìm thấy."));

        // Nếu không phải người tạo và không phải admin => chặn
        if (!family.getCreatorId().equals(requesterId) && 
            (requesterRole == null || !requesterRole.equalsIgnoreCase("ADMIN"))) {
            throw new PrException("Chỉ người tạo hoặc quản trị viên mới được phép xóa hồ sơ gia đình này.");
        }

        familyRepository.delete(family);
    }


    /**
     * Xóa 1 thành viên ra khỏi gia đình
     */
    @Override
    public void deleteFamilyMember(Long familyId, Long patientId) throws PrException {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new PrException("Hồ sơ gia đình ID " + familyId + " không tìm thấy."));
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new PrException("Bệnh nhân ID " + patientId + " không tìm thấy."));

        family.removePatient(patient);
        patient.setFamily(null);
        patient.setRoleInFamily(null);
        patientRepository.save(patient);
        familyRepository.save(family);
    }

    /**
     * Thêm 1 thành viên mới vào gia đình
     */
    @Override
    public void addMemberToFamily(AddMemberFamilyDto dto) throws PrException {
        Family family = familyRepository.findById(dto.getFamilyId())
                .orElseThrow(() -> new PrException("Gia đình ID " + dto.getFamilyId() + " không tồn tại."));

        Patient member = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new PrException("Bệnh nhân ID " + dto.getPatientId() + " không tồn tại."));

        if (member.getFamily() != null && !member.getFamily().getId().equals(dto.getFamilyId())) {
            throw new PrException("Bệnh nhân này đã thuộc về một gia đình khác.");
        }

        member.setFamily(family);
        member.setRoleInFamily(dto.getRoleInFamily() != null ? dto.getRoleInFamily() : "Member");
        patientRepository.save(member);

        // Cập nhật số lượng thành viên
        family.addPatient(member);
        familyRepository.save(family);
    }
}
