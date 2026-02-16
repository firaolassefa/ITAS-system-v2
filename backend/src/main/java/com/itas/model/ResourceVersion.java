package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_versions")
public class ResourceVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;
    
    private String title;
    private String description;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private String mimeType;
    private Integer version;
    private String changeSummary;
    
    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;
    
    private LocalDateTime updatedAt;
    
    // Getters and setters for all fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public String getChangeSummary() { return changeSummary; }
    public void setChangeSummary(String changeSummary) { this.changeSummary = changeSummary; }
    
    public User getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(User updatedBy) { this.updatedBy = updatedBy; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}