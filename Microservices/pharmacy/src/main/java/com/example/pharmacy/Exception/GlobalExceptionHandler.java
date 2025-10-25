package com.example.pharmacy.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

// Dùng để bắt lỗi toàn cục cho tất cả controller
@ControllerAdvice
public class GlobalExceptionHandler {

    // Xử lý lỗi ApException
    @ExceptionHandler(PyException.class)
    public ResponseEntity<?> handleApException(PyException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(ex.getMessage()));
    }

    // Xử lý các lỗi khác không mong muốn
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi hệ thống: " + ex.getMessage()));
    }

    // Dạng dữ liệu trả về cho client
    record ErrorResponse(String message) {}
}