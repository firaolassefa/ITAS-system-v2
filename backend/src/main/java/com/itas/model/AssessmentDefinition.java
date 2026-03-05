package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_definitions")
public class AssessmentDefinition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "course_id", nullable = false)
    private Long courseId;
    
    @Column(name = "module_id")
    private Long moduleId;  // NULL for final exam
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "assessment_type", nullable = false)
    private String assessmentType = "MODULE_QUIZ";  // MODULE_QUIZ or FINAL_EXAM
    
    @Column(name = "is_final_exam", nullable = false)
    private Boolean isFinalExam = false;
    
    @Column(name = "passing_score", nullable = false)
    private Double passingScore = 70.0;
    
    @Column(name = "max_attempts", nullable = false)
    private Integer maxAttempts = 999;  // 999 = unlimited for module quizzes
    
    @Column(name = "time_limit_minutes", nullable = false)
    private Integer timeLimitMinutes = 60;
    
    @Column(name = "show_correct_answers", nullable = false)
    private Boolean showCorrectAnswers = true;
    
    @Column(name = "certificate_required", nullable = false)
    private Boolean certificateRequired = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Constructors
    public AssessmentDefinition() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    public Long getModuleId() { return moduleId; }
    public void setModuleId(Long moduleId) { this.moduleId = moduleId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAssessmentType() { return assessmentType; }
    public void setAssessmentType(String assessmentType) { this.assessmentType = assessmentType; }
    
    public Boolean getIsFinalExam() { return isFinalExam; }
    public void setIsFinalExam(Boolean isFinalExam) { this.isFinalExam = isFinalExam; }
    
    public Double getPassingScore() { return passingScore; }
    public void setPassingScore(Double passingScore) { this.passingScore = passingScore; }
    
    public Integer getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(Integer maxAttempts) { this.maxAttempts = maxAttempts; }
    
    public Integer getTimeLimitMinutes() { return timeLimitMinutes; }
    public void setTimeLimitMinutes(Integer timeLimitMinutes) { this.timeLimitMinutes = timeLimitMinutes; }
    
    public Boolean getShowCorrectAnswers() { return showCorrectAnswers; }
    public void setShowCorrectAnswers(Boolean showCorrectAnswers) { this.showCorrectAnswers = showCorrectAnswers; }
    
    public Boolean getCertificateRequired() { return certificateRequired; }
    public void setCertificateRequired(Boolean certificateRequired) { this.certificateRequired = certificateRequired; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
