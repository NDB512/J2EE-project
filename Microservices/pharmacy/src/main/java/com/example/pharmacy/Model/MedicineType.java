package com.example.pharmacy.Model;

public enum MedicineType {
    TABLET("Viên nén"),
    CAPSULE("Viên nang"),
    SYRUP("Siro"),
    INJECTION("Thuốc tiêm"),
    CREAM("Kem bôi"),
    OINTMENT("Thuốc mỡ"),
    GEL("Gel bôi"),
    DROPS("Thuốc nhỏ"),
    SPRAY("Thuốc xịt"),
    POWDER("Bột"),
    SUPPOSITORY("Viên đặt"),
    PATCH("Miếng dán"),
    SOLUTION("Dung dịch"),
    SUSPENSION("Hỗn dịch"),
    INHALER("Thuốc hít"),
    LOZENGE("Viên ngậm");

    private final String label;

    MedicineType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}