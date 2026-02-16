package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sync_records")
public class SyncRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    
    private String entityType; // COURSE, WEBINAR, CERTIFICATE
    
    private String operation; // CREATE, UPDATE, DELETE
    
    private String trainingType; // COURSE, WEBINAR, CERTIFICATE
    
    private Long trainingId;
    
    private LocalDateTime completionDate;
    
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, SYNCED, FAILED
    
    @Column(nullable = false)
    private String syncStatus = "PENDING"; // PENDING, SYNCED, FAILED
    
    @Column(length = 2000)
    private String syncDetails;
    
    private Integer retryCount = 0;
    
    private String errorMessage;
    
    private LocalDateTime syncedAt;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }
    public String getTrainingType() { return trainingType; }
    public void setTrainingType(String trainingType) { this.trainingType = trainingType; }
    public Long getTrainingId() { return trainingId; }
    public void setTrainingId(Long trainingId) { this.trainingId = trainingId; }
    public LocalDateTime getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDateTime completionDate) { this.completionDate = completionDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; this.syncStatus = status; }
    public String getSyncStatus() { return syncStatus; }
    public void setSyncStatus(String syncStatus) { this.syncStatus = syncStatus; this.status = syncStatus; }
    public String getSyncDetails() { return syncDetails; }
    public void setSyncDetails(String syncDetails) { this.syncDetails = syncDetails; }
    public Integer getRetryCount() { return retryCount; }
    public void setRetryCount(Integer retryCount) { this.retryCount = retryCount; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public LocalDateTime getSyncedAt() { return syncedAt; }
    public void setSyncedAt(LocalDateTime syncedAt) { this.syncedAt = syncedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}