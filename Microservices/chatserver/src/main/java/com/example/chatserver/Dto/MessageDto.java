package com.example.chatserver.Dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDto {
    private Long id;
    private String roomId;

    private Long senderId;
    private String senderRole;

    private Long receiverId;
    private String content;
    private LocalDateTime timestamp;
}