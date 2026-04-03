package com.itas.config;

import com.itas.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleMaxSizeException(MaxUploadSizeExceededException e) {
        System.err.println("=== FILE TOO LARGE: " + e.getMessage());
        return ResponseEntity.status(413)
            .body(new ApiResponse<>("File too large. Maximum size is 100MB", null));
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<?> handleMultipartException(MultipartException e) {
        System.err.println("=== MULTIPART ERROR: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(400)
            .body(new ApiResponse<>("File upload error: " + e.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception e) {
        System.err.println("=== UNHANDLED EXCEPTION: " + e.getClass().getName() + ": " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(500)
            .body(new ApiResponse<>("Server error: " + e.getMessage(), null));
    }
}
