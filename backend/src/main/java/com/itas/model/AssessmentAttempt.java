package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_attempts", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "assessment_definition_id", "attempt_number"}))
public class AssessmentAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "assessment_definition_id", nullable = false)
    private Long assessmentDefinitionId;
    
    @Column(name = "attempt_number", nullable = false)
    private Integer attemptNumber;
    
    private Double score;
    
    @Column(name = "total_points")
    private Double totalPoints;
    
    private Double percentage;
    
    @Column(nullable = false)
    private Boolean passed = false;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt = LocalDateTime.now();
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "time_taken_minutes")
    private Integer timeTakenMinutes;
    
    @Column(columnDefinition = "TEXT")
    private String answers;  // JSON string of user answers
    
    // Constructors
    public AssessmentAttempt() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getAssessmentDefinitionId() { return assessmentDefinitionId; }
    public void setAssessmentDefinitionId(Long assessmentDefinitionId) { 
        this.assessmentDefinitionId = assessmentDefinitionId; 
    }
    
    public Integer getAttemptNumber() { return attemptNumber; }
    public void setAttemptNumber(Integer attemptNumber) { this.attemptNumber = attemptNumber; }
    
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    
    public Double getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Double totalPoints) { this.totalPoints = totalPoints; }
    
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    
    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public Integer getTimeTakenMinutes() { return timeTakenMinutes; }
    public void setTimeTakenMinutes(Integer timeTakenMinutes) { 
        this.timeTakenMinutes = timeTakenMinutes; 
    }
    
    public String getAnswers() { return answers; }
    public void setAnswers(String answers) { this.answers = answers; }
}
