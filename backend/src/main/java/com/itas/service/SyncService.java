package com.itas.service;

import com.itas.model.SyncRecord;
import com.itas.repository.SyncRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SyncService {
    
    @Autowired
    private SyncRecordRepository syncRecordRepository;
    
    public List<SyncRecord> getAllSyncRecords() {
        return syncRecordRepository.findAll();
    }
    
    public SyncRecord getSyncRecordById(Long id) {
        return syncRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sync record not found with id: " + id));
    }
    
    public List<SyncRecord> getSyncRecordsByStatus(String status) {
        return syncRecordRepository.findAll().stream()
                .filter(s -> status.equals(s.getStatus()))
                .toList();
    }
    
    @Transactional
    public SyncRecord createSyncRecord(String entityType, String operation, String details) {
        SyncRecord syncRecord = new SyncRecord();
        syncRecord.setEntityType(entityType);
        syncRecord.setOperation(operation);
        syncRecord.setStatus("PENDING");
        syncRecord.setSyncDetails(details);
        syncRecord.setCreatedAt(LocalDateTime.now());
        
        return syncRecordRepository.save(syncRecord);
    }
    
    @Transactional
    public SyncRecord updateSyncStatus(Long id, String status, String errorMessage) {
        SyncRecord syncRecord = getSyncRecordById(id);
        
        syncRecord.setStatus(status);
        syncRecord.setErrorMessage(errorMessage);
        syncRecord.setSyncedAt(LocalDateTime.now());
        
        return syncRecordRepository.save(syncRecord);
    }
    
    @Transactional
    public void deleteSyncRecord(Long id) {
        SyncRecord syncRecord = getSyncRecordById(id);
        syncRecordRepository.delete(syncRecord);
    }
    
    @Transactional
    public void retryFailedSync(Long id) {
        SyncRecord syncRecord = getSyncRecordById(id);
        syncRecord.setStatus("PENDING");
        syncRecord.setErrorMessage(null);
        syncRecordRepository.save(syncRecord);
    }
    
    public List<SyncRecord> getPendingSyncs() {
        return getSyncRecordsByStatus("PENDING");
    }
    
    @Transactional
    public SyncRecord syncTrainingRecord(Long id) {
        SyncRecord syncRecord = getSyncRecordById(id);
        try {
            // Simulate sync operation
            syncRecord.setStatus("SYNCED");
            syncRecord.setSyncedAt(LocalDateTime.now());
        } catch (Exception e) {
            syncRecord.setStatus("FAILED");
            syncRecord.setErrorMessage(e.getMessage());
        }
        return syncRecordRepository.save(syncRecord);
    }
    
    @Transactional
    public List<SyncRecord> retryFailedSyncs() {
        List<SyncRecord> failedSyncs = getSyncRecordsByStatus("FAILED");
        failedSyncs.forEach(sync -> {
            sync.setStatus("PENDING");
            sync.setErrorMessage(null);
            sync.setRetryCount(sync.getRetryCount() + 1);
            syncRecordRepository.save(sync);
        });
        return failedSyncs;
    }
    
    @Transactional
    public SyncRecord forceSync(Long id) {
        return syncTrainingRecord(id);
    }
    
    public Object getSyncStats() {
        long total = syncRecordRepository.count();
        long pending = getSyncRecordsByStatus("PENDING").size();
        long synced = getSyncRecordsByStatus("SYNCED").size();
        long failed = getSyncRecordsByStatus("FAILED").size();
        
        return new Object() {
            public final long totalRecords = total;
            public final long pendingRecords = pending;
            public final long syncedRecords = synced;
            public final long failedRecords = failed;
        };
    }
    
    public Object checkSyncHealth() {
        long failedCount = getSyncRecordsByStatus("FAILED").size();
        long pendingCount = getSyncRecordsByStatus("PENDING").size();
        
        String status = failedCount > 10 ? "UNHEALTHY" : "HEALTHY";
        
        return new Object() {
            public final String healthStatus = status;
            public final long failedSyncs = failedCount;
            public final long pendingSyncs = pendingCount;
        };
    }
}
