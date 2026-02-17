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
        try {
            Resource resource = resourceService.getResourceById(id);
            
            if (resource == null) {
                System.err.println("Resource not found with id: " + id);
                return ResponseEntity.status(404).body(new ApiResponse<>("Resource not found", null));
            }
            
            System.out.println("Downloading resource: " + resource.getFileName() + " from path: " + resource.getFilePath());
            
            // Check if file path is null or empty
            if (resource.getFilePath() == null || resource.getFilePath().isEmpty()) {
                System.err.println("File path is null or empty for resource id: " + id);
                return ResponseEntity.status(500).body(new ApiResponse<>("File path not configured", null));
            }
            
            // Read file and return as byte array
            java.nio.file.Path filePath = java.nio.file.Paths.get(resource.getFilePath());
            
            if (!java.nio.file.Files.exists(filePath)) {
                System.err.println("File does not exist at path: " + filePath.toString());
                return ResponseEntity.status(404).body(new ApiResponse<>("File not found on server", null));
            }
            
            byte[] fileContent = java.nio.file.Files.readAllBytes(filePath);
            
            // Increment download count
            resourceService.incrementDownloadCount(id);
            
            return ResponseEntity.ok()
                    .header("Content-Type", resource.getMimeType())
                    .header("Content-Disposition", "attachment; filename=\"" + resource.getFileName() + "\"")
                    .body(fileContent);
        } catch (Exception e) {
            System.err.println("Error downloading file: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse<>("Error downloading file: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{id}/stream")
    public ResponseEntity<?> streamResource(@PathVariable Long id) {
        try {
            Resource resource = resourceService.getResourceById(id);
            
            if (resource == null) {
                System.err.println("Resource not found with id: " + id);
                return ResponseEntity.status(404).body(new ApiResponse<>("Resource not found", null));
            }
            
            System.out.println("Streaming resource: " + resource.getFileName() + " from path: " + resource.getFilePath());
            
            // Check if file path is null or empty
            if (resource.getFilePath() == null || resource.getFilePath().isEmpty()) {
                System.err.println("File path is null or empty for resource id: " + id);
                return ResponseEntity.status(500).body(new ApiResponse<>("File path not configured", null));
            }
            
            // Read file and return as byte array for streaming
            java.nio.file.Path filePath = java.nio.file.Paths.get(resource.getFilePath());
            
            if (!java.nio.file.Files.exists(filePath)) {
                System.err.println("File does not exist at path: " + filePath.toString());
                return ResponseEntity.status(404).body(new ApiResponse<>("File not found on server", null));
            }
            
            byte[] fileContent = java.nio.file.Files.readAllBytes(filePath);
            
            // Increment view count for videos
            if ("VIDEO".equals(resource.getResourceType())) {
                resourceService.incrementViewCount(id);
            }
            
            return ResponseEntity.ok()
                    .header("Content-Type", resource.getMimeType())
                    .header("Content-Disposition", "inline; filename=\"" + resource.getFileName() + "\"")
                    .body(fileContent);
        } catch (Exception e) {
            System.err.println("Error streaming file: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse<>("Error streaming file: " + e.getMessage(), null));
        }
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