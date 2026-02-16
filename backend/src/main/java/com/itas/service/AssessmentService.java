package com.itas.service;

import com.itas.model.*;
import com.itas.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AssessmentService {
    
    @Autowired
    private AssessmentRepository assessmentRepository;
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ModuleProgressRepository moduleProgressRepository;
    
    /**
     * Start a new assessment attempt
     * UC-LMS-002: Complete Learning Module
     */
    @Transactional
    public Assessment startAssessment(Long userId, Long moduleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        com.itas.model.Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        
        // Check if module is locked
        if (module.getIsLocked()) {
            throw new RuntimeException("Module is locked. Complete previous modules first.");
        }
        
        // Check attempt count
        Integer attemptCount = assessmentRepository.countAttemptsByUserAndModule(user, module);
        if (attemptCount >= module.getMaxAttempts()) {
            throw new RuntimeException("Maximum attempts (" + module.getMaxAttempts() + ") reached");
        }
        
        // Create new assessment
        Assessment assessment = new Assessment();
        assessment.setUser(user);
        assessment.setModule(module);
        assessment.setAttemptNumber(attemptCount + 1);
        assessment.setStartedAt(LocalDateTime.now());
        
        return assessmentRepository.save(assessment);
    }
    
    /**
     * Submit assessment and calculate score
     * UC-LMS-002: Complete Learning Module with passing score validation
     */
    @Transactional
    public Map<String, Object> submitAssessment(Long assessmentId, Map<Long, Long> answers) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        
        if (assessment.getCompletedAt() != null) {
            throw new RuntimeException("Assessment already submitted");
        }
        
        com.itas.model.Module module = assessment.getModule();
        List<Question> questions = questionRepository.findByModuleOrderByOrderAsc(module);
        
        int totalPoints = 0;
        int earnedPoints = 0;
        Map<Long, Boolean> results = new HashMap<>();
        
        // Calculate score
        for (Question question : questions) {
            totalPoints += question.getPoints();
            
            Long userAnswerId = answers.get(question.getId());
            if (userAnswerId != null) {
                Answer answer = answerRepository.findById(userAnswerId)
                        .orElse(null);
                
                if (answer != null && answer.getIsCorrect()) {
                    earnedPoints += question.getPoints();
                    results.put(question.getId(), true);
                } else {
                    results.put(question.getId(), false);
                }
            } else {
                results.put(question.getId(), false);
            }
        }
        
        // Calculate percentage
        double percentage = totalPoints > 0 ? (earnedPoints * 100.0 / totalPoints) : 0;
        boolean passed = percentage >= module.getPassingScore();
        
        // Update assessment
        assessment.setScore(earnedPoints);
        assessment.setTotalPoints(totalPoints);
        assessment.setPercentage(percentage);
        assessment.setPassed(passed);
        assessment.setCompletedAt(LocalDateTime.now());
        
        if (passed) {
            assessment.setFeedback("Congratulations! You passed the assessment.");
            
            // Update module progress
            updateModuleProgress(assessment.getUser(), module);
            
            // Unlock next module
            unlockNextModule(module);
        } else {
            int remainingAttempts = module.getMaxAttempts() - assessment.getAttemptNumber();
            assessment.setFeedback("You did not pass. You have " + remainingAttempts + " attempt(s) remaining.");
        }
        
        assessmentRepository.save(assessment);
        
        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("assessment", assessment);
        response.put("results", results);
        response.put("passed", passed);
        response.put("percentage", percentage);
        response.put("score", earnedPoints + "/" + totalPoints);
        
        return response;
    }
    
    /**
     * Update module progress when assessment is passed
     */
    private void updateModuleProgress(User user, com.itas.model.Module module) {
        ModuleProgress progress = moduleProgressRepository
                .findByUserIdAndModuleId(user.getId(), module.getId())
                .orElse(new ModuleProgress());
        
        progress.setUser(user);
        progress.setModule(module);
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        progress.setProgress(100.0);
        
        moduleProgressRepository.save(progress);
    }
    
    /**
     * Unlock next module in sequence
     */
    private void unlockNextModule(com.itas.model.Module currentModule) {
        List<com.itas.model.Module> modules = moduleRepository.findByCourseOrderByOrderAsc(currentModule.getCourse());
        
        for (int i = 0; i < modules.size() - 1; i++) {
            if (modules.get(i).getId().equals(currentModule.getId())) {
                com.itas.model.Module nextModule = modules.get(i + 1);
                nextModule.setIsLocked(false);
                moduleRepository.save(nextModule);
                break;
            }
        }
    }
    
    /**
     * Get assessment history for a user and module
     */
    public List<Assessment> getAssessmentHistory(Long userId, Long moduleId) {
        return assessmentRepository.findByUserIdAndModuleIdOrderByAttemptNumberDesc(userId, moduleId);
    }
    
    /**
     * Get questions for a module (without correct answers)
     */
    public List<Question> getModuleQuestions(Long moduleId) {
        return questionRepository.findByModuleIdOrderByOrderAsc(moduleId);
    }
}
