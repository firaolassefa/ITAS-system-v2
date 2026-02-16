package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "archived_resources")
public class ArchivedResource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long originalResourceId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    private String resourceType;
    private String category;
    private String archiveReason;
    
    @ManyToOne
    @JoinColumn(name = "archived_by")
    private User archivedBy;
    
    private LocalDateTime archivedAt = LocalDateTime.now();
    
    private LocalDateTime deletionScheduledFor;
    
    @Column(nullable = false)
    private String status = "ARCHIVED"; // ARCHIVED, DELETED

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOriginalResourceId() { return originalResourceId; }
    public void setOriginalResourceId(Long originalResourceId) { this.originalResourceId = originalResourceId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public User getArchivedBy() { return archivedBy; }
    public void setArchivedBy(User archivedBy) { this.archivedBy = archivedBy; }
    public LocalDateTime getArchivedAt() { return archivedAt; }
    public void setArchivedAt(LocalDateTime archivedAt) { this.archivedAt = archivedAt; }
    public LocalDateTime getDeletionScheduledFor() { return deletionScheduledFor; }
    public void setDeletionScheduledFor(LocalDateTime deletionScheduledFor) { this.deletionScheduledFor = deletionScheduledFor; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getArchiveReason() { return archiveReason; }
    public void setArchiveReason(String archiveReason) { this.archiveReason = archiveReason; }
}