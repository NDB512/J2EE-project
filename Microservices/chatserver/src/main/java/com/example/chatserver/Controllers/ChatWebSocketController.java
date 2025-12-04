package com.example.chatserver.Controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.chatserver.Dto.ChatMessagePayload;
import com.example.chatserver.Dto.MessageDto;
import com.example.chatserver.Service.ChatService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * WebSocket endpoint
     * Frontend sẽ gửi vào:  /app/send
     */
    @MessageMapping("/chatserver/send")
    public void send(ChatMessagePayload payload) {

        // 1. Validate (giống REST)
        if (payload.getRoomId() == null || payload.getContent() == null || payload.getSenderId() == null || payload.getSenderRole() == null || payload.getReceiverId() == null) {
            return; // hoặc throw custom exception
        }

        try {
            // Parse String IDs to Long
            Long senderIdLong = Long.parseLong(payload.getSenderId());
            Long receiverIdLong = Long.parseLong(payload.getReceiverId());

            // 2. Lưu vào database (sẽ validate quyền trong service)
            MessageDto saved = chatService.sendMessage(
                    senderIdLong,
                    payload.getSenderRole(),   // "PATIENT" | "DOCTOR"
                    receiverIdLong,
                    payload.getRoomId(),       // roomId = "question-{questionId}"
                    payload.getContent()
            );

            // 3. Broadcast message tới room tương ứng
            messagingTemplate.convertAndSend(
                    "/topic/" + payload.getRoomId(),
                    saved
            );
        } catch (NumberFormatException e) {
        } catch (Exception e) {
            // Xử lý lỗi khác (có thể log hoặc gửi thông báo lỗi)
            e.printStackTrace();
        }
    }
}