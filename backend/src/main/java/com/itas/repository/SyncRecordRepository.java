package com.itas.repository;

import com.itas.model.SyncRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SyncRecordRepository extends JpaRepository<SyncRecord, Long> {
    
    List<SyncRecord> findBySyncStatus(String syncStatus);
    
    List<SyncRecord> findByUserId(Long userId);
    
    List<SyncRecord> findBySyncStatusAndRetryCountLessThan(String syncStatus, Integer maxRetryCount);
    
    @Query("SELECT COUNT(s) FROM SyncRecord s WHERE s.syncStatus = 'PENDING'")
    long countPending();
    
    @Query("SELECT COUNT(s) FROM SyncRecord s WHERE s.syncStatus = 'SYNCED'")
    long countSynced();
    
    @Query("SELECT COUNT(s) FROM SyncRecord s WHERE s.syncStatus = 'FAILED'")
    long countFailed();
}