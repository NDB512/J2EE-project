package com.example.profile.Api;

import com.example.profile.Dto.AddMemberFamilyDto;
import com.example.profile.Dto.FamilyDto;
import com.example.profile.Dto.FamilyMemberList;
import com.example.profile.Dto.UpdateMemberRoleDto;
import com.example.profile.Exception.PrException;
import com.example.profile.Service.FamilyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profile/family")
@RequiredArgsConstructor
public class FamilyApi {

    private final FamilyService familyService;

    /**
     * Tạo mới hồ sơ gia đình
     */
    @PostMapping("/create/{creatorId}")
    public ResponseEntity<Long> addFamily(
            @RequestBody FamilyDto familyDto,
            @PathVariable Long creatorId) throws PrException {
        return ResponseEntity.ok(familyService.addFamily(familyDto));
    }

    /**
     * Lấy thông tin 1 gia đình
     */
    @GetMapping("/{id}")
    public ResponseEntity<FamilyDto> getFamilyById(@PathVariable Long id) throws PrException {
        return ResponseEntity.ok(familyService.getFamilyById(id));
    }

    /**
     * Cập nhật gia đình
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<FamilyDto> updateFamily(
            @PathVariable Long id,
            @RequestBody FamilyDto familyDto) throws PrException {
        return ResponseEntity.ok(familyService.updateFamily(id, familyDto));
    }

    /**
     * Lấy danh sách tất cả hồ sơ gia đình
     */
    @GetMapping
    public ResponseEntity<List<FamilyDto>> getAllFamilies() throws PrException {
        return ResponseEntity.ok(familyService.getAllFamilies());
    }

    /**
     * Lấy danh sách thành viên của gia đình
     */
    @GetMapping("/{familyId}/members")
    public ResponseEntity<List<FamilyMemberList>> getPatientsByFamilyId(@PathVariable Long familyId) throws PrException {
        return ResponseEntity.ok(familyService.getPatientsByFamilyId(familyId));
    }

    /**
     * Xóa hồ sơ gia đình (chỉ cho người tạo hoặc admin)
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFamily(
            @PathVariable Long id,
            @RequestParam Long requesterId,
            @RequestParam(required = false) String requesterRole) throws PrException {
        familyService.deleteFamily(id, requesterId, requesterRole);
        return ResponseEntity.ok("Xóa hồ sơ gia đình thành công.");
    }

    /**
     * Xóa 1 thành viên khỏi gia đình
     */
    @DeleteMapping("/{familyId}/member/{patientId}")
    public ResponseEntity<String> deleteMember(
            @PathVariable Long familyId,
            @PathVariable Long patientId) throws PrException {
        familyService.deleteFamilyMember(familyId, patientId);
        return ResponseEntity.ok("Đã xóa thành viên khỏi gia đình.");
    }

    /**
     * Thêm 1 thành viên vào gia đình
     */
    @PostMapping("/add-member")
    public ResponseEntity<String> addMember(@RequestBody AddMemberFamilyDto dto) throws PrException {
        familyService.addMemberToFamily(dto);
        return ResponseEntity.ok("Thêm thành viên vào gia đình thành công.");
    }

    @PutMapping("/{familyId}/members/role")
    public ResponseEntity<?> updateMemberRole(
            @PathVariable Long familyId,
            @Valid @RequestBody UpdateMemberRoleDto dto) {
        try {
            familyService.updateMemberRole(familyId, dto);
            return ResponseEntity.ok("Cập nhật vai trò thành công");
        } catch (PrException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
