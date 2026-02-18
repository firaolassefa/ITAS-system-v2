package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Answer;
import com.itas.model.Module;
import com.itas.model.Question;
import com.itas.model.QuestionType;
import com.itas.repository.ModuleRepository;
import com.itas.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/questions")
public class QuestionController {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    @GetMapping("/module/{moduleId}")
    public ResponseEntity<?> getQuestionsByModule(@PathVariable Long moduleId) {
        try {
            List<Question> questions = questionRepository.findByModuleIdOrderByOrderAsc(moduleId);
            return ResponseEntity.ok(new ApiResponse<>("Success", questions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to load questions: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN', 'TRAINING_ADMIN')")
    public ResponseEntity<?> createQuestion(@RequestBody Map<String, Object> request) {
        try {
            Long moduleId = ((Number) request.get("moduleId")).longValue();
            String questionText = (String) request.get("questionText");
            String questionType = (String) request.get("questionType");
            Integer points = request.get("points") != null ? 
                ((Number) request.get("points")).intValue() : 1;
            Integer order = request.get("order") != null ? 
                ((Number) request.get("order")).intValue() : 0;
            
            Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));
            
            Question question = new Question();
            question.setModule(module);
            question.setQuestionText(questionText);
            question.setQuestionType(QuestionType.valueOf(questionType));
            question.setPoints(points);
            question.setOrder(order);
            question.setCreatedAt(LocalDateTime.now());
            
            Question savedQuestion = questionRepository.save(question);
            
            // Add answers if provided
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> answers = (List<Map<String, Object>>) request.get("answers");
            if (answers != null && !answers.isEmpty()) {
                for (Map<String, Object> answerData : answers) {
                    Answer answer = new Answer();
                    answer.setQuestion(savedQuestion);
                    answer.setAnswerText((String) answerData.get("answerText"));
                    answer.setIsCorrect((Boolean) answerData.get("isCorrect"));
                    answer.setOrder(answerData.get("order") != null ? 
                        ((Number) answerData.get("order")).intValue() : 0);
                    
                    savedQuestion.getAnswers().add(answer);
                }
                savedQuestion = questionRepository.save(savedQuestion);
            }
            
            return ResponseEntity.ok(new ApiResponse<>("Question created successfully", savedQuestion));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to create question: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN', 'TRAINING_ADMIN')")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
            
            if (request.containsKey("questionText")) {
                question.setQuestionText((String) request.get("questionText"));
            }
            if (request.containsKey("questionType")) {
                question.setQuestionType(QuestionType.valueOf((String) request.get("questionType")));
            }
            if (request.containsKey("points")) {
                question.setPoints(((Number) request.get("points")).intValue());
            }
            if (request.containsKey("order")) {
                question.setOrder(((Number) request.get("order")).intValue());
            }
            
            Question updated = questionRepository.save(question);
            return ResponseEntity.ok(new ApiResponse<>("Question updated successfully", updated));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to update question: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN', 'TRAINING_ADMIN')")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            questionRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>("Question deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to delete question: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/submit-assessment")
    public ResponseEntity<?> submitAssessment(@RequestBody Map<String, Object> request) {
        try {
            Long moduleId = ((Number) request.get("moduleId")).longValue();
            Long userId = ((Number) request.get("userId")).longValue();
            
            @SuppressWarnings("unchecked")
            Map<String, Object> answers = (Map<String, Object>) request.get("answers");
            
            List<Question> questions = questionRepository.findByModuleIdOrderByOrderAsc(moduleId);
            
            int totalPoints = 0;
            int earnedPoints = 0;
            
            for (Question question : questions) {
                totalPoints += question.getPoints();
                
                String userAnswerId = answers.get(question.getId().toString()).toString();
                
                // Check if answer is correct
                for (Answer answer : question.getAnswers()) {
                    if (answer.getId().toString().equals(userAnswerId) && answer.getIsCorrect()) {
                        earnedPoints += question.getPoints();
                        break;
                    }
                }
            }
            
            double percentage = totalPoints > 0 ? (earnedPoints * 100.0 / totalPoints) : 0;
            boolean passed = percentage >= 70; // 70% passing grade
            
            Map<String, Object> result = Map.of(
                "totalPoints", totalPoints,
                "earnedPoints", earnedPoints,
                "percentage", percentage,
                "passed", passed,
                "feedback", passed ? "Congratulations! You passed the assessment." : 
                    "You need at least 70% to pass. Please review the material and try again."
            );
            
            return ResponseEntity.ok(new ApiResponse<>("Assessment submitted successfully", result));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to submit assessment: " + e.getMessage(), null));
        }
    }
}
