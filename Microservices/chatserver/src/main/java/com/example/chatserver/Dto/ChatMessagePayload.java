package com.example.chatserver.Dto;

import lombok.Data;

@Data
public class ChatMessagePayload {
    private String senderId;
    private String senderRole;
    private String receiverId;
    private String roomId;
    private String content;
}