package com.example.chatserver.Dto;

import lombok.Data;

@Data
public class CreateQuestionDto {
    private Long patientId;
    private String title;
    private String description;
    private String specialty;
}
