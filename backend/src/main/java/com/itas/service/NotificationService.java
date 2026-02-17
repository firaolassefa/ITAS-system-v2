package com.itas.service;

import com.itas.model.Notification;
import com.itas.model.User;
import com.itas.repository.NotificationRepository;
import com.itas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
    
    // Get unread notifications (all users)
    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByReadFalse();
    }
    
    // Get unread notifications by role
    public List<Notification> getUnreadNotificationsByRole(String role) {
        return notificationRepository.findByRoleAndReadFalseOrderByCreatedAtDesc(role);
    }
    
    // Get all notifications by role
    public List<Notification> getNotificationsByRole(String role) {
        return notificationRepository.findByRoleOrderByCreatedAtDesc(role);
    }
    
    // Get unread count (all users)
    public Long getUnreadCount() {
        return notificationRepository.countByReadFalse();
    }
    
    // Get unread count by role
    public Long getUnreadCountByRole(String role) {
        return notificationRepository.countByRoleAndReadFalse(role);
    }
    
    // Mark notification as read (by ID only)
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.markAsReadById(notificationId);
    }
    
    // Mark all notifications as read (all users)
    @Transactional
    public void markAllAsRead() {
        notificationRepository.markAllAsRead();
    }
    
    // Mark all notifications as read by role
    @Transactional
    public void markAllAsReadByRole(String role) {
        notificationRepository.markAllAsReadByRole(role);
    }
    
    public Page<Notification> getNotifications(Pageable pageable) {
        return notificationRepository.findAll(pageable);
    }
    
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
    
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndRead(userId, false);
    }
    
    @Transactional
    public Notification sendNotification(Notification notification, Long senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        notification.setSender(sender);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setStatus("SENT");
        notification.setSentAt(LocalDateTime.now());
        notification.setRead(false);
        notification.setSentCount(1);
        notification.setOpenedCount(0);
        
        return notificationRepository.save(notification);
    }
    
    @Transactional
    public Notification createNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        notification.setStatus("DRAFT");
        notification.setRead(false);
        notification.setSentCount(0);
        notification.setOpenedCount(0);
        
        return notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = getNotificationById(notificationId);
        
        if (notification.getUserId().equals(userId)) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notification.setOpenedCount(notification.getOpenedCount() + 1);
            notificationRepository.save(notification);
        }
    }
    
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndRead(userId, false);
        
        for (Notification notification : notifications) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        }
        
        notificationRepository.saveAll(notifications);
    }
    
    public Map<String, Object> getStatistics() {
        List<Notification> all = notificationRepository.findAll();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", all.size());
        stats.put("sent", all.stream().filter(n -> "SENT".equals(n.getStatus())).count());
        stats.put("opened", all.stream().filter(Notification::isRead).count());
        
        // By type
        Map<String, Long> byType = new HashMap<>();
        all.forEach(n -> {
            String type = n.getNotificationType();
            byType.put(type, byType.getOrDefault(type, 0L) + 1);
        });
        stats.put("byType", byType);
        
        // By audience
        Map<String, Long> byAudience = new HashMap<>();
        all.forEach(n -> {
            String audience = n.getTargetAudience();
            byAudience.put(audience, byAudience.getOrDefault(audience, 0L) + 1);
        });
        stats.put("byAudience", byAudience);
        
        return stats;
    }
    
    @Transactional
    public void deleteNotification(Long id) {
        Notification notification = getNotificationById(id);
        notificationRepository.delete(notification);
    }
    
    @Transactional
    public Notification updateNotification(Notification notification) {
        Notification existing = getNotificationById(notification.getId());
        
        existing.setTitle(notification.getTitle());
        existing.setMessage(notification.getMessage());
        existing.setNotificationType(notification.getNotificationType());
        existing.setPriority(notification.getPriority());
        existing.setTargetAudience(notification.getTargetAudience());
        existing.setScheduledFor(notification.getScheduledFor());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return notificationRepository.save(existing);
    }
    
    @Transactional
    public void resendNotification(Long id) {
        Notification notification = getNotificationById(id);
        notification.setStatus("SENT");
        notification.setSentAt(LocalDateTime.now());
        notification.setSentCount(notification.getSentCount() + 1);
        notificationRepository.save(notification);
    }
    
    public List<Notification> getCampaigns() {
        // Return notifications that are campaigns (sent to multiple users)
        return notificationRepository.findAll().stream()
                .filter(n -> n.getSentCount() > 1 || "CAMPAIGN".equals(n.getNotificationType()))
                .toList();
    }
    
    public Map<String, Object> getCampaignStatistics() {
        List<Notification> campaigns = getCampaigns();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCampaigns", campaigns.size());
        stats.put("sentNotifications", campaigns.stream().filter(n -> "SENT".equals(n.getStatus())).count());
        stats.put("totalSent", campaigns.stream().mapToInt(Notification::getSentCount).sum());
        stats.put("totalOpened", campaigns.stream().mapToInt(Notification::getOpenedCount).sum());
        
        // Calculate open rate
        int totalSent = campaigns.stream().mapToInt(Notification::getSentCount).sum();
        int totalOpened = campaigns.stream().mapToInt(Notification::getOpenedCount).sum();
        double openRate = totalSent > 0 ? (double) totalOpened / totalSent * 100 : 0;
        stats.put("openRate", String.format("%.2f%%", openRate));
        
        // By type
        Map<String, Long> byType = new HashMap<>();
        campaigns.forEach(n -> {
            String type = n.getNotificationType();
            byType.put(type, byType.getOrDefault(type, 0L) + 1);
        });
        stats.put("byType", byType);
        
        // By audience
        Map<String, Long> byAudience = new HashMap<>();
        campaigns.forEach(n -> {
            String audience = n.getTargetAudience();
            byAudience.put(audience, byAudience.getOrDefault(audience, 0L) + 1);
        });
        stats.put("byAudience", byAudience);
        
        // Recent campaigns
        List<Notification> recentCampaigns = campaigns.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .toList();
        stats.put("recentCampaigns", recentCampaigns);
        
        return stats;
    }
}
