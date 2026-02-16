package com.itas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "help_contents")
public class HelpContent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String fieldId;
    
    @Column(nullable = false)
    private String fieldName;
    
    private String title;
    
    private String category;
    
    @Column(length = 500)
    private String shortDescription;
    
    @Column(length = 2000)
    private String description;
    
    @Column(length = 5000)
    private String detailedContent;
    
    @ElementCollection
    private List<String> steps = new ArrayList<>();
    
    private String example;
    
    private String videoUrl;
    
    private String docUrl;
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFieldId() { return fieldId; }
    public void setFieldId(String fieldId) { this.fieldId = fieldId; }
    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDetailedContent() { return detailedContent; }
    public void setDetailedContent(String detailedContent) { this.detailedContent = detailedContent; }
    public List<String> getSteps() { return steps; }
    public void setSteps(List<String> steps) { this.steps = steps; }
    public String getExample() { return example; }
    public void setExample(String example) { this.example = example; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getDocUrl() { return docUrl; }
    public void setDocUrl(String docUrl) { this.docUrl = docUrl; }
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}