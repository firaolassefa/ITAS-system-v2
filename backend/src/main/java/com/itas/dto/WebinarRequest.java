package com.itas.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public class WebinarRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 2000, message = "Description must be between 20 and 2000 characters")
    private String description;
    
    @NotNull(message = "Schedule time is required")
    @Future(message = "Schedule time must be in the future")
    private LocalDateTime scheduleTime;
    
    @NotNull(message = "Duration is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    @Max(value = 240, message = "Duration must be at most 240 minutes")
    private Integer durationMinutes;
    
    @NotEmpty(message = "At least one presenter is required")
    private List<String> presenters;
    
    @NotNull(message = "Maximum attendees is required")
    @Min(value = 1, message = "Maximum attendees must be at least 1")
    @Max(value = 1000, message = "Maximum attendees must be at most 1000")
    private Integer maxAttendees;
    
    @NotNull(message = "Target audience is required")
    private String targetAudience;
    
    @Pattern(regexp = "^(https?://).*$", message = "Meeting link must be a valid URL")
    private String meetingLink;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getScheduleTime() { return scheduleTime; }
    public void setScheduleTime(LocalDateTime scheduleTime) { this.scheduleTime = scheduleTime; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public List<String> getPresenters() { return presenters; }
    public void setPresenters(List<String> presenters) { this.presenters = presenters; }
    public Integer getMaxAttendees() { return maxAttendees; }
    public void setMaxAttendees(Integer maxAttendees) { this.maxAttendees = maxAttendees; }
    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
}