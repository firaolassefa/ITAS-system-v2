package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.ArchivedResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/archive")
public class ArchiveController {
    
    private List<ArchivedResource> mockArchivedResources = new ArrayList<>();
    
    public ArchiveController() {
        // Initialize mock archived resources
        ArchivedResource resource1 = new ArchivedResource();
        resource1.setId(1L);
        resource1.setOriginalResourceId(100L);
        resource1.setTitle("Old VAT Guide 2022");
        resource1.setDescription("Outdated VAT guide");
        resource1.setArchivedAt(LocalDateTime.now().minusDays(30));
        resource1.setDeletionScheduledFor(LocalDateTime.now().plusDays(30));
        resource1.setStatus("ARCHIVED");
        
        mockArchivedResources.add(resource1);
    }
    
    @GetMapping("/resources")
    public ResponseEntity<?> getArchivedResources() {
        return ResponseEntity.ok(new ApiResponse<>("Archived resources retrieved", mockArchivedResources));
    }
    
    @PostMapping("/resources/{resourceId}")
    public ResponseEntity<?> archiveResource(
            @PathVariable Long resourceId,
            @RequestBody Map<String, String> request) {
        
        ArchivedResource archivedResource = new ArchivedResource();
        archivedResource.setId(System.currentTimeMillis());
        archivedResource.setOriginalResourceId(resourceId);
        archivedResource.setTitle("Archived Resource #" + resourceId);
        archivedResource.setDescription("Resource archived by admin");
        archivedResource.setArchivedAt(LocalDateTime.now());
        
        String scheduleDeletion = request.get("scheduleDeletion");
        if (scheduleDeletion != null) {
            archivedResource.setDeletionScheduledFor(LocalDateTime.parse(scheduleDeletion));
        } else {
            archivedResource.setDeletionScheduledFor(LocalDateTime.now().plusDays(30));
        }
        
        archivedResource.setStatus("ARCHIVED");
        mockArchivedResources.add(archivedResource);
        
        return ResponseEntity.ok(new ApiResponse<>("Resource archived successfully", archivedResource));
    }
    
    @PostMapping("/restore/{archiveId}")
    public ResponseEntity<?> restoreResource(@PathVariable Long archiveId) {
        Optional<ArchivedResource> resource = mockArchivedResources.stream()
            .filter(r -> r.getId().equals(archiveId))
            .findFirst();
        
        if (resource.isPresent()) {
            mockArchivedResources.remove(resource.get());
            return ResponseEntity.ok(new ApiResponse<>("Resource restored successfully", null));
        }
        
        return ResponseEntity.status(404).body(new ApiResponse<>("Archived resource not found", null));
    }
    
    @DeleteMapping("/{archiveId}/permanent")
    public ResponseEntity<?> permanentDelete(@PathVariable Long archiveId) {
        Optional<ArchivedResource> resource = mockArchivedResources.stream()
            .filter(r -> r.getId().equals(archiveId))
            .findFirst();
        
        if (resource.isPresent()) {
            resource.get().setStatus("DELETED");
            return ResponseEntity.ok(new ApiResponse<>("Resource permanently deleted", null));
        }
        
        return ResponseEntity.status(404).body(new ApiResponse<>("Archived resource not found", null));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getArchiveStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("archivedCount", mockArchivedResources.size());
        stats.put("scheduledForDeletion", mockArchivedResources.stream()
            .filter(r -> r.getStatus().equals("ARCHIVED")).count());
        stats.put("storageSaved", "1.2 GB");
        
        return ResponseEntity.ok(new ApiResponse<>("Archive statistics", stats));
    }
}