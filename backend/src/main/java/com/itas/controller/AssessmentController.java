package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Assessment;
import com.itas.model.Question;
import com.itas.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Assessment Controller
 * Handles UC-LMS-002: Complete Learning Module with Assessment
 */
@RestController
@RequestMapping("/assessments")
public class AssessmentController {
    
    @Autowired
    private AssessmentService assessmentService;
    
    /**
     * Start a new assessment attempt
     * POST /api/assessments/start
     */
    @PostMapping("/start")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> startAssessment(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long moduleId = request.get("moduleId");
            
            Assessment assessment = assessmentService.startAssessment(userId, moduleId);
            return ResponseEntity.ok(new ApiResponse<>("Assessment started", assessment));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Submit assessment answers
     * POST /api/assessments/{assessmentId}/submit
     * 
     * Request body: { "answers": { "questionId": "answerId", ... } }
     */
    @PostMapping("/{assessmentId}/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> submitAssessment(
            @PathVariable Long assessmentId,
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            Map<Long, Long> answers = (Map<Long, Long>) request.get("answers");
            
            Map<String, Object> result = assessmentService.submitAssessment(assessmentId, answers);
            return ResponseEntity.ok(new ApiResponse<>("Assessment submitted", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get assessment history for a user and module
     * GET /api/assessments/history?userId={userId}&moduleId={moduleId}
     */
    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAssessmentHistory(
            @RequestParam Long userId,
            @RequestParam Long moduleId) {
        try {
            List<Assessment> history = assessmentService.getAssessmentHistory(userId, moduleId);
            return ResponseEntity.ok(new ApiResponse<>("Assessment history retrieved", history));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get questions for a module
     * GET /api/assessments/module/{moduleId}/questions
     */
    @GetMapping("/module/{moduleId}/questions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getModuleQuestions(@PathVariable Long moduleId) {
        try {
            List<Question> questions = assessmentService.getModuleQuestions(moduleId);
            return ResponseEntity.ok(new ApiResponse<>("Questions retrieved", questions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get final exam questions for a course
     * GET /api/assessments/course/{courseId}/final-exam
     */
    @GetMapping("/course/{courseId}/final-exam")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getFinalExamQuestions(@PathVariable Long courseId) {
        try {
            List<Question> questions = assessmentService.getFinalExamQuestions(courseId);
            return ResponseEntity.ok(new ApiResponse<>("Final exam questions retrieved", questions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Submit final exam
     * POST /api/assessments/final-exam/submit
     */
    @PostMapping("/final-exam/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> submitFinalExam(@RequestBody Map<String, Object> request) {
        try {
            Long userId = ((Number) request.get("userId")).longValue();
            Long courseId = ((Number) request.get("courseId")).longValue();

            @SuppressWarnings("unchecked")
            Map<String, Object> answers = (Map<String, Object>) request.get("answers");

            Map<String, Object> result = assessmentService.submitFinalExam(userId, courseId, answers);
            return ResponseEntity.ok(new ApiResponse<>("Final exam submitted", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Check if user is eligible to take final exam
     * GET /api/assessments/course/{courseId}/final-exam/eligibility?userId={userId}
     */
    @GetMapping("/course/{courseId}/final-exam/eligibility")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> checkFinalExamEligibility(
            @PathVariable Long courseId,
            @RequestParam Long userId) {
        try {
            Map<String, Object> result = assessmentService.checkFinalExamEligibility(userId, courseId);
            return ResponseEntity.ok(new ApiResponse<>("Eligibility checked", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
