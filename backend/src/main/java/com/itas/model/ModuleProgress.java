package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "module_progress")
public class ModuleProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;
    
    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;
    
    private String moduleName;
    
    private Integer moduleOrder;
    
    private Double progress = 0.0;
    
    private Boolean completed = false;
    
    private LocalDateTime startedAt;
    
    private LocalDateTime completedAt;
    
    private Integer attemptCount = 0;
    
    private Double quizScore = 0.0;
    
    private Integer maxAttempts = 3;
    
    private Boolean passed = false;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Module getModule() { return module; }
    public void setModule(Module module) { this.module = module; }
    public Enrollment getEnrollment() { return enrollment; }
    public void setEnrollment(Enrollment enrollment) { this.enrollment = enrollment; }
    public String getModuleName() { return moduleName; }
    public void setModuleName(String moduleName) { this.moduleName = moduleName; }
    public Integer getModuleOrder() { return moduleOrder; }
    public void setModuleOrder(Integer moduleOrder) { this.moduleOrder = moduleOrder; }
    public Double getProgress() { return progress; }
    public void setProgress(Double progress) { this.progress = progress; }
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public Integer getAttemptCount() { return attemptCount; }
    public void setAttemptCount(Integer attemptCount) { this.attemptCount = attemptCount; }
    public Double getQuizScore() { return quizScore; }
    public void setQuizScore(Double quizScore) { this.quizScore = quizScore; }
    public Integer getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(Integer maxAttempts) { this.maxAttempts = maxAttempts; }
    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }
}