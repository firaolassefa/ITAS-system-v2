package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.AssessmentDefinition;
import com.itas.model.Question;
import com.itas.repository.AssessmentDefinitionRepository;
import com.itas.service.QuestionImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/assessment-definitions")
public class AssessmentDefinitionController {
    
    @Autowired
    private AssessmentDefinitionRepository assessmentDefinitionRepository;
    
    @Autowired
    private QuestionImportService questionImportService;
    
    // Get all assessments
    @GetMapping
    public ResponseEntity<?> getAllAssessments() {
        List<AssessmentDefinition> assessments = assessmentDefinitionRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>("All assessments retrieved", assessments));
    }
    
    // Get all assessments for a course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getAssessmentsByCourse(@PathVariable Long courseId) {
        List<AssessmentDefinition> assessments = assessmentDefinitionRepository.findByCourseId(courseId);
        return ResponseEntity.ok(new ApiResponse<>("Assessments retrieved", assessments));
    }
    
    // Get final exam for a course
    @GetMapping("/course/{courseId}/final-exam")
    public ResponseEntity<?> getFinalExam(@PathVariable Long courseId) {
        List<AssessmentDefinition> exams = assessmentDefinitionRepository
            .findByCourseIdAndIsFinalExam(courseId, true);
        
        if (exams.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse<>("No final exam found", null));
        }
        
        return ResponseEntity.ok(new ApiResponse<>("Final exam found", exams.get(0)));
    }
    
    // Get module quizzes for a course
    @GetMapping("/course/{courseId}/module-quizzes")
    public ResponseEntity<?> getModuleQuizzes(@PathVariable Long courseId) {
        List<AssessmentDefinition> quizzes = assessmentDefinitionRepository
            .findByCourseIdAndAssessmentType(courseId, "MODULE_QUIZ");
        return ResponseEntity.ok(new ApiResponse<>("Module quizzes retrieved", quizzes));
    }
    
    // Create assessment
    @PostMapping
    @PreAuthorize("hasAnyRole('CONTENT_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<?> createAssessment(@RequestBody AssessmentDefinition assessment) {
        try {
            // Validate final exam uniqueness
            if (assessment.getIsFinalExam()) {
                boolean exists = assessmentDefinitionRepository
                    .existsByCourseIdAndIsFinalExam(assessment.getCourseId(), true);
                if (exists) {
                    return ResponseEntity.badRequest()
                        .body(new ApiResponse<>("Final exam already exists for this course", null));
                }
                
                // Set final exam defaults
                assessment.setAssessmentType("FINAL_EXAM");
                assessment.setMaxAttempts(3);
                assessment.setShowCorrectAnswers(false);
                assessment.setCertificateRequired(true);
                assessment.setModuleId(null);  // Final exam not tied to module
            } else {
                // Set module quiz defaults
                assessment.setAssessmentType("MODULE_QUIZ");
                assessment.setMaxAttempts(999);  // Unlimited
                assessment.setShowCorrectAnswers(true);
                assessment.setCertificateRequired(false);
            }
            
            AssessmentDefinition saved = assessmentDefinitionRepository.save(assessment);
            return ResponseEntity.ok(new ApiResponse<>("Assessment created successfully", saved));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to create assessment: " + e.getMessage(), null));
        }
    }
    
    // Update assessment
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CONTENT_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<?> updateAssessment(@PathVariable Long id, @RequestBody AssessmentDefinition assessment) {
        return assessmentDefinitionRepository.findById(id)
            .map(existing -> {
                existing.setTitle(assessment.getTitle());
                existing.setDescription(assessment.getDescription());
                existing.setPassingScore(assessment.getPassingScore());
                existing.setTimeLimitMinutes(assessment.getTimeLimitMinutes());
                
                // Don't allow changing type or final exam status
                // Don't allow changing max attempts for module quizzes
                if (!existing.getIsFinalExam()) {
                    existing.setMaxAttempts(999);
                }
                
                AssessmentDefinition updated = assessmentDefinitionRepository.save(existing);
                return ResponseEntity.ok(new ApiResponse<>("Assessment updated", updated));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete assessment
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CONTENT_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<?> deleteAssessment(@PathVariable Long id) {
        if (assessmentDefinitionRepository.existsById(id)) {
            assessmentDefinitionRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>("Assessment deleted", null));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Get assessment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAssessment(@PathVariable Long id) {
        return assessmentDefinitionRepository.findById(id)
            .map(assessment -> ResponseEntity.ok(new ApiResponse<>("Assessment found", assessment)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Import questions from file (Word/PDF)
    @PostMapping("/import")
    @PreAuthorize("hasAnyRole('CONTENT_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<?> importQuestionsFromFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "moduleId", required = false) Long moduleId,
            @RequestParam(value = "courseId", required = false) Long courseId,
            @RequestParam(value = "questionCategory", required = false) String questionCategory) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Please select a file to upload", null));
            }

            String filename = file.getOriginalFilename();
            if (filename == null || (!filename.endsWith(".docx") && !filename.endsWith(".pdf") && !filename.endsWith(".doc"))) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Only .docx and .pdf files are supported", null));
            }

            String category = questionCategory != null ? questionCategory : "QUIZ";
            boolean isFinalExam = "FINAL_EXAM".equals(category);

            if (!isFinalExam && moduleId == null) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("moduleId is required for Practice and Quiz questions", null));
            }

            List<Question> questions = questionImportService.importQuestionsFromFile(
                file, moduleId, courseId, category);

            Map<String, Object> result = new java.util.HashMap<>();
            result.put("imported", questions.size());
            result.put("questions", questions);
            result.put("message", "Successfully imported " + questions.size() + " question" + (questions.size() != 1 ? "s" : ""));

            return ResponseEntity.ok(new ApiResponse<>(
                "Successfully imported " + questions.size() + " questions", result));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to import questions: " + e.getMessage(), null));
        }
    }
    
    // Preview questions from file without saving
    @PostMapping("/preview")
    @PreAuthorize("hasAnyRole('CONTENT_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<?> previewQuestionsFromFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("moduleId") Long moduleId) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Please select a file to upload", null));
            }
            
            List<Question> questions = questionImportService.previewQuestionsFromFile(file, moduleId);
            
            return ResponseEntity.ok(new ApiResponse<>(
                "Preview: " + questions.size() + " questions found", 
                questions
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to preview questions: " + e.getMessage(), null));
        }
    }
}
