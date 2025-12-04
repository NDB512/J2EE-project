package com.example.chatserver.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.chatserver.Models.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findByRoomIdOrderByTimestampAsc(String roomId);
}
