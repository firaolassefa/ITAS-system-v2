package com.itas.repository;

import com.itas.model.ArchivedResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface ArchivedResourceRepository extends JpaRepository<ArchivedResource, Long> {
    
    List<ArchivedResource> findByStatus(String status);
    
    List<ArchivedResource> findByDeletionScheduledForBeforeAndStatus(LocalDateTime dateTime, String status);
    
    @Query("SELECT COUNT(a) FROM ArchivedResource a WHERE a.status = 'ARCHIVED'")
    long countArchived();
    
    @Query("SELECT COUNT(a) FROM ArchivedResource a WHERE a.status = 'DELETED'")
    long countDeleted();
}