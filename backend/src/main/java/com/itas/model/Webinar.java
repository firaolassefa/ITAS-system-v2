package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "webinars")
public class Webinar {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime scheduleTime;
    
    private Integer durationMinutes;
    
    @Column(length = 1000)
    private String presentersData; // comma-separated list of presenter names

    public List<String> getPresenters() {
        if (presentersData == null || presentersData.isEmpty()) return new java.util.ArrayList<>();
        return java.util.Arrays.asList(presentersData.split(","));
    }

    public void setPresenters(List<String> presenters) {
        this.presentersData = presenters == null ? "" : String.join(",", presenters);
    }
    
    private Integer maxAttendees;
    
    private String targetAudience;
    
    private String meetingLink;
    
    private String recordingLink;
    
    @Column(nullable = false)
    private Boolean registrationOpen = true;
    
    @Column(nullable = false)
    private String status = "SCHEDULED"; // SCHEDULED, LIVE, COMPLETED, CANCELLED
    
    private Integer registeredCount = 0;
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getScheduleTime() { return scheduleTime; }
    public void setScheduleTime(LocalDateTime scheduleTime) { this.scheduleTime = scheduleTime; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public Integer getMaxAttendees() { return maxAttendees; }
    public void setMaxAttendees(Integer maxAttendees) { this.maxAttendees = maxAttendees; }
    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public String getRecordingLink() { return recordingLink; }
    public void setRecordingLink(String recordingLink) { this.recordingLink = recordingLink; }
    public Boolean getRegistrationOpen() { return registrationOpen; }
    public void setRegistrationOpen(Boolean registrationOpen) { this.registrationOpen = registrationOpen; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(Integer registeredCount) { this.registeredCount = registeredCount; }
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isRegistrationOpen() { return registrationOpen != null && registrationOpen; }
}