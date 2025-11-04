package com.example.pharmacy.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalePrescription {

    private Long id;
    private Long medicineId;
    private Integer quantity;
    private Double totalAmount;

}