package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Enrollment;
import com.itas.model.ModuleProgress;
import com.itas.repository.EnrollmentRepository;
import com.itas.repository.ModuleProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/modules")
public class ModuleController {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private ModuleProgressRepository moduleProgressRepository;
    
    @PostMapping("/start")
    public ResponseEntity<?> startModule(@RequestBody Map<String, Object> request) {
        Long enrollmentId = ((Number) request.get("enrollmentId")).longValue();
        String moduleName = (String) request.get("moduleName");
        Integer moduleOrder = ((Number) request.get("moduleOrder")).intValue();
        
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
        if (enrollmentOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new ApiResponse<>("Enrollment not found", null));
        }
        
        // Check if module progress already exists
        Optional<ModuleProgress> existingProgress = moduleProgressRepository
            .findByEnrollmentIdAndModuleName(enrollmentId, moduleName);
        
        if (existingProgress.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>("Module already started", existingProgress.get()));
        }
        
        // Create new module progress
        ModuleProgress progress = new ModuleProgress();
        progress.setEnrollment(enrollmentOpt.get());
        progress.setModuleName(moduleName);
        progress.setModuleOrder(moduleOrder);
        progress.setStartedAt(LocalDateTime.now());
        progress.setProgress(0.0);
        progress.setCompleted(false);
        progress.setAttemptCount(0);
        
        ModuleProgress savedProgress = moduleProgressRepository.save(progress);
        
        return ResponseEntity.ok(new ApiResponse<>("Module started", savedProgress));
    }
    
    @PostMapping("/complete")
    public ResponseEntity<?> completeModule(@RequestBody Map<String, Object> request) {
        Long progressId = ((Number) request.get("progressId")).longValue();
        Double quizScore = ((Number) request.get("quizScore")).doubleValue();
        
        Optional<ModuleProgress> progressOpt = moduleProgressRepository.findById(progressId);
        if (progressOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new ApiResponse<>("Module progress not found", null));
        }
        
        ModuleProgress progress = progressOpt.get();
        
        // Update progress
        progress.setProgress(100.0);
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        progress.setQuizScore(quizScore);
        progress.setAttemptCount(progress.getAttemptCount() + 1);
        
        // Check if passed (score >= 70%)
        boolean passed = quizScore >= 70.0;
        progress.setPassed(passed);
        
        ModuleProgress updatedProgress = moduleProgressRepository.save(progress);
        
        // Update enrollment progress
        updateEnrollmentProgress(progress.getEnrollment().getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("progress", updatedProgress);
        response.put("passed", passed);
        response.put("message", passed ? "Module completed successfully!" : "Module completed but needs retake");
        
        return ResponseEntity.ok(new ApiResponse<>("Module completed", response));
    }
    
    @PostMapping("/progress")
    public ResponseEntity<?> updateModuleProgress(@RequestBody Map<String, Object> request) {
        Long progressId = ((Number) request.get("progressId")).longValue();
        Double progressValue = ((Number) request.get("progress")).doubleValue();
        
        Optional<ModuleProgress> progressOpt = moduleProgressRepository.findById(progressId);
        if (progressOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new ApiResponse<>("Module progress not found", null));
        }
        
        ModuleProgress progress = progressOpt.get();
        progress.setProgress(progressValue);
        
        ModuleProgress updatedProgress = moduleProgressRepository.save(progress);
        
        return ResponseEntity.ok(new ApiResponse<>("Progress updated", updatedProgress));
    }
    
    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<?> getEnrollmentModules(@PathVariable Long enrollmentId) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
        if (enrollmentOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new ApiResponse<>("Enrollment not found", null));
        }
        
        // In real app, get modules from course
        // For now, return mock data
        Map<String, Object> response = new HashMap<>();
        response.put("enrollmentId", enrollmentId);
        response.put("courseId", enrollmentOpt.get().getCourseId());
        response.put("progress", enrollmentOpt.get().getProgress());
        response.put("modules", new Object[] {
            Map.of("name", "Introduction to VAT", "order", 1, "completed", true),
            Map.of("name", "VAT Registration Process", "order", 2, "completed", false),
            Map.of("name", "Filing VAT Returns", "order", 3, "completed", false)
        });
        
        return ResponseEntity.ok(new ApiResponse<>("Modules retrieved", response));
    }
    
    private void updateEnrollmentProgress(Long enrollmentId) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
        if (enrollmentOpt.isPresent()) {
            Enrollment enrollment = enrollmentOpt.get();
            
            // Calculate overall progress based on module progress
            var moduleProgressList = moduleProgressRepository.findByEnrollmentId(enrollmentId);
            if (!moduleProgressList.isEmpty()) {
                double totalProgress = moduleProgressList.stream()
                    .mapToDouble(ModuleProgress::getProgress)
                    .average()
                    .orElse(0.0);
                
                enrollment.setProgress(totalProgress);
                
                // If all modules completed, mark enrollment as completed
                boolean allCompleted = moduleProgressList.stream()
                    .allMatch(ModuleProgress::getCompleted);
                
                if (allCompleted) {
                    enrollment.setStatus("COMPLETED");
                    enrollment.setCompletedAt(LocalDateTime.now());
                }
                
                enrollmentRepository.save(enrollment);
            }
        }
    }
}