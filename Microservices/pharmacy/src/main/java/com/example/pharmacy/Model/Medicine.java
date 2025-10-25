package com.example.pharmacy.Model;

import java.time.LocalDateTime;

import com.example.pharmacy.Dto.MedicineDto;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
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

    private String name;
    private String dosage; // Liều lượng (ví dụ: 500mg)
    @Enumerated(EnumType.STRING)
    private MedicineCategory category;
    
    @Enumerated(EnumType.STRING)
    private MedicineType type;

    private String manufacturer; //Nhà sản xuất
    private Integer unitPrice;
    private LocalDateTime createdAt;

    private Integer stock;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public MedicineDto toDto() {
        return new MedicineDto(
            id,
            name,
            dosage,
            category,
            type,
            manufacturer,
            unitPrice,
            createdAt,
            stock
        );
    }

    public Medicine(Long medicineId) {
        this.id = medicineId;
    }
}
