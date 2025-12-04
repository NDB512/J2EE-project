package com.example.profile.Service.Impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.profile.Dto.AddMemberFamilyDto;
import com.example.profile.Dto.FamilyDto;
import com.example.profile.Dto.FamilyMemberList;
import com.example.profile.Dto.UpdateMemberRoleDto;
import com.example.profile.Exception.PrException;
import com.example.profile.Models.Family;
import com.example.profile.Models.Patient;
import com.example.profile.Repository.FamilyRepository;
import com.example.profile.Repository.PatientRepository;
import com.example.profile.Service.FamilyService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FamilyServiceImpl implements FamilyService {

    private final FamilyRepository familyRepository;
    private final PatientRepository patientRepository;

    /**
     * Tạo mới hồ sơ gia đình, tự động gán người tạo làm "Head"
     */
    @Override
    @Transactional
    public Long addFamily(FamilyDto familyDto) throws PrException {
        // Tạo mới hồ sơ gia đình
        Family family = new Family();
        family.setFamilyName(familyDto.getFamilyName());
        family.setFamilyAddress(familyDto.getFamilyAddress());
        family.setHeadOfFamily(familyDto.getHeadOfFamily());
        family.setCreatedAt(LocalDateTime.now());
        family.setCreatorId(familyDto.getCreatorId());
        family.setMemberCount(1); // người tạo là thành viên đầu tiên
        Family savedFamily = familyRepository.save(family);

        // Gán vai trò cho người tạo
        Long creatorId = Objects.requireNonNull(familyDto.getCreatorId(), "CreatorId không được null");
        Patient creator = patientRepository.findById(creatorId)
            .orElseThrow(() -> new PrException("Người tạo không tồn tại trong hệ thống bệnh nhân."));

        creator.setFamily(savedFamily);
        creator.setRoleInFamily("Head");
        creator.setIsDependent(false);  // Head luôn independent
        patientRepository.save(creator);

        return savedFamily.getId();
    }

    /**
     * Lấy thông tin gia đình theo ID
     */
    @Override
    public FamilyDto getFamilyById(Long id) throws PrException {
        Objects.requireNonNull(id, "id không được null");
        Family family = familyRepository.findById(id)
                .orElseThrow(() -> new PrException("Hồ sơ gia đình ID " + id + " không tìm thấy."));
        return family.toDto();
    }

    /**
     * Cập nhật thông tin gia đình
     */
    @Override
    @Transactional
    public FamilyDto updateFamily(Long id, FamilyDto familyDto) throws PrException {
        Objects.requireNonNull(id, "id không được null");
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
    public List<FamilyMemberList> getPatientsByFamilyId(Long familyId) throws PrException {
        Objects.requireNonNull(familyId, "familyId không được null");
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new PrException("Gia đình ID " + familyId + " không tồn tại."));
        return family.getPatients().stream()
                .map(patient -> {
                    FamilyMemberList dto = new FamilyMemberList();
                    dto.setId(patient.getId());
                    dto.setName(patient.getName());
                    dto.setEmail(patient.getEmail());
                    dto.setFamilyId(family.getId());
                    dto.setRoleInFamily(patient.getRoleInFamily());
                    dto.setPhone(patient.getPhone());
                    dto.setIsDependent(patient.getIsDependent());  // Include isDependent cho frontend
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Xóa hồ sơ gia đình
     */
    @Override
    @Transactional
    public void deleteFamily(Long id, Long requesterId, String requesterRole) throws PrException {
        Objects.requireNonNull(id, "id không được null");
        Family family = familyRepository.findById(id)
                .orElseThrow(() -> new PrException("Hồ sơ gia đình ID " + id + " không tìm thấy."));

        // Nếu không phải người tạo và không phải admin => chặn
        if (!family.getCreatorId().equals(requesterId) && 
            (requesterRole == null || !requesterRole.equalsIgnoreCase("ADMIN"))) {
            throw new PrException("Chỉ người tạo hoặc quản trị viên mới được phép xóa hồ sơ gia đình này.");
        }

        // Xóa liên kết với patients trước khi delete family
        family.getPatients().forEach(patient -> {
            patient.setFamily(null);
            patient.setRoleInFamily(null);
            patientRepository.save(patient);
        });

        familyRepository.delete(family);
    }

    /**
     * Xóa 1 thành viên ra khỏi gia đình
     */
    @Override
    @Transactional
    public void deleteFamilyMember(Long familyId, Long patientId) throws PrException {
        Objects.requireNonNull(familyId, "familyId không được null");
        Objects.requireNonNull(patientId, "patientId không được null");
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new PrException("Hồ sơ gia đình ID " + familyId + " không tìm thấy."));
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new PrException("Bệnh nhân ID " + patientId + " không tìm thấy."));

        // Validate quyền: Chỉ head hoặc admin (thêm param requesterId nếu cần từ Api)
        // TODO: Inject SecurityContext hoặc thêm param

        family.removePatient(patient);
        patient.setFamily(null);
        patient.setRoleInFamily(null);
        patientRepository.save(patient);
        familyRepository.save(family);
    }

    /**
     * Thêm 1 thành viên mới vào gia đình (hỗ trợ dependent và independent)
     */
    @Override
    @Transactional
    public void addMemberToFamily(AddMemberFamilyDto dto) throws PrException {
        Objects.requireNonNull(dto.getFamilyId(), "familyId không được null");
        Family family = familyRepository.findById(dto.getFamilyId())
                .orElseThrow(() -> new PrException("Gia đình ID " + dto.getFamilyId() + " không tồn tại."));

        // 1. Validate quyền: Chỉ headOfFamily (creatorId) hoặc admin
        if (!isAuthorized(dto.getRequesterId(), dto.getRequesterRole(), family)) {
            throw new PrException("Không có quyền thêm thành viên (chỉ chủ hộ hoặc admin).");
        }

        // 2. Xử lý theo loại thành viên
        Patient patient;
        if (Boolean.TRUE.equals(dto.getIsDependent())) {
            // Dependent: Tạo profile mới (không cần existing ID)
            if (dto.getExistingPatientId() != null) {
                throw new PrException("Dependent không thể link với existing patient.");
            }
            validateDependentDto(dto);
            patient = createNewPatient(dto, family);
        } else {
            // Independent: Link existing hoặc tạo mới
            if (dto.getExistingPatientId() != null) {
                patient = linkExistingPatient(dto.getExistingPatientId(), family, dto);
            } else {
                validateIndependentDto(dto);
                patient = createNewPatient(dto, family);
            }
        }

        // 3. Add vào family và save (auto update memberCount)
        family.addPatient(patient);
        familyRepository.save(family);

        // 4. Optional: Gửi invite nếu independent (implement EmailService nếu cần)
        if (!Boolean.TRUE.equals(dto.getIsDependent()) && dto.getEmail() != null) {
            // sendInviteEmail(dto.getEmail(), family.getFamilyName());
        }
    }

    private boolean isAuthorized(Long requesterId, String requesterRole, Family family) {
        return requesterRole != null && requesterRole.equalsIgnoreCase("ADMIN") || 
               family.getCreatorId().equals(requesterId);  // Giả sử head = creator
    }

    private void validateDependentDto(AddMemberFamilyDto dto) throws PrException {
        if (dto.getEmail() != null) {
            throw new PrException("Dependent không cần email.");
        }
        if (dto.getName() == null || dto.getDateOfBirth() == null || dto.getRoleInFamily() == null) {
            throw new PrException("Dependent phải có tên, ngày sinh, và vai trò trong gia đình.");
        }
        // Check citizenId unique: if (patientRepository.existsByCitizenId(dto.getCitizenId())) throw ...
    }

    private void validateIndependentDto(AddMemberFamilyDto dto) throws PrException {
        if (dto.getEmail() == null) {
            throw new PrException("Independent phải có email để invite.");
        }
        // Check email unique: if (patientRepository.findByEmail(dto.getEmail()).isPresent()) throw ...
    }

    private Patient createNewPatient(AddMemberFamilyDto dto, Family family) {
        Patient patient = new Patient();
        patient.setName(dto.getName());
        patient.setPhone(dto.getPhone());
        patient.setAddress(dto.getAddress() != null ? dto.getAddress() : family.getFamilyAddress());  // Sync
        patient.setEmail(dto.getEmail());
        patient.setGender(dto.getGender());
        patient.setMedicalHistory(dto.getMedicalHistory());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setInsuranceDetails(dto.getInsuranceDetails());
        patient.setAllergies(dto.getAllergies());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setCitizenId(dto.getCitizenId());
        patient.setBloodType(dto.getBloodType());
        patient.setRoleInFamily(dto.getRoleInFamily() != null ? dto.getRoleInFamily() : "Member");
        patient.setIsDependent(dto.getIsDependent() != null ? dto.getIsDependent() : false);
        patient.setFamily(family);  // Set tạm, family.addPatient sẽ handle
        return patientRepository.save(patient);
    }

    private Patient linkExistingPatient(Long patientId, Family family, AddMemberFamilyDto dto) throws PrException {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new PrException("Patient không tồn tại: " + patientId));
        if (patient.getFamily() != null && !patient.getFamily().getId().equals(family.getId())) {
            throw new PrException("Patient đã thuộc gia đình khác.");
        }
        patient.setFamily(family);
        patient.setRoleInFamily(dto.getRoleInFamily() != null ? dto.getRoleInFamily() : "Member");
        return patientRepository.save(patient);
    }

    @Override
    @Transactional
    public void updateMemberRole(Long familyId, UpdateMemberRoleDto dto) throws PrException {
        Objects.requireNonNull(familyId, "familyId không được null");

        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new PrException("Gia đình ID " + familyId + " không tồn tại."));
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new PrException("Bệnh nhân ID " + dto.getPatientId() + " không tồn tại."));

        if (patient.getFamily() == null || !patient.getFamily().getId().equals(familyId)) {
            throw new PrException("Bệnh nhân không thuộc gia đình này.");
        }

        if (!isAuthorized(dto.getRequesterId(), dto.getRequesterRole(), family)) {
            throw new PrException("Bạn không có quyền cập nhật vai trò thành viên.");
        }

        patient.setRoleInFamily(dto.getRoleInFamily());
        patientRepository.save(patient);
    }
}