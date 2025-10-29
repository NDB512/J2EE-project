package com.example.pharmacy.Dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.pharmacy.Model.Sale;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDto {
    private Long id;
    private Long prescriptionId;
    private String buyerName;
    private String buyerContact;
    private LocalDateTime saleDate;
    private Double totalAmount;

    private List<SaleItemDto> saleItems;
    
     public Sale toEntity() {
        Sale sale = new Sale();
        sale.setId(id);
        sale.setPrescriptionId(prescriptionId);
        sale.setBuyerName(buyerName);
        sale.setBuyerContact(buyerContact);
        sale.setSaleDate(saleDate != null ? saleDate : LocalDateTime.now());
        sale.setTotalAmount(totalAmount);
        return sale;
    }
}
