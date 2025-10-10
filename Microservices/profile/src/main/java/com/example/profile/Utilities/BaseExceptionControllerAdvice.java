package com.example.profile.Utilities;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.profile.Exception.PrException;

public class BaseExceptionControllerAdvice {
    @ExceptionHandler(PrException.class)
    public ResponseEntity<?> handleBaseException(PrException ex) {
        Map<String, Object> res = new HashMap<>();
        res.put("timestamp", LocalDateTime.now());
        res.put("status", HttpStatus.BAD_REQUEST.value());
        res.put("error", "Bad Request");
        res.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(res);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(Exception ex) {
        Map<String, Object> res = new HashMap<>();
        res.put("timestamp", LocalDateTime.now());
        res.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        res.put("error", "Internal Server Error");
        res.put("message", ex.getMessage());
        return ResponseEntity.internalServerError().body(res);
    }
}
