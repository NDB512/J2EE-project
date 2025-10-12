package com.example.appointment.Exception;

public class ApException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public ApException(String message) {
        super(message);
    }
}
