package com.example.appointment.Models;

import com.example.appointment.Dto.MedicineDto;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;         // Tên thuốc
    private Long medicineId;
    private String dosage;       // Liều lượng (ví dụ: 500mg)
    private String frequency;    // Số lần dùng (ví dụ: 2 lần/ngày)
    private Integer duration;    // Số ngày dùng
    private String route;        // Đường dùng (uống, tiêm, bôi, v.v.)
    private String type;         // Dạng thuốc (viên, siro, ống tiêm, v.v.)
    private String instruction;  // Hướng dẫn thêm (trước ăn, sau ăn, v.v.)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    private Prescription prescription; // Đơn thuốc mà thuốc này thuộc về

    public MedicineDto toDto() {
        MedicineDto dto = new MedicineDto();
        dto.setId(id);
        dto.setName(name);
        dto.setMedicineId(medicineId);
        dto.setDosage(dosage);
        dto.setFrequency(frequency);
        dto.setDuration(duration);
        dto.setRoute(route);
        dto.setType(type);
        dto.setInstruction(instruction);
        dto.setPrescriptionId(prescription.getId());
        return dto;
    }
}
