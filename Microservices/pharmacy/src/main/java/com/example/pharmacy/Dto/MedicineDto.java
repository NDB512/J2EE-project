package com.example.pharmacy.Dto;

import java.time.LocalDateTime;

import com.example.pharmacy.Model.Medicine;
import com.example.pharmacy.Model.MedicineCategory;
import com.example.pharmacy.Model.MedicineType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineDto {
    private Long id;
    private String name;
    private String dosage;
    private MedicineCategory category;
    private MedicineType type;
    private String manufacturer;
    private Integer unitPrice;
    private LocalDateTime createdAt;
    private Integer stock;

    public Medicine toEntity() {
        Medicine medicine = new Medicine();
        medicine.setId(this.id);
        medicine.setName(this.name);
        medicine.setDosage(this.dosage);
        medicine.setCategory(this.category);
        medicine.setType(this.type);
        medicine.setManufacturer(this.manufacturer);
        medicine.setUnitPrice(this.unitPrice);
        medicine.setCreatedAt(this.createdAt != null ? this.createdAt : LocalDateTime.now());
        medicine.setStock(stock);
        return medicine;
    }
    
}
