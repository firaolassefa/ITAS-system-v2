package com.itas.repository;

import com.itas.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByStatus(String status, Pageable pageable);
    
    Page<Notification> findBySenderId(Long senderId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE " +
           "(:status IS NULL OR n.status = :status) AND " +
           "(:type IS NULL OR n.notificationType = :type)")
    Page<Notification> findNotificationsWithFilters(
            @Param("status") String status,
            @Param("type") String type,
            Pageable pageable);
    
    List<Notification> findByStatusAndScheduledForBefore(String status, LocalDateTime dateTime);
    
    @Query("SELECT n FROM Notification n WHERE n.targetAudience = :audience AND n.status = 'SENT'")
    List<Notification> findByTargetAudience(@Param("audience") String audience);
    
    List<Notification> findByUserId(Long userId);
    
    List<Notification> findByUserIdAndRead(Long userId, boolean read);
    
    // New methods for notification management
    List<Notification> findByReadFalse();
    
    Long countByReadFalse();
    
    List<Notification> findAllByOrderByCreatedAtDesc();
    
    List<Notification> findByReadFalseOrderByCreatedAtDesc();
    
    // Role-based notifications
    List<Notification> findByRole(String role);
    
    List<Notification> findByRoleAndReadFalse(String role);
    
    Long countByRoleAndReadFalse(String role);
    
    List<Notification> findByRoleOrderByCreatedAtDesc(String role);
    
    List<Notification> findByRoleAndReadFalseOrderByCreatedAtDesc(String role);
    
    // Mark as read methods
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.read = true, n.readAt = CURRENT_TIMESTAMP WHERE n.read = false")
    void markAllAsRead();
    
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.read = true, n.readAt = CURRENT_TIMESTAMP WHERE n.id = :id")
    void markAsReadById(@Param("id") Long id);
    
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.read = true, n.readAt = CURRENT_TIMESTAMP WHERE n.role = :role AND n.read = false")
    void markAllAsReadByRole(@Param("role") String role);
    
    // Dashboard methods
    @Query("SELECT COUNT(n) FROM Notification n WHERE DATE(n.createdAt) = CURRENT_DATE")
    long countByCreatedAtToday();
    
    @Query("SELECT n FROM Notification n ORDER BY n.createdAt DESC")
    List<Notification> findTop10ByOrderByCreatedAtDesc();
}
