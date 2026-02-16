package com.itas.service;

import com.itas.model.*;
import com.itas.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Test Cases for Assessment Service
 * Tests UC-LMS-002: Complete Learning Module with Assessment
 */
@ExtendWith(MockitoExtension.class)
public class AssessmentServiceTest {
    
    @Mock
    private AssessmentRepository assessmentRepository;
    
    @Mock
    private ModuleRepository moduleRepository;
    
    @Mock
    private QuestionRepository questionRepository;
    
    @Mock
    private AnswerRepository answerRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private ModuleProgressRepository moduleProgressRepository;
    
    @InjectMocks
    private AssessmentService assessmentService;
    
    private User testUser;
    private com.itas.model.Module testModule;
    private Course testCourse;
    
    @BeforeEach
    void setUp() {
        // Setup test data
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        
        testCourse = new Course();
        testCourse.setId(1L);
        testCourse.setTitle("Test Course");
        
        testModule = new com.itas.model.Module();
        testModule.setId(1L);
        testModule.setTitle("Test Module");
        testModule.setCourse(testCourse);
        testModule.setPassingScore(70);
        testModule.setMaxAttempts(3);
        testModule.setIsLocked(false);
    }
    
    /**
     * Test Case 1: Successfully start assessment
     */
    @Test
    void testStartAssessment_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(moduleRepository.findById(1L)).thenReturn(Optional.of(testModule));
        when(assessmentRepository.countAttemptsByUserAndModule(testUser, testModule)).thenReturn(0);
        when(assessmentRepository.save(any(Assessment.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // Act
        Assessment result = assessmentService.startAssessment(1L, 1L);
        
        // Assert
        assertNotNull(result);
        assertEquals(1, result.getAttemptNumber());
        assertNotNull(result.getStartedAt());
        verify(assessmentRepository, times(1)).save(any(Assessment.class));
    }
    
    /**
     * Test Case 2: Fail to start assessment - module locked
     */
    @Test
    void testStartAssessment_ModuleLocked() {
        // Arrange
        testModule.setIsLocked(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(moduleRepository.findById(1L)).thenReturn(Optional.of(testModule));
        
        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            assessmentService.startAssessment(1L, 1L);
        });
        
        assertTrue(exception.getMessage().contains("locked"));
    }
    
    /**
     * Test Case 3: Fail to start assessment - max attempts reached
     */
    @Test
    void testStartAssessment_MaxAttemptsReached() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(moduleRepository.findById(1L)).thenReturn(Optional.of(testModule));
        when(assessmentRepository.countAttemptsByUserAndModule(testUser, testModule)).thenReturn(3);
        
        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            assessmentService.startAssessment(1L, 1L);
        });
        
        assertTrue(exception.getMessage().contains("Maximum attempts"));
    }
    
    /**
     * Test Case 4: Submit assessment with passing score (≥70%)
     */
    @Test
    void testSubmitAssessment_PassingScore() {
        // Arrange
        Assessment assessment = new Assessment();
        assessment.setId(1L);
        assessment.setUser(testUser);
        assessment.setModule(testModule);
        assessment.setAttemptNumber(1);
        
        Question q1 = createQuestion(1L, "Question 1", 10);
        Question q2 = createQuestion(2L, "Question 2", 10);
        
        Answer correctAnswer1 = createAnswer(1L, q1, "Correct Answer 1", true);
        Answer correctAnswer2 = createAnswer(2L, q2, "Correct Answer 2", true);
        
        Map<Long, Long> userAnswers = new HashMap<>();
        userAnswers.put(1L, 1L); // Correct
        userAnswers.put(2L, 2L); // Correct
        
        when(assessmentRepository.findById(1L)).thenReturn(Optional.of(assessment));
        when(questionRepository.findByModuleOrderByOrderAsc(testModule))
                .thenReturn(Arrays.asList(q1, q2));
        when(answerRepository.findById(1L)).thenReturn(Optional.of(correctAnswer1));
        when(answerRepository.findById(2L)).thenReturn(Optional.of(correctAnswer2));
        when(assessmentRepository.save(any(Assessment.class))).thenAnswer(i -> i.getArguments()[0]);
        when(moduleProgressRepository.findByUserIdAndModuleId(any(), any()))
                .thenReturn(Optional.of(new ModuleProgress()));
        
        // Act
        Map<String, Object> result = assessmentService.submitAssessment(1L, userAnswers);
        
        // Assert
        assertTrue((Boolean) result.get("passed"));
        assertEquals(100.0, result.get("percentage"));
        verify(assessmentRepository, times(1)).save(any(Assessment.class));
    }
    
    /**
     * Test Case 5: Submit assessment with failing score (<70%)
     */
    @Test
    void testSubmitAssessment_FailingScore() {
        // Arrange
        Assessment assessment = new Assessment();
        assessment.setId(1L);
        assessment.setUser(testUser);
        assessment.setModule(testModule);
        assessment.setAttemptNumber(1);
        
        Question q1 = createQuestion(1L, "Question 1", 10);
        Question q2 = createQuestion(2L, "Question 2", 10);
        
        Answer correctAnswer1 = createAnswer(1L, q1, "Correct Answer 1", true);
        Answer wrongAnswer2 = createAnswer(3L, q2, "Wrong Answer 2", false);
        
        Map<Long, Long> userAnswers = new HashMap<>();
        userAnswers.put(1L, 1L); // Correct
        userAnswers.put(2L, 3L); // Wrong
        
        when(assessmentRepository.findById(1L)).thenReturn(Optional.of(assessment));
        when(questionRepository.findByModuleOrderByOrderAsc(testModule))
                .thenReturn(Arrays.asList(q1, q2));
        when(answerRepository.findById(1L)).thenReturn(Optional.of(correctAnswer1));
        when(answerRepository.findById(3L)).thenReturn(Optional.of(wrongAnswer2));
        when(assessmentRepository.save(any(Assessment.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // Act
        Map<String, Object> result = assessmentService.submitAssessment(1L, userAnswers);
        
        // Assert
        assertFalse((Boolean) result.get("passed"));
        assertEquals(50.0, result.get("percentage"));
        verify(assessmentRepository, times(1)).save(any(Assessment.class));
    }
    
    // Helper methods
    private Question createQuestion(Long id, String text, int points) {
        Question q = new Question();
        q.setId(id);
        q.setQuestionText(text);
        q.setPoints(points);
        q.setModule(testModule);
        return q;
    }
    
    private Answer createAnswer(Long id, Question question, String text, boolean isCorrect) {
        Answer a = new Answer();
        a.setId(id);
        a.setQuestion(question);
        a.setAnswerText(text);
        a.setIsCorrect(isCorrect);
        return a;
    }
}
