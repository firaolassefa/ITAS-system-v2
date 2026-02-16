package com.itas.repository;

import com.itas.model.Webinar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface WebinarRepository extends JpaRepository<Webinar, Long> {
    
    Page<Webinar> findByStatus(String status, Pageable pageable);
    
    List<Webinar> findByStatusAndScheduleTimeAfterOrderByScheduleTimeAsc(String status, LocalDateTime dateTime);
    
    @Query("SELECT w FROM Webinar w WHERE " +
           "(:status IS NULL OR w.status = :status) AND " +
           "(:fromDate IS NULL OR w.scheduleTime >= :fromDate) AND " +
           "(:toDate IS NULL OR w.scheduleTime <= :toDate)")
    Page<Webinar> findWebinarsWithFilters(
            @Param("status") String status,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable);
    
    @Query("SELECT w FROM Webinar w WHERE w.status = 'SCHEDULED' AND w.scheduleTime > CURRENT_TIMESTAMP ORDER BY w.scheduleTime ASC")
    List<Webinar> findUpcomingWebinars(Pageable pageable);
    
    boolean existsByIdAndCreatedById(Long webinarId, Long createdById);
    
    // Dashboard methods
    @Query("SELECT w FROM Webinar w WHERE w.status = 'SCHEDULED' AND w.scheduleTime > CURRENT_TIMESTAMP ORDER BY w.scheduleTime ASC")
    List<Webinar> findUpcomingWebinars();
    
    @Query("SELECT COUNT(w) FROM Webinar w WHERE w.status = 'SCHEDULED' AND w.scheduleTime > CURRENT_TIMESTAMP")
    long countUpcoming();
}
