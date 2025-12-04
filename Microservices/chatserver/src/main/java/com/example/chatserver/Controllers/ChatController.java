package com.example.chatserver.Controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;  // Import mới
import org.springframework.web.bind.annotation.*;

import com.example.chatserver.Dto.CreateQuestionDto;
import com.example.chatserver.Dto.MessageDto;
import com.example.chatserver.Models.Question;
import com.example.chatserver.Service.ChatService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chatserver")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // Patient tạo câu hỏi
    @PostMapping("/questions")
    public ResponseEntity<?> createQuestion(@RequestBody CreateQuestionDto dto) {
        Question q = chatService.createQuestion(dto);
        return ResponseEntity.ok(Map.of("questionId", q.getId()));
    }

    // Patient lấy danh sách câu hỏi của chính họ
    @GetMapping("/questions")
    public ResponseEntity<List<Question>> listQuestions(@RequestParam Long patientId) {
        return ResponseEntity.ok(chatService.getQuestions(patientId));
    }

    // Detail
    @GetMapping("/questions/{questionId}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long questionId) {
        return ResponseEntity.ok(chatService.getQuestionById(questionId));
    }

    // Doctor lấy pending theo chuyên khoa
    @GetMapping("/questions/doctor")
    public ResponseEntity<List<Question>> listPendingQuestions(@RequestParam String specialization) {
        return ResponseEntity.ok(chatService.getPendingQuestionsBySpecialty(specialization));
    }

    // Doctor nhận câu hỏi
    @PostMapping("/questions/{questionId}/assign")
    public ResponseEntity<?> assignDoctor(@PathVariable Long questionId, @RequestBody Map<String, Long> b) {
        Long doctorId = b.get("doctorId");
        Question q = chatService.assignDoctorToQuestion(questionId, doctorId);

        return ResponseEntity.ok(Map.of(
            "questionId", q.getId(),
            "roomId", "question-" + q.getId(),
            "status", q.getStatus()
        ));
    }

    // Send message - SỬA: Thêm broadcast sau save
    @PostMapping("/send")
    public ResponseEntity<MessageDto> sendMessage(@RequestBody MessageDto dto) {
        MessageDto saved = chatService.sendMessage(
            dto.getSenderId(),
            dto.getSenderRole(),
            dto.getReceiverId(),
            dto.getRoomId(),
            dto.getContent()
        );

        // Broadcast tới room để real-time update cho tất cả client (sender + receiver)
        messagingTemplate.convertAndSend("/topic/" + dto.getRoomId(), saved);

        log.info("Message sent and broadcasted to room: {}", dto.getRoomId());  // Log debug

        return ResponseEntity.ok(saved);
    }

    // History
    @GetMapping("/history/{roomId}")
    public ResponseEntity<List<MessageDto>> history(@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.getHistory(roomId));
    }

    // Doctor lấy danh sách câu hỏi đã nhận (ASSIGNED)
    @GetMapping("/questions/assigned")
    public ResponseEntity<List<Question>> getAssignedQuestions(@RequestParam Long doctorId) {
        List<Question> assignedQuestions = chatService.getAssignedQuestionsByDoctor(doctorId);
        return ResponseEntity.ok(assignedQuestions);
    }
}