package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Module;
import com.itas.repository.ModuleRepository;
import com.itas.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/modules")
public class ModuleContentController {
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/{moduleId}/upload-content")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN', 'TRAINING_ADMIN')")
    public ResponseEntity<?> uploadModuleContent(
            @PathVariable Long moduleId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("contentType") String contentType) {
        
        try {
            Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));
            
            // Store file
            String filePath = fileStorageService.storeFile(file, "modules");
            
            // Update module based on content type
            if ("video".equalsIgnoreCase(contentType)) {
                module.setVideoUrl(filePath);
            } else {
                module.setContentUrl(filePath);
            }
            
            module.setUpdatedAt(LocalDateTime.now());
            Module updated = moduleRepository.save(module);
            
            return ResponseEntity.ok(new ApiResponse<>("Content uploaded successfully", updated));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to upload content: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/{moduleId}/set-url")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN', 'TRAINING_ADMIN')")
    public ResponseEntity<?> setModuleUrl(
            @PathVariable Long moduleId,
            @RequestParam("url") String url,
            @RequestParam("urlType") String urlType) {
        
        try {
            Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));
            
            // Set URL based on type
            if ("video".equalsIgnoreCase(urlType)) {
                module.setVideoUrl(url);
            } else {
                module.setContentUrl(url);
            }
            
            module.setUpdatedAt(LocalDateTime.now());
            Module updated = moduleRepository.save(module);
            
            return ResponseEntity.ok(new ApiResponse<>("URL set successfully", updated));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to set URL: " + e.getMessage(), null));
        }
    }
}
