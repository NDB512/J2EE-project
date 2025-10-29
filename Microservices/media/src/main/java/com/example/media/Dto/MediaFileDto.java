package com.example.media.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaFileDto {
    private Long id;

    private String name;

    private String type;

    private Long size;
}
