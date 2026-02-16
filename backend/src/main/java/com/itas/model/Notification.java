package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 5000)
    private String message;
    
    private String link; // Link for notification action
    
    @Column(nullable = false)
    private String notificationType; // EMAIL, SMS, SYSTEM, IN_APP
    
    @Column(nullable = false)
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    
    @Column(nullable = false)
    private String targetAudience;
    
    private String role; // Target role for role-based notifications
    
    private LocalDateTime scheduledFor;
    
    private LocalDateTime sentAt;
    
    @Column(nullable = false)
    private String status = "DRAFT"; // DRAFT, SCHEDULED, SENDING, SENT, FAILED
    
    private Integer sentCount = 0;
    
    private Integer openedCount = 0;
    
    @Column(name = "is_read")
    private Boolean read = false;
    
    private LocalDateTime readAt;
    
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
    
    private Long userId; // Target user ID for individual notifications
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    
    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String notificationType) { this.notificationType = notificationType; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public LocalDateTime getScheduledFor() { return scheduledFor; }
    public void setScheduledFor(LocalDateTime scheduledFor) { this.scheduledFor = scheduledFor; }
    
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getSentCount() { return sentCount; }
    public void setSentCount(Integer sentCount) { this.sentCount = sentCount; }
    
    public Integer getOpenedCount() { return openedCount; }
    public void setOpenedCount(Integer openedCount) { this.openedCount = openedCount; }
    
    public Boolean getRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }
    
    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
    
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public boolean isRead() { return read != null && read; }
}