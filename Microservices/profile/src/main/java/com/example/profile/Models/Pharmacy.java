package com.example.profile.Models;

import com.example.profile.Dto.PharmacyDto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Thông tin cơ bản
    private String name;              // Tên nhà thuốc
    private String licenseNumber;     // Mã giấy phép kinh doanh
    private String phone;
    private String email;

    // Địa chỉ
    private String address;
    private String city;
    private String province;
    private String postalCode;

    // Chủ sở hữu / Người quản lý
    private String ownerName;
    private String pharmacistInCharge; // Người phụ trách chuyên môn

    // Trạng thái hoạt động
    private boolean active = true;

    // Quan hệ (mở rộng)
    // @OneToMany(mappedBy = "pharmacy")
    // private List<Medicine> medicines;

    // @OneToMany(mappedBy = "pharmacy")
    // private List<Prescription> prescriptions;

    public PharmacyDto toDto() {
        PharmacyDto dto = new PharmacyDto();
        dto.setId(this.id);
        dto.setName(this.name);
        dto.setLicenseNumber(this.licenseNumber);
        dto.setPhone(this.phone);
        dto.setEmail(this.email);
        dto.setAddress(this.address);
        dto.setCity(this.city);
        dto.setProvince(this.province);
        dto.setPostalCode(this.postalCode);
        dto.setOwnerName(this.ownerName);
        dto.setPharmacistInCharge(this.pharmacistInCharge);
        dto.setActive(this.active);
        return dto;
    }
}
