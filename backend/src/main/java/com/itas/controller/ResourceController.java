package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Resource;
import com.itas.model.User;
import com.itas.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/resources")
public class ResourceController {
    
    @Autowired
    private ResourceService resourceService;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResource(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("resourceType") String resourceType,
            @RequestParam("category") String category,
            @RequestParam("audience") String audience,
            @AuthenticationPrincipal User currentUser) throws IOException {
        
        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setResourceType(resourceType);
        resource.setCategory(category);
        resource.setAudience(audience);
        resource.setStatus("PUBLISHED");
        
        Resource savedResource = resourceService.uploadResource(file, resource, currentUser);
        
        // Build response with HashMap (fixes Map.of() limit issue)
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedResource.getId());
        response.put("title", savedResource.getTitle());
        response.put("description", savedResource.getDescription());
        response.put("fileName", savedResource.getFileName());
        response.put("filePath", savedResource.getFilePath());
        response.put("fileSize", savedResource.getFileSize());
        response.put("mimeType", savedResource.getMimeType());
        response.put("uploadedBy", savedResource.getUploadedBy() != null ? 
            savedResource.getUploadedBy().getFullName() : "Unknown");
        response.put("uploadedAt", savedResource.getUploadedAt());
        response.put("viewCount", savedResource.getViewCount());
        response.put("downloadCount", savedResource.getDownloadCount());
        
        return ResponseEntity.ok(new ApiResponse<>("Resource uploaded successfully", response));
    }
    
    @GetMapping("")
    public ResponseEntity<?> getAllResources(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String resourceType,
            @RequestParam(required = false) String audience) {
        
        List<Resource> resources = resourceService.getAllResources(category, resourceType, audience);
        
        return ResponseEntity.ok(new ApiResponse<>("Resources retrieved successfully", resources));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getResourceById(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        
        if (resource == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>("Resource not found", null));
        }
        
        // Build response with HashMap
        Map<String, Object> response = new HashMap<>();
        response.put("id", resource.getId());
        response.put("title", resource.getTitle());
        response.put("description", resource.getDescription());
        response.put("fileName", resource.getFileName());
        response.put("filePath", resource.getFilePath());
        response.put("fileSize", resource.getFileSize());
        response.put("mimeType", resource.getMimeType());
        response.put("uploadedBy", resource.getUploadedBy() != null ? 
            resource.getUploadedBy().getFullName() : "Unknown");
        response.put("uploadedAt", resource.getUploadedAt());
        response.put("viewCount", resource.getViewCount());
        response.put("downloadCount", resource.getDownloadCount());
        
        return ResponseEntity.ok(new ApiResponse<>("Resource retrieved successfully", response));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateResource(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("resourceType") String resourceType,
            @RequestParam("category") String category,
            @RequestParam("audience") String audience,
            @AuthenticationPrincipal User currentUser) throws IOException {
        
        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setResourceType(resourceType);
        resource.setCategory(category);
        resource.setAudience(audience);
        
        Resource updatedResource = resourceService.updateResource(id, file, resource, currentUser);
        
        // Build response with HashMap
        Map<String, Object> response = new HashMap<>();
        response.put("id", updatedResource.getId());
        response.put("title", updatedResource.getTitle());
        response.put("description", updatedResource.getDescription());
        response.put("fileName", updatedResource.getFileName());
        response.put("filePath", updatedResource.getFilePath());
        response.put("fileSize", updatedResource.getFileSize());
        response.put("mimeType", updatedResource.getMimeType());
        response.put("uploadedBy", updatedResource.getUploadedBy() != null ? 
            updatedResource.getUploadedBy().getFullName() : "Unknown");
        response.put("updatedAt", updatedResource.getUpdatedAt());
        response.put("viewCount", updatedResource.getViewCount());
        response.put("downloadCount", updatedResource.getDownloadCount());
        
        return ResponseEntity.ok(new ApiResponse<>("Resource updated successfully", response));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(new ApiResponse<>("Resource deleted successfully", null));
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadResource(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        
        if (resource == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>("Resource not found", null));
        }
        
        // Increment download count
        resourceService.incrementDownloadCount(id);
        
        // Build response with HashMap
        Map<String, Object> response = new HashMap<>();
        response.put("fileName", resource.getFileName());
        response.put("filePath", resource.getFilePath());
        response.put("mimeType", resource.getMimeType());
        response.put("fileSize", resource.getFileSize());
        
        return ResponseEntity.ok(new ApiResponse<>("Download ready", response));
    }
    
    @PutMapping("/{id}/views")
    public ResponseEntity<?> incrementViews(@PathVariable Long id) {
        resourceService.incrementViewCount(id);
        return ResponseEntity.ok(new ApiResponse<>("View count incremented", null));
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchResources(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String resourceType,
            @RequestParam(required = false) String audience) {
        
        List<Resource> resources = resourceService.searchResources(query, category, resourceType, audience);
        return ResponseEntity.ok(new ApiResponse<>("Search results", resources));
    }
}