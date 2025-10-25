package com.example.pharmacy.Model;

public enum MedicineCategory {
    ANALGESIC("Giảm đau"),
    ANTIPYRETIC("Hạ sốt"),
    ANTIBIOTIC("Kháng sinh"),
    ANTIVIRAL("Kháng virus"),
    ANTIFUNGAL("Kháng nấm"),
    ANTIINFLAMMATORY("Chống viêm"),
    ANTIHISTAMINE("Chống dị ứng"),
    ANTIHYPERTENSIVE("Hạ huyết áp"),
    ANTIDIABETIC("Hạ đường huyết"),
    ANTACID("Trung hòa axit dạ dày"),
    ANTICOAGULANT("Chống đông máu"),
    ANTIDEPRESSANT("Chống trầm cảm"),
    ANTICONVULSANT("Chống co giật"),
    BRONCHODILATOR("Giãn phế quản"),
    DIURETIC("Lợi tiểu"),
    VITAMIN("Vitamin / Khoáng chất"),
    VACCINE("Vaccine"),
    HORMONE("Hormone"),
    SEDATIVE("An thần"),
    STEROID("Corticosteroid");

    private final String label;

    MedicineCategory(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
