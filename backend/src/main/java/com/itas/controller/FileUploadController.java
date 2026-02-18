package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Resource;
import com.itas.model.User;
import com.itas.service.FileStorageService;
import com.itas.service.ResourceService;
import com.itas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/files")
public class FileUploadController {
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private ResourceService resourceService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("resourceType") String resourceType,
            @RequestParam("audience") String audience,
            Authentication authentication) {
        
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Please select a file to upload", null));
            }
            
            // Store file
            String filePath = fileStorageService.storeFile(file, category);
            String fileHash = fileStorageService.calculateFileHash(file);
            
            // Get current user
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create resource record
            Resource resource = new Resource();
            resource.setTitle(title);
            resource.setDescription(description);
            resource.setCategory(category);
            resource.setResourceType(resourceType);
            resource.setAudience(audience);
            resource.setFilePath(filePath);
            resource.setFileName(file.getOriginalFilename());
            resource.setFileSize(file.getSize());
            resource.setMimeType(file.getContentType());
            resource.setFileHash(fileHash);
            resource.setStatus("PUBLISHED");
            resource.setUploadedBy(user);
            resource.setUploadedAt(LocalDateTime.now());
            resource.setVersion(1);
            resource.setIsLatestVersion(true);
            
            Resource savedResource = resourceService.createResource(resource);
            
            return ResponseEntity.ok(new ApiResponse<>("File uploaded successfully", savedResource));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to upload file: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/download/{resourceId}")
    public ResponseEntity<?> downloadFile(@PathVariable Long resourceId) {
        try {
            Resource resource = resourceService.getResourceById(resourceId);
            
            if (resource.getFilePath() == null) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("This is a demo resource with no actual file", null));
            }
            
            byte[] data = fileStorageService.loadFileAsBytes(resource.getFilePath());
            ByteArrayResource fileResource = new ByteArrayResource(data);
            
            // Increment download count
            resource.setDownloadCount(resource.getDownloadCount() + 1);
            resourceService.updateResource(resourceId, resource);
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(resource.getMimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + resource.getFileName() + "\"")
                .body(fileResource);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to download file: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/view/{resourceId}")
    public ResponseEntity<?> viewFile(@PathVariable Long resourceId) {
        try {
            Resource resource = resourceService.getResourceById(resourceId);
            
            if (resource.getFilePath() == null) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("This is a demo resource with no actual file", null));
            }
            
            byte[] data = fileStorageService.loadFileAsBytes(resource.getFilePath());
            ByteArrayResource fileResource = new ByteArrayResource(data);
            
            // Increment view count
            resource.setViewCount(resource.getViewCount() + 1);
            resourceService.updateResource(resourceId, resource);
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(resource.getMimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "inline; filename=\"" + resource.getFileName() + "\"")
                .body(fileResource);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to view file: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{resourceId}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> deleteFile(@PathVariable Long resourceId) {
        try {
            Resource resource = resourceService.getResourceById(resourceId);
            
            // Delete physical file
            if (resource.getFilePath() != null) {
                fileStorageService.deleteFile(resource.getFilePath());
            }
            
            // Delete database record
            resourceService.deleteResource(resourceId);
            
            return ResponseEntity.ok(new ApiResponse<>("File deleted successfully", null));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to delete file: " + e.getMessage(), null));
        }
    }
}
