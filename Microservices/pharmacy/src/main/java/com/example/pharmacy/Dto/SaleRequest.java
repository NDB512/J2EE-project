package com.example.pharmacy.Dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SaleRequest {
    private Long id;
    private LocalDateTime saleDate;
    private String buyerName;
    private String buyerContact;
    private Double totalAmount;
}
