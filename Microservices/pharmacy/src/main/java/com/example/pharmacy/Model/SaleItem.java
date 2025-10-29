package com.example.pharmacy.Model;

import com.example.pharmacy.Dto.SaleItemDto;

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
public class SaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    private String batchNo; //Số lô sản xuất
    private Integer quantity;
    private Double unitPrice;

    public SaleItemDto toDto() {
        return new SaleItemDto(
            id,
            sale != null ? sale.getId() : null,
            medicine != null ? medicine.getId() : null ,
            batchNo,
            quantity,
            unitPrice
        );
    }
}
