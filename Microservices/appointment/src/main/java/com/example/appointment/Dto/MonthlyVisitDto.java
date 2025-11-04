package com.example.appointment.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyVisitDto {
    private Integer year;
    private String month;
    private Long visitCount;
}