package com.example.pharmacy.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineListDto {
    private Long id;
    private String name;
    private Integer unitPrice;
    private Integer stock;
    private String dosage;
    private String manufacturer;
}
