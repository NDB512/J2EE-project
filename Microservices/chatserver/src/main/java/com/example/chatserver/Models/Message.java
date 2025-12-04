package com.example.chatserver.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long senderId;  // User/Doctor ID
    private String senderRole;  // "USER" or "DOCTOR"
    private Long receiverId;
    private String roomId;
    private String content;
    private LocalDateTime timestamp = LocalDateTime.now();  
}