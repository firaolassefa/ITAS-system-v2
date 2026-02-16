package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Certificate;
import com.itas.model.Course;
import com.itas.model.User;
import com.itas.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/certificates")
public class CertificateController {
    
    @Autowired
    private CertificateService certificateService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserCertificates(@PathVariable Long userId) {
        try {
            List<Certificate> certificates = certificateService.getUserCertificates(userId);
            return ResponseEntity.ok(new ApiResponse<>("Success", certificates));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Error: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/generate")
    public ResponseEntity<?> generateCertificate(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long courseId = request.get("courseId");
            
            Certificate certificate = certificateService.generateCertificate(userId, courseId);
            return ResponseEntity.ok(new ApiResponse<>("Certificate generated successfully", certificate));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Error: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/verify/{certificateNumber}")
    public ResponseEntity<?> verifyCertificate(@PathVariable String certificateNumber) {
        try {
            Map<String, Object> verificationResult = certificateService.verifyCertificate(certificateNumber);
            
            ApiResponse<Map<String, Object>> apiResponse = new ApiResponse<>("Verification complete", verificationResult);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("certificate", null);
            
            ApiResponse<Map<String, Object>> apiResponse = new ApiResponse<>("Certificate not found", response);
            return ResponseEntity.ok(apiResponse);
        }
    }
}

