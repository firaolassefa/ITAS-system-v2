package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.dto.NotificationRequest;
import com.itas.model.Notification;
import com.itas.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    // Get all notifications
    @GetMapping
    public ResponseEntity<?> getAllNotifications() {
        try {
            List<Notification> notifications = notificationService.getAllNotifications();
            return ResponseEntity.ok(new ApiResponse<>("Notifications retrieved successfully", notifications));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    // Get unread notifications
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications(@RequestParam(required = false) String role) {
        try {
            List<Notification> notifications;
            if (role != null && !role.isEmpty()) {
                notifications = notificationService.getUnreadNotificationsByRole(role);
            } else {
                notifications = notificationService.getUnreadNotifications();
            }
            return ResponseEntity.ok(new ApiResponse<>("Unread notifications retrieved successfully", notifications));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    // Get unread count
    @GetMapping("/count")
    public ResponseEntity<?> getUnreadCount(@RequestParam(required = false) String role) {
        try {
            Long count;
            if (role != null && !role.isEmpty()) {
                count = notificationService.getUnreadCountByRole(role);
            } else {
                count = notificationService.getUnreadCount();
            }
            return ResponseEntity.ok(new ApiResponse<>("Unread count retrieved successfully", count));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    // Get notifications by role
    @GetMapping("/by-role/{role}")
    public ResponseEntity<?> getNotificationsByRole(@PathVariable String role) {
        try {
            List<Notification> notifications = notificationService.getNotificationsByRole(role);
            return ResponseEntity.ok(new ApiResponse<>("Notifications retrieved successfully", notifications));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    // Send notification (Communication Officer & System Admin only)
    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('COMM_OFFICER', 'SYSTEM_ADMIN')")
    public ResponseEntity<?> sendNotification(@RequestBody NotificationRequest request) {
        try {
            Notification notification = new Notification();
            notification.setTitle(request.getTitle());
            notification.setMessage(request.getMessage());
            notification.setNotificationType(request.getNotificationType());
            notification.setPriority(request.getPriority());
            notification.setTargetAudience(request.getTargetAudience());
            notification.setScheduledFor(request.getScheduledFor());
            
            // Use a default sender ID (system admin) - in real app, get from security context
            notificationService.sendNotification(notification, 1L);
            return ResponseEntity.ok(new ApiResponse<>("Notification sent successfully", notification));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    // Mark notification as read
    @PostMapping("/mark-as-read/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok(new ApiResponse<>("Notification marked as read", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    // Mark all notifications as read
    @PostMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead(@RequestParam(required = false) String role) {
        try {
            if (role != null && !role.isEmpty()) {
                notificationService.markAllAsReadByRole(role);
            } else {
                notificationService.markAllAsRead();
            }
            return ResponseEntity.ok(new ApiResponse<>("All notifications marked as read", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    // Get notification campaigns (Communication Officer & System Admin only)
    @GetMapping("/campaigns")
    @PreAuthorize("hasAnyRole('COMM_OFFICER', 'SYSTEM_ADMIN')")
    public ResponseEntity<?> getNotificationCampaigns() {
        try {
            List<Notification> campaigns = notificationService.getCampaigns();
            return ResponseEntity.ok(new ApiResponse<>("Campaigns retrieved successfully", campaigns));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    // Get campaign statistics (Communication Officer & System Admin only)
    @GetMapping("/campaigns/stats")
    @PreAuthorize("hasAnyRole('COMM_OFFICER', 'SYSTEM_ADMIN', 'MANAGER')")
    public ResponseEntity<?> getCampaignStats() {
        try {
            // Return campaign statistics
            return ResponseEntity.ok(new ApiResponse<>("Campaign stats retrieved successfully", 
                notificationService.getCampaignStatistics()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}