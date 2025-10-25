package com.example.pharmacy.Model;

import java.time.LocalDate;

import com.example.pharmacy.Dto.MedicineInventoryDto;
import com.example.pharmacy.Dto.StockStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class MedicineInventory { //Tồn kho / nhập hàng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    private String batchNo; //Số lô sản xuất
    private Integer quantity;
    private LocalDate expiryDate;
    private LocalDate addDate;
    private Integer initialQuantity;
    @Enumerated(EnumType.STRING)
    private StockStatus stockStatus;

    public MedicineInventoryDto toDto() {
            return new MedicineInventoryDto(
            id,
            medicine.getId(),
            medicine.getName(),
            batchNo,
            quantity,
            expiryDate,
            addDate,
            initialQuantity,
            stockStatus
        );
    }
}
