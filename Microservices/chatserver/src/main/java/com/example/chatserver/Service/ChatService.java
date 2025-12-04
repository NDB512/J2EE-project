package com.example.chatserver.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.chatserver.Dto.CreateQuestionDto;
import com.example.chatserver.Dto.MessageDto;
import com.example.chatserver.Models.Message;
import com.example.chatserver.Models.Question;
import com.example.chatserver.Repository.MessageRepository;
import com.example.chatserver.Repository.QuestionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ChatService {

    private final MessageRepository messageRepository;
    private final QuestionRepository questionRepository;

    // Patient tạo question
    public Question createQuestion(CreateQuestionDto dto) {
        log.info("Creating question for patientId: {}", dto.getPatientId());
        Question q = new Question();
        q.setPatientId(dto.getPatientId());
        q.setTitle(dto.getTitle());
        q.setDescription(dto.getDescription());
        q.setSpecialty(dto.getSpecialty());
        q.setStatus("PENDING");
        q.setAssignedDoctorId(null);
        Question saved = questionRepository.save(q);
        log.info("Created question ID: {}", saved.getId());
        return saved;
    }

    // Patient xem list questions của họ
    public List<Question> getQuestions(Long patientId) {
        log.info("Fetching questions for patientId: {}", patientId);
        return questionRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    // Doctor nhận question
    public Question assignDoctorToQuestion(Long questionId, Long doctorId) {
        log.info("Assigning doctor {} to question {}", doctorId, questionId);

        Question q = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found: " + questionId));

        if (!"PENDING".equals(q.getStatus())) {
            throw new RuntimeException("Question already assigned or closed");
        }

        q.setAssignedDoctorId(doctorId);
        q.setStatus("ASSIGNED");
        return questionRepository.save(q);
    }

    // Doctor xem pending theo specialty
    public List<Question> getPendingQuestionsBySpecialty(String specialty) {
        return questionRepository.findByStatusAndSpecialtyOrderByCreatedAtDesc("PENDING", specialty);
    }

    // Get detail
    public Question getQuestionById(Long questionId) {
        return questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    // Send message (kiểm tra đúng patient - doctor)
    public MessageDto sendMessage(Long senderId, String senderRole, Long receiverId, String roomId, String content) {

        Long questionId = Long.parseLong(roomId.replace("question-", ""));
        Question q = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!"ASSIGNED".equals(q.getStatus()))
            throw new RuntimeException("Chat not open for this question");

        if ("PATIENT".equals(senderRole) && !q.getPatientId().equals(senderId))
            throw new RuntimeException("Patient unauthorized");

        if ("DOCTOR".equals(senderRole) && !q.getAssignedDoctorId().equals(senderId))
            throw new RuntimeException("Doctor unauthorized");

        Message m = new Message();
        m.setSenderId(senderId);
        m.setSenderRole(senderRole);
        m.setReceiverId(receiverId);
        m.setRoomId(roomId);
        m.setContent(content);

        Message saved = messageRepository.save(m);
        return mapToDto(saved);
    }

    // Lịch sử chat
    public List<MessageDto> getHistory(String roomId) {
        return messageRepository.findByRoomIdOrderByTimestampAsc(roomId)
            .stream().map(this::mapToDto).toList();
    }

    private MessageDto mapToDto(Message m) {
        MessageDto dto = new MessageDto();
        dto.setId(m.getId());
        dto.setSenderId(m.getSenderId());
        dto.setSenderRole(m.getSenderRole());
        dto.setReceiverId(m.getReceiverId());
        dto.setRoomId(m.getRoomId());
        dto.setContent(m.getContent());
        dto.setTimestamp(m.getTimestamp());
        return dto;
    }
}
