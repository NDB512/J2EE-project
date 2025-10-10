package com.example.profile.Models;

import com.example.profile.Dto.DoctorDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Doctor {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    //private Long userId; // ID của user trong AuthService (nếu cần đồng bộ

    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private String address;

    // Thông tin chuyên môn
    private String specialization; // Ví dụ: "Nội tổng quát", "Nhi khoa", "Tim mạch", v.v.
    private String qualification;  // Bằng cấp: "BS", "ThS", "TS", "PGS.TS", ...
    private Integer yearsOfExperience;

    // Thông tin bệnh viện / cơ sở làm việc
    private String hospitalName;
    private String department;

    // Thông tin hệ thống
    private String citizenId; // Số CCCD
    private String licenseNumber; // Mã hành nghề y
    private boolean active = true; // Còn hành nghề không

    public DoctorDto toDto() {
        DoctorDto dto = new DoctorDto();
        dto.setId(this.id);
        //dto.setUserId(this.userId);
        dto.setFullName(this.fullName);
        dto.setEmail(this.email);
        dto.setPhone(this.phone);
        dto.setGender(this.gender);
        dto.setAddress(this.address);
        dto.setSpecialization(this.specialization);
        dto.setQualification(this.qualification);
        dto.setYearsOfExperience(this.yearsOfExperience);
        dto.setHospitalName(this.hospitalName);
        dto.setDepartment(this.department);
        dto.setCitizenId(this.citizenId);
        dto.setLicenseNumber(this.licenseNumber);
        dto.setActive(this.active);
        return dto;
    }
}
