package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "resources")
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private String resourceType; // PDF, VIDEO, AUDIO, DOCUMENT
    private String category;     // VAT, INCOME_TAX, CUSTOMS, etc.
    private String audience;     // BEGINNER, INTERMEDIATE, ADVANCED
    private String status;       // PUBLISHED, DRAFT, ARCHIVED
    
    // File properties
    private String filePath;
    private String fileName;
    private Long fileSize;
    private String mimeType;
    private String fileHash;
    private Integer version = 1;
    private Boolean isLatestVersion = true;
    private Boolean archived = false;
    private Integer viewCount = 0;
    private Integer downloadCount = 0;
    private Long previousVersionId;
    
    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
    
    @ManyToOne
    @JoinColumn(name = "archived_by")
    private User archivedBy;
    
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
    private LocalDateTime archivedAt;
    
    @ManyToMany
    @JoinTable(
        name = "resource_tags",
        joinColumns = @JoinColumn(name = "resource_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;
    
    // Constructors
    public Resource() {}
    
    public Resource(String title, String description, String resourceType, 
                   String category, String audience, String status) {
        this.title = title;
        this.description = description;
        this.resourceType = resourceType;
        this.category = category;
        this.audience = audience;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    
    public String getFileHash() { return fileHash; }
    public void setFileHash(String fileHash) { this.fileHash = fileHash; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public Boolean getIsLatestVersion() { return isLatestVersion; }
    public void setIsLatestVersion(Boolean isLatestVersion) { this.isLatestVersion = isLatestVersion; }
    
    public Boolean getArchived() { return archived; }
    public void setArchived(Boolean archived) { this.archived = archived; }
    
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    
    public Integer getDownloadCount() { return downloadCount; }
    public void setDownloadCount(Integer downloadCount) { this.downloadCount = downloadCount; }
    
    public Long getPreviousVersionId() { return previousVersionId; }
    public void setPreviousVersionId(Long previousVersionId) { this.previousVersionId = previousVersionId; }
    
    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }
    
    public User getArchivedBy() { return archivedBy; }
    public void setArchivedBy(User archivedBy) { this.archivedBy = archivedBy; }
    
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getArchivedAt() { return archivedAt; }
    public void setArchivedAt(LocalDateTime archivedAt) { this.archivedAt = archivedAt; }
    
    public Set<Tag> getTags() { return tags; }
    public void setTags(Set<Tag> tags) { this.tags = tags; }
    
    // Additional methods for compatibility
    public String getFileUrl() { return filePath; }
    public void setFileUrl(String fileUrl) { this.filePath = fileUrl; }
    
    public Integer getViews() { return viewCount; }
    public void setViews(Integer views) { this.viewCount = views; }
    
    public Integer getDownloads() { return downloadCount; }
    public void setDownloads(Integer downloads) { this.downloadCount = downloads; }
}