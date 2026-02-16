package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.SyncRecord;
import com.itas.service.SyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sync")
public class SyncController {
    
    @Autowired
    private SyncService syncService;
    
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingSyncs() {
        List<SyncRecord> pendingSyncs = syncService.getPendingSyncs();
        return ResponseEntity.ok(new ApiResponse<>("Pending syncs retrieved", pendingSyncs));
    }
    
    @PostMapping("/{recordId}/execute")
    public ResponseEntity<?> syncTrainingRecord(@PathVariable Long recordId) {
        try {
            syncService.syncTrainingRecord(recordId);
            return ResponseEntity.ok(new ApiResponse<>("Sync completed successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                new ApiResponse<>("Sync failed: " + e.getMessage(), null)
            );
        }
    }
    
    @PostMapping("/retry-failed")
    public ResponseEntity<?> retryFailedSyncs() {
        List<SyncRecord> retriedSyncs = syncService.retryFailedSyncs();
        return ResponseEntity.ok(new ApiResponse<>(
            "Retried " + retriedSyncs.size() + " failed syncs", 
            Map.of("retriedCount", retriedSyncs.size())
        ));
    }
    
    @PostMapping("/force/{userId}")
    public ResponseEntity<?> forceSync(@PathVariable Long userId) {
        try {
            syncService.forceSync(userId);
            return ResponseEntity.ok(new ApiResponse<>("Force sync initiated", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                new ApiResponse<>("Force sync failed: " + e.getMessage(), null)
            );
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getSyncStats() {
        Object stats = syncService.getSyncStats();
        return ResponseEntity.ok(new ApiResponse<>("Sync statistics", stats));
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> checkSyncHealth() {
        Object health = syncService.checkSyncHealth();
        return ResponseEntity.ok(new ApiResponse<>("Sync health check", health));
    }
}