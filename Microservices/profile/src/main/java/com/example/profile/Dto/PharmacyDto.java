package com.example.profile.Dto;

import com.example.profile.Models.Pharmacy;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PharmacyDto {
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
    // private List<MedicineDto> medicines;

    // @OneToMany(mappedBy = "pharmacy")
    // private List<PrescriptionDto> prescriptions;

    public Pharmacy toEntity() {
        Pharmacy pharmacy = new Pharmacy();
        pharmacy.setId(this.id);
        pharmacy.setName(this.name);
        pharmacy.setLicenseNumber(this.licenseNumber);
        pharmacy.setPhone(this.phone);
        pharmacy.setEmail(this.email);
        pharmacy.setAddress(this.address);
        pharmacy.setCity(this.city);
        pharmacy.setProvince(this.province);
        pharmacy.setPostalCode(this.postalCode);
        pharmacy.setOwnerName(this.ownerName);
        pharmacy.setPharmacistInCharge(this.pharmacistInCharge);
        pharmacy.setActive(this.active);
        return pharmacy;
    }
}
