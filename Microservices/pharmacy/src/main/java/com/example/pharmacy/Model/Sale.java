package com.example.pharmacy.Model;

import java.time.LocalDateTime;

import com.example.pharmacy.Dto.SaleDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long prescriptionId;
    private LocalDateTime saleDate;
    private Double totalAmount;

    public SaleDto toDto() {
        SaleDto dto = new SaleDto();
        dto.setId(id);
        dto.setPrescriptionId(prescriptionId);
        dto.setSaleDate(saleDate);
        dto.setTotalAmount(totalAmount);
        return dto;
    }

    public Sale(Long saleId) {
        this.id = saleId;
    }
}
