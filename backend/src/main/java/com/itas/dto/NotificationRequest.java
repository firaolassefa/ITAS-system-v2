package com.itas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class NotificationRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;
    
    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 5000, message = "Message must be between 10 and 5000 characters")
    private String message;
    
    @NotNull(message = "Notification type is required")
    private String notificationType; // EMAIL, SMS, SYSTEM, IN_APP
    
    @NotNull(message = "Priority is required")
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    
    @NotNull(message = "Target audience is required")
    private String targetAudience;
    
    private LocalDateTime scheduledFor;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String notificationType) { this.notificationType = notificationType; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }
    public LocalDateTime getScheduledFor() { return scheduledFor; }
    public void setScheduledFor(LocalDateTime scheduledFor) { this.scheduledFor = scheduledFor; }
}