package com.example.profile.Dto;

import java.time.LocalDate;

import com.example.profile.Models.Doctor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DoctorDto {
    private Long id;
    
    private String name;
    private String email;
    private String phone;
    private String gender;
    private String address;
    private LocalDate dateOfBirth;

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

    public Doctor toEntity() {
        Doctor doctor = new Doctor();
        doctor.setId(this.id);
        doctor.setName(this.name);
        doctor.setEmail(this.email);
        doctor.setPhone(this.phone);
        doctor.setGender(this.gender);
        doctor.setDateOfBirth(dateOfBirth);
        doctor.setAddress(this.address);
        doctor.setSpecialization(this.specialization);
        doctor.setQualification(this.qualification);
        doctor.setYearsOfExperience(this.yearsOfExperience);
        doctor.setHospitalName(this.hospitalName);
        doctor.setDepartment(this.department);
        doctor.setCitizenId(this.citizenId);
        doctor.setLicenseNumber(this.licenseNumber);
        doctor.setActive(this.active);
        return doctor;
    }
}
