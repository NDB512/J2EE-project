package com.example.pharmacy.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicineDropdownDto {
    private Long id;
    private String name;
    private String type;
    private Integer unitPrice;
    private String dosage;
}
