package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.UserType;
import com.itas.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private CertificateRepository certificateRepository;
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Autowired
    private WebinarRepository webinarRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private AssessmentRepository assessmentRepository;
    
    /**
     * Get dashboard stats for TAXPAYER
     */
    @GetMapping("/taxpayer/{userId}")
    public ResponseEntity<?> getTaxpayerDashboard(@PathVariable Long userId) {
        Map<String, Object> data = new HashMap<>();
        
        // Get user enrollments
        long enrolledCourses = enrollmentRepository.countByUserId(userId);
        long completedCourses = enrollmentRepository.countByUserIdAndProgressGreaterThanEqual(userId, 100);
        long certificates = certificateRepository.countByUserId(userId);
        
        // Calculate average progress
        Double avgProgress = enrollmentRepository.findAverageProgressByUserId(userId);
        
        data.put("enrolledCourses", enrolledCourses);
        data.put("completedCourses", completedCourses);
        data.put("certificates", certificates);
        data.put("averageProgress", avgProgress != null ? avgProgress.intValue() : 0);
        
        // Get active courses
        data.put("activeCourses", enrollmentRepository.findByUserIdAndProgressLessThan(userId, 100));
        
        // Get upcoming webinars
        data.put("upcomingWebinars", webinarRepository.findUpcomingWebinars());
        
        return ResponseEntity.ok(new ApiResponse<>("Dashboard data retrieved", data));
    }
    
    /**
     * Get dashboard stats for MOR_STAFF
     */
    @GetMapping("/staff/{userId}")
    public ResponseEntity<?> getStaffDashboard(@PathVariable Long userId) {
        Map<String, Object> data = new HashMap<>();
        
        long totalCourses = courseRepository.count();
        long enrolledCourses = enrollmentRepository.countByUserId(userId);
        long completedCourses = enrollmentRepository.countByUserIdAndProgressGreaterThanEqual(userId, 100);
        long certificates = certificateRepository.countByUserId(userId);
        
        data.put("totalCourses", totalCourses);
        data.put("enrolledCourses", enrolledCourses);
        data.put("completedCourses", completedCourses);
        data.put("certificates", certificates);
        data.put("complianceScore", 85); // Calculate based on mandatory training completion
        
        return ResponseEntity.ok(new ApiResponse<>("Staff dashboard data retrieved", data));
    }
    
    /**
     * Get dashboard stats for CONTENT_ADMIN
     */
    @GetMapping("/content-admin")
    public ResponseEntity<?> getContentAdminDashboard() {
        Map<String, Object> data = new HashMap<>();
        
        long totalResources = resourceRepository.count();
        long publishedToday = resourceRepository.countByCreatedAtToday();
        long pendingApproval = resourceRepository.countByStatus("PENDING");
        
        data.put("totalResources", totalResources);
        data.put("publishedToday", publishedToday);
        data.put("pendingApproval", pendingApproval);
        data.put("storageUsed", "4.2 GB"); // Calculate from file sizes
        
        // Get recent uploads
        data.put("recentUploads", resourceRepository.findTop10ByOrderByCreatedAtDesc());
        
        // Get resource type breakdown
        Map<String, Long> resourceTypes = new HashMap<>();
        resourceTypes.put("videos", resourceRepository.countByResourceType("VIDEO"));
        resourceTypes.put("pdfs", resourceRepository.countByResourceType("PDF"));
        resourceTypes.put("images", resourceRepository.countByResourceType("IMAGE"));
        data.put("resourceTypes", resourceTypes);
        
        return ResponseEntity.ok(new ApiResponse<>("Content admin dashboard data retrieved", data));
    }
    
    /**
     * Get dashboard stats for TRAINING_ADMIN
     */
    @GetMapping("/training-admin")
    public ResponseEntity<?> getTrainingAdminDashboard() {
        Map<String, Object> data = new HashMap<>();
        
        long totalCourses = courseRepository.count();
        long totalWebinars = webinarRepository.count();
        long upcomingWebinars = webinarRepository.countUpcoming();
        long totalEnrollments = enrollmentRepository.count();
        
        data.put("totalCourses", totalCourses);
        data.put("totalWebinars", totalWebinars);
        data.put("upcomingWebinars", upcomingWebinars);
        data.put("totalEnrollments", totalEnrollments);
        data.put("attendanceRate", 78); // Calculate from webinar attendance
        
        // Get upcoming webinars
        data.put("webinars", webinarRepository.findUpcomingWebinars());
        
        return ResponseEntity.ok(new ApiResponse<>("Training admin dashboard data retrieved", data));
    }
    
    /**
     * Get dashboard stats for COMM_OFFICER
     */
    @GetMapping("/comm-officer")
    public ResponseEntity<?> getCommOfficerDashboard() {
        Map<String, Object> data = new HashMap<>();
        
        long totalNotifications = notificationRepository.count();
        long sentToday = notificationRepository.countByCreatedAtToday();
        
        data.put("totalCampaigns", totalNotifications);
        data.put("sentToday", sentToday);
        data.put("openRate", 72); // Calculate from notification reads
        data.put("activeRecipients", userRepository.countByActive(true));
        
        // Get recent campaigns
        data.put("recentCampaigns", notificationRepository.findTop10ByOrderByCreatedAtDesc());
        
        return ResponseEntity.ok(new ApiResponse<>("Communication officer dashboard data retrieved", data));
    }
    
    /**
     * Get dashboard stats for MANAGER
     */
    @GetMapping("/manager")
    public ResponseEntity<?> getManagerDashboard() {
        Map<String, Object> data = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActive(true);
        long totalCourses = courseRepository.count();
        long completedEnrollments = enrollmentRepository.countByProgressGreaterThanEqual(100);
        long totalEnrollments = enrollmentRepository.count();
        
        int completionRate = totalEnrollments > 0 ? 
            (int)((completedEnrollments * 100) / totalEnrollments) : 0;
        
        data.put("totalUsers", totalUsers);
        data.put("activeUsers", activeUsers);
        data.put("totalCourses", totalCourses);
        data.put("completionRate", completionRate);
        
        // Get course performance
        data.put("coursePerformance", courseRepository.findAllWithEnrollmentStats());
        
        return ResponseEntity.ok(new ApiResponse<>("Manager dashboard data retrieved", data));
    }
    
    /**
     * Get dashboard stats for SYSTEM_ADMIN
     */
    @GetMapping("/system-admin")
    public ResponseEntity<?> getSystemAdminDashboard() {
        Map<String, Object> data = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActive(true);
        long totalCourses = courseRepository.count();
        long totalResources = resourceRepository.count();
        
        data.put("totalUsers", totalUsers);
        data.put("activeUsers", activeUsers);
        data.put("totalCourses", totalCourses);
        data.put("totalResources", totalResources);
        data.put("systemHealth", 99.8);
        data.put("storageUsage", "45%");
        
        // Get user type breakdown
        Map<String, Long> usersByType = new HashMap<>();
        for (UserType type : UserType.values()) {
            usersByType.put(type.name(), userRepository.countByUserType(type));
        }
        data.put("usersByType", usersByType);
        
        return ResponseEntity.ok(new ApiResponse<>("System admin dashboard data retrieved", data));
    }
    
    /**
     * Get dashboard stats for AUDITOR
     */
    @GetMapping("/auditor")
    public ResponseEntity<?> getAuditorDashboard() {
        Map<String, Object> data = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalCourses = courseRepository.count();
        long totalResources = resourceRepository.count();
        long totalAssessments = assessmentRepository.count();
        
        data.put("totalUsers", totalUsers);
        data.put("totalCourses", totalCourses);
        data.put("totalResources", totalResources);
        data.put("totalAudits", totalAssessments);
        data.put("complianceScore", 94);
        data.put("systemHealth", 99.8);
        
        return ResponseEntity.ok(new ApiResponse<>("Auditor dashboard data retrieved", data));
    }
    
    /**
     * Get dashboard stats based on current user role
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        switch (user.getUserType()) {
            case TAXPAYER:
                return getTaxpayerDashboard(user.getId());
            case MOR_STAFF:
                return getStaffDashboard(user.getId());
            case CONTENT_ADMIN:
                return getContentAdminDashboard();
            case TRAINING_ADMIN:
                return getTrainingAdminDashboard();
            case COMM_OFFICER:
                return getCommOfficerDashboard();
            case MANAGER:
                return getManagerDashboard();
            case SYSTEM_ADMIN:
                return getSystemAdminDashboard();
            case AUDITOR:
                return getAuditorDashboard();
            default:
                return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid user type", null));
        }
    }
}
