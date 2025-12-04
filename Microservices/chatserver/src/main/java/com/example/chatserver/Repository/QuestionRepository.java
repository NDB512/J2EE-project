package com.example.chatserver.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.chatserver.Models.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Patient xem danh sách question của chính họ
    List<Question> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    // Doctor xem danh sách pending theo chuyên khoa
    List<Question> findByStatusAndSpecialtyOrderByCreatedAtDesc(String status, String specialty);
}
