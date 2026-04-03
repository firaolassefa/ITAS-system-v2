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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
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
    @Transactional(readOnly = true)
    public ResponseEntity<?> getQuestionsByModule(@PathVariable Long moduleId) {
        try {
            List<Question> questions = questionRepository.findByModuleIdOrderByOrderAsc(moduleId);
            // Map to safe DTOs to avoid lazy loading issues
            List<Map<String, Object>> result = toDto(questions);
            return ResponseEntity.ok(new ApiResponse<>("Success", result));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to load questions: " + e.getMessage(), null));
        }
    }

    @GetMapping("/course/{courseId}/final-exam")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getFinalExamQuestions(@PathVariable Long courseId) {
        try {
            List<Question> questions = questionRepository.findByCourseIdAndQuestionCategory(courseId, "FINAL_EXAM");
            return ResponseEntity.ok(new ApiResponse<>("Final exam questions retrieved", toDto(questions)));
        } catch (Exception e) {
            System.err.println("Final exam query failed (migration may be needed): " + e.getMessage());
            return ResponseEntity.ok(new ApiResponse<>("Final exam questions retrieved", java.util.Collections.emptyList()));
        }
    }

    /** Convert questions to plain maps so Jackson never touches lazy proxies */
    private List<Map<String, Object>> toDto(List<Question> questions) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Question q : questions) {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", q.getId());
            dto.put("questionText", q.getQuestionText());
            dto.put("questionType", q.getQuestionType() != null ? q.getQuestionType().name() : "MULTIPLE_CHOICE");
            dto.put("points", q.getPoints());
            dto.put("order", q.getOrder());
            dto.put("isPractice", q.getIsPractice());
            dto.put("questionCategory", q.getQuestionCategory() != null ? q.getQuestionCategory() : (Boolean.TRUE.equals(q.getIsPractice()) ? "PRACTICE" : "QUIZ"));
            dto.put("explanation", q.getExplanation());
            dto.put("courseId", q.getCourseId());
            dto.put("moduleId", q.getModule() != null ? q.getModule().getId() : null);
            // Answers
            List<Map<String, Object>> answers = new ArrayList<>();
            if (q.getAnswers() != null) {
                for (Answer a : q.getAnswers()) {
                    Map<String, Object> aDto = new HashMap<>();
                    aDto.put("id", a.getId());
                    aDto.put("answerText", a.getAnswerText());
                    aDto.put("isCorrect", a.getIsCorrect());
                    aDto.put("order", a.getOrder());
                    answers.add(aDto);
                }
            }
            dto.put("answers", answers);
            list.add(dto);
        }
        return list;
    }
    @PostMapping("")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> createQuestion(@RequestBody Map<String, Object> request) {
        try {
            String questionText = (String) request.get("questionText");
            String questionType = (String) request.get("questionType");
            Integer points = request.get("points") != null ?
                ((Number) request.get("points")).intValue() : 1;
            Integer order = request.get("order") != null ?
                ((Number) request.get("order")).intValue() : 0;
            Boolean isPractice = request.get("isPractice") != null ?
                (Boolean) request.get("isPractice") : false;
            String explanation = request.get("explanation") != null ?
                (String) request.get("explanation") : null;
            String questionCategory = request.get("questionCategory") != null ?
                (String) request.get("questionCategory") : (Boolean.TRUE.equals(isPractice) ? "PRACTICE" : "QUIZ");

            Question question = new Question();
            question.setQuestionText(questionText);
            question.setQuestionType(QuestionType.valueOf(questionType));
            question.setPoints(points);
            question.setOrder(order);
            question.setQuestionCategory(questionCategory);
            question.setIsPractice("PRACTICE".equals(questionCategory));
            question.setExplanation(explanation);
            question.setCreatedAt(LocalDateTime.now());

            if ("FINAL_EXAM".equals(questionCategory)) {
                // Final exam questions are course-level, no module required
                if (request.get("courseId") != null) {
                    question.setCourseId(((Number) request.get("courseId")).longValue());
                }
            } else {
                // Practice and Quiz questions require a module
                Long moduleId = ((Number) request.get("moduleId")).longValue();
                Module module = moduleRepository.findById(moduleId)
                    .orElseThrow(() -> new RuntimeException("Module not found with id: " + moduleId));
                question.setModule(module);
                question.setCourseId(module.getCourse() != null ? module.getCourse().getId() : null);
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> answers = (List<Map<String, Object>>) request.get("answers");
            if (answers != null && !answers.isEmpty()) {
                for (Map<String, Object> answerData : answers) {
                    Answer answer = new Answer();
                    answer.setQuestion(question);
                    answer.setAnswerText((String) answerData.get("answerText"));
                    answer.setIsCorrect((Boolean) answerData.get("isCorrect"));
                    answer.setOrder(answerData.get("order") != null ?
                        ((Number) answerData.get("order")).intValue() : 0);
                    question.getAnswers().add(answer);
                }
            }

            Question savedQuestion = questionRepository.save(question);
            return ResponseEntity.ok(new ApiResponse<>("Question created successfully", savedQuestion));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to create question: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
            
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
            if (request.containsKey("isPractice")) {
                question.setIsPractice((Boolean) request.get("isPractice"));
            }
            if (request.containsKey("explanation")) {
                question.setExplanation((String) request.get("explanation"));
            }
            
            // Update answers if provided
            if (request.containsKey("answers")) {
                // Clear existing answers
                question.getAnswers().clear();
                
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> answers = (List<Map<String, Object>>) request.get("answers");
                if (answers != null && !answers.isEmpty()) {
                    for (Map<String, Object> answerData : answers) {
                        Answer answer = new Answer();
                        answer.setQuestion(question);
                        answer.setAnswerText((String) answerData.get("answerText"));
                        answer.setIsCorrect((Boolean) answerData.get("isCorrect"));
                        answer.setOrder(answerData.get("order") != null ? 
                            ((Number) answerData.get("order")).intValue() : 0);
                        
                        question.getAnswers().add(answer);
                    }
                }
            }
            
            Question updated = questionRepository.save(question);
            return ResponseEntity.ok(new ApiResponse<>("Question updated successfully", updated));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to update question: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            questionRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>("Question deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to delete question: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/bulk-delete")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> bulkDeleteQuestions(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Number> ids = (List<Number>) request.get("ids");
            
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("No question IDs provided", null));
            }
            
            int deletedCount = 0;
            for (Number id : ids) {
                try {
                    questionRepository.deleteById(id.longValue());
                    deletedCount++;
                } catch (Exception e) {
                    // Continue deleting other questions even if one fails
                    System.err.println("Failed to delete question " + id + ": " + e.getMessage());
                }
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("deletedCount", deletedCount);
            result.put("totalRequested", ids.size());
            
            return ResponseEntity.ok(new ApiResponse<>(
                deletedCount + " question(s) deleted successfully", result));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to delete questions: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/duplicate/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> duplicateQuestion(@PathVariable Long id) {
        try {
            Question original = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
            
            Question duplicate = new Question();
            duplicate.setModule(original.getModule());
            duplicate.setQuestionText(original.getQuestionText() + " (Copy)");
            duplicate.setQuestionType(original.getQuestionType());
            duplicate.setPoints(original.getPoints());
            duplicate.setOrder(original.getOrder() + 1);
            duplicate.setIsPractice(original.getIsPractice());
            duplicate.setExplanation(original.getExplanation());
            duplicate.setCreatedAt(LocalDateTime.now());
            
            // Duplicate answers
            for (Answer originalAnswer : original.getAnswers()) {
                Answer duplicateAnswer = new Answer();
                duplicateAnswer.setQuestion(duplicate);
                duplicateAnswer.setAnswerText(originalAnswer.getAnswerText());
                duplicateAnswer.setIsCorrect(originalAnswer.getIsCorrect());
                duplicateAnswer.setOrder(originalAnswer.getOrder());
                duplicate.getAnswers().add(duplicateAnswer);
            }
            
            Question saved = questionRepository.save(duplicate);
            return ResponseEntity.ok(new ApiResponse<>("Question duplicated successfully", saved));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to duplicate question: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/module/{moduleId}/statistics")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> getModuleQuestionStatistics(@PathVariable Long moduleId) {
        try {
            List<Question> allQuestions = questionRepository.findByModuleIdOrderByOrderAsc(moduleId);
            List<Question> practiceQuestions = questionRepository.findByModuleIdAndIsPracticeTrueOrderByOrderAsc(moduleId);
            List<Question> quizQuestions = questionRepository.findByModuleIdAndIsPracticeFalseOrderByOrderAsc(moduleId);
            
            int totalPoints = allQuestions.stream().mapToInt(Question::getPoints).sum();
            int practicePoints = practiceQuestions.stream().mapToInt(Question::getPoints).sum();
            int quizPoints = quizQuestions.stream().mapToInt(Question::getPoints).sum();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalQuestions", allQuestions.size());
            stats.put("practiceQuestions", practiceQuestions.size());
            stats.put("quizQuestions", quizQuestions.size());
            stats.put("totalPoints", totalPoints);
            stats.put("practicePoints", practicePoints);
            stats.put("quizPoints", quizPoints);
            
            // Question type breakdown
            Map<String, Long> typeBreakdown = allQuestions.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    q -> q.getQuestionType().toString(),
                    java.util.stream.Collectors.counting()
                ));
            stats.put("typeBreakdown", typeBreakdown);
            
            return ResponseEntity.ok(new ApiResponse<>("Statistics retrieved", stats));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to get statistics: " + e.getMessage(), null));
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
    
    @GetMapping("/module/{moduleId}/practice")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPracticeQuestions(@PathVariable Long moduleId) {
        try {
            List<Question> questions = questionRepository.findByModuleIdAndIsPracticeTrueOrderByOrderAsc(moduleId);
            return ResponseEntity.ok(new ApiResponse<>("Practice questions retrieved", questions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to load practice questions: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/module/{moduleId}/quiz")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getQuizQuestions(@PathVariable Long moduleId) {
        try {
            List<Question> questions = questionRepository.findByModuleIdAndIsPracticeFalseOrderByOrderAsc(moduleId);
            return ResponseEntity.ok(new ApiResponse<>("Quiz questions retrieved", questions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to load quiz questions: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/practice/check-answer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> checkPracticeAnswer(@RequestBody Map<String, Object> request) {
        try {
            Long questionId = ((Number) request.get("questionId")).longValue();
            Long answerId = ((Number) request.get("answerId")).longValue();
            
            Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
            
            boolean correct = false;
            String correctAnswerText = "";
            
            for (Answer answer : question.getAnswers()) {
                if (answer.getId().equals(answerId) && answer.getIsCorrect()) {
                    correct = true;
                }
                if (answer.getIsCorrect()) {
                    correctAnswerText = answer.getAnswerText();
                }
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("correct", correct);
            result.put("explanation", question.getExplanation());
            result.put("correctAnswer", correctAnswerText);
            
            return ResponseEntity.ok(new ApiResponse<>("Answer checked", result));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to check answer: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/module-quiz/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> submitModuleQuiz(@RequestBody Map<String, Object> request) {
        try {
            Long moduleId = ((Number) request.get("moduleId")).longValue();
            Long userId = ((Number) request.get("userId")).longValue();
            
            @SuppressWarnings("unchecked")
            Map<String, Object> answers = (Map<String, Object>) request.get("answers");
            
            List<Question> questions = questionRepository.findByModuleIdAndIsPracticeFalseOrderByOrderAsc(moduleId);
            
            int totalPoints = 0;
            int earnedPoints = 0;
            
            for (Question question : questions) {
                totalPoints += question.getPoints();
                
                if (answers.containsKey(question.getId().toString())) {
                    String userAnswerId = answers.get(question.getId().toString()).toString();
                    
                    for (Answer answer : question.getAnswers()) {
                        if (answer.getId().toString().equals(userAnswerId) && answer.getIsCorrect()) {
                            earnedPoints += question.getPoints();
                            break;
                        }
                    }
                }
            }
            
            double percentage = totalPoints > 0 ? (earnedPoints * 100.0 / totalPoints) : 0;
            boolean passed = percentage >= 70;
            
            Map<String, Object> result = new HashMap<>();
            result.put("totalPoints", totalPoints);
            result.put("earnedPoints", earnedPoints);
            result.put("percentage", Math.round(percentage * 100.0) / 100.0);
            result.put("passed", passed);
            result.put("nextModuleUnlocked", passed);
            result.put("feedback", passed ? 
                "Congratulations! You passed the module quiz. Next module unlocked!" : 
                "You need at least 70% to pass. Please review the material and try again.");
            
            return ResponseEntity.ok(new ApiResponse<>("Module quiz submitted", result));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to submit quiz: " + e.getMessage(), null));
        }
    }
}

