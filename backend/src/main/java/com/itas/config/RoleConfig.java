package com.itas.config;

import com.itas.model.User;
import com.itas.model.UserRole;
import com.itas.model.UserType;
import com.itas.repository.UserRepository;
import com.itas.repository.UserRoleRepository;
import com.itas.repository.CourseRepository;
import com.itas.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
public class RoleConfig {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Bean
    public CommandLineRunner initializeRoles(
            UserRepository userRepository,
            UserRoleRepository userRoleRepository,
            CourseRepository courseRepository,
            ResourceRepository resourceRepository) {
        return args -> {
            // Create default system admin if not exists
            if (userRepository.findByUsername("systemadmin").isEmpty()) {
                User systemAdmin = new User();
                systemAdmin.setUsername("systemadmin");
                systemAdmin.setPassword(passwordEncoder.encode("Admin@123"));
                systemAdmin.setFullName("System Administrator");
                systemAdmin.setEmail("system.admin@itas.gov.et");
                systemAdmin.setUserType(UserType.SYSTEM_ADMIN);
                systemAdmin.setActive(true);
                systemAdmin.setCreatedAt(LocalDateTime.now());
                userRepository.save(systemAdmin);
                
                // Assign all roles to system admin (only if they don't already exist)
                Arrays.asList(
                    "MANAGE_USERS", "MANAGE_ROLES", "SYSTEM_CONFIG",
                    "VIEW_ANALYTICS", "EXPORT_REPORTS", "UPLOAD_RESOURCES",
                    "UPDATE_RESOURCES", "ARCHIVE_RESOURCES", "SCHEDULE_WEBINARS",
                    "MANAGE_WEBINARS", "SEND_NOTIFICATIONS"
                ).forEach(role -> {
                    if (!userRoleRepository.existsByUserIdAndRoleName(systemAdmin.getId(), role)) {
                        UserRole userRole = new UserRole();
                        userRole.setUser(systemAdmin);
                        userRole.setRoleName(role);
                        userRole.setAssignedBy(systemAdmin);
                        userRole.setAssignedAt(LocalDateTime.now());
                        userRoleRepository.save(userRole);
                    }
                });
            }
            
            // Create other admin users based on requirements
            createUserIfNotExists(
                userRepository, userRoleRepository,
                "contentadmin", "Content@123",
                "Content Administrator", "content.admin@itas.gov.et",
                UserType.CONTENT_ADMIN,
                Arrays.asList("UPLOAD_RESOURCES", "UPDATE_RESOURCES", "ARCHIVE_RESOURCES")
            );
            
            createUserIfNotExists(
                userRepository, userRoleRepository,
                "trainingadmin", "Training@123",
                "Training Administrator", "training.admin@itas.gov.et",
                UserType.TRAINING_ADMIN,
                Arrays.asList("SCHEDULE_WEBINARS", "MANAGE_WEBINARS")
            );
            
            createUserIfNotExists(
                userRepository, userRoleRepository,
                "commoffice", "Notification@123",
                "Communication Officer", "communication@itas.gov.et",
                UserType.COMM_OFFICER,
                Arrays.asList("SEND_NOTIFICATIONS")
            );
            
            createUserIfNotExists(
                userRepository, userRoleRepository,
                "manager", "Manager@123",
                "System Manager", "manager@itas.gov.et",
                UserType.MANAGER,
                Arrays.asList("VIEW_ANALYTICS", "EXPORT_REPORTS")
            );
            
            // Create MOR Staff user
            createUserIfNotExists(
                userRepository, userRoleRepository,
                "morstaff", "Staff@123",
                "Ministry Staff Member", "staff@itas.gov.et",
                UserType.MOR_STAFF,
                Arrays.asList("VIEW_COURSES", "ENROLL_COURSES", "COMPLETE_MODULES",
                             "VIEW_RESOURCES", "DOWNLOAD_RESOURCES", "ACCESS_INTERNAL_TRAINING")
            );
            
            // Create Auditor user
            createUserIfNotExists(
                userRepository, userRoleRepository,
                "auditor", "Auditor@123",
                "System Auditor", "auditor@itas.gov.et",
                UserType.AUDITOR,
                Arrays.asList("VIEW_ANALYTICS", "AUDIT_SYSTEM", "VIEW_LOGS", "EXPORT_REPORTS")
            );
            
            // Create sample taxpayer
            createUserIfNotExists(
                userRepository, userRoleRepository,
                "taxpayer", "Taxpayer@123",
                "John Taxpayer", "john.taxpayer@example.com",
                UserType.TAXPAYER,
                Arrays.asList("VIEW_COURSES", "ENROLL_COURSES", "COMPLETE_MODULES",
                             "VIEW_RESOURCES", "DOWNLOAD_RESOURCES")
            );
            
            // Initialize sample courses if none exist
            if (courseRepository.count() == 0) {
                initializeSampleCourses(courseRepository);
            }
            
            // Initialize sample resources if none exist
            if (resourceRepository.count() == 0) {
                initializeSampleResources(resourceRepository);
            }
        };
    }
    
    private void createUserIfNotExists(
            UserRepository userRepository,
            UserRoleRepository userRoleRepository,
            String username, String password,
            String fullName, String email,
            UserType userType,
            java.util.List<String> roles) {
        
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setFullName(fullName);
            user.setEmail(email);
            user.setUserType(userType);
            user.setActive(true);
            user.setCreatedAt(LocalDateTime.now());
            User savedUser = userRepository.save(user);
            
            // Assign roles (only if they don't already exist)
            roles.forEach(role -> {
                if (!userRoleRepository.existsByUserIdAndRoleName(savedUser.getId(), role)) {
                    UserRole userRole = new UserRole();
                    userRole.setUser(savedUser);
                    userRole.setRoleName(role);
                    userRole.setAssignedBy(savedUser); // Self-assigned for initial setup
                    userRole.setAssignedAt(LocalDateTime.now());
                    userRoleRepository.save(userRole);
                }
            });
        }
    }
    
    private void initializeSampleCourses(com.itas.repository.CourseRepository courseRepository) {
        com.itas.model.Course course1 = new com.itas.model.Course();
        course1.setTitle("VAT Fundamentals for Beginners");
        course1.setDescription("Learn basic VAT concepts, registration, and filing procedures.");
        course1.setCategory("VAT");
        course1.setDifficulty("BEGINNER");
        course1.setDurationHours(4);
        course1.setModules(Arrays.asList("Introduction to VAT", "VAT Registration Process", "Filing VAT Returns", "Common VAT Mistakes"));
        course1.setPublished(true);
        course1.setCreatedAt(LocalDateTime.now());
        course1.setUpdatedAt(LocalDateTime.now());
        courseRepository.save(course1);
        
        com.itas.model.Course course2 = new com.itas.model.Course();
        course2.setTitle("Income Tax Calculation");
        course2.setDescription("Complete guide to calculating and filing income tax returns.");
        course2.setCategory("INCOME_TAX");
        course2.setDifficulty("INTERMEDIATE");
        course2.setDurationHours(6);
        course2.setModules(Arrays.asList("Understanding Tax Brackets", "Deductions and Allowances", "Filing Online Returns"));
        course2.setPublished(true);
        course2.setCreatedAt(LocalDateTime.now());
        course2.setUpdatedAt(LocalDateTime.now());
        courseRepository.save(course2);
        
        com.itas.model.Course course3 = new com.itas.model.Course();
        course3.setTitle("Corporate Tax Compliance");
        course3.setDescription("Advanced corporate tax obligations and compliance requirements.");
        course3.setCategory("CORPORATE_TAX");
        course3.setDifficulty("ADVANCED");
        course3.setDurationHours(8);
        course3.setModules(Arrays.asList("Corporate Tax Structures", "Tax Planning Strategies", "Compliance Reporting"));
        course3.setPublished(true);
        course3.setCreatedAt(LocalDateTime.now());
        course3.setUpdatedAt(LocalDateTime.now());
        courseRepository.save(course3);
    }
    
    private void initializeSampleResources(com.itas.repository.ResourceRepository resourceRepository) {
        com.itas.model.Resource resource1 = new com.itas.model.Resource();
        resource1.setTitle("VAT Compliance Handbook 2024");
        resource1.setDescription("Complete guide to VAT compliance for small and medium businesses. (Demo resource - upload actual files to test download functionality)");
        resource1.setResourceType("PDF");
        resource1.setFilePath(null); // Demo resource - no actual file
        resource1.setFileName("vat-handbook.pdf");
        resource1.setCategory("VAT");
        resource1.setAudience("ALL");
        resource1.setStatus("PUBLISHED");
        resource1.setViewCount(1250);
        resource1.setDownloadCount(890);
        resource1.setUploadedAt(LocalDateTime.now());
        resourceRepository.save(resource1);
        
        com.itas.model.Resource resource2 = new com.itas.model.Resource();
        resource2.setTitle("How to File Tax Returns Online");
        resource2.setDescription("Step-by-step video tutorial for online tax filing. (Demo resource - upload actual files to test video playback)");
        resource2.setResourceType("VIDEO");
        resource2.setFilePath(null); // Demo resource - no actual file
        resource2.setFileName("tax-filing.mp4");
        resource2.setCategory("INCOME_TAX");
        resource2.setAudience("TAXPAYER");
        resource2.setStatus("PUBLISHED");
        resource2.setViewCount(3200);
        resource2.setDownloadCount(1500);
        resource2.setUploadedAt(LocalDateTime.now());
        resourceRepository.save(resource2);
        
        com.itas.model.Resource resource3 = new com.itas.model.Resource();
        resource3.setTitle("Tax Deductions Guide");
        resource3.setDescription("Comprehensive list of eligible tax deductions and credits. (Demo resource - upload actual files to test download functionality)");
        resource3.setResourceType("PDF");
        resource3.setFilePath(null); // Demo resource - no actual file
        resource3.setFileName("deductions-guide.pdf");
        resource3.setCategory("INCOME_TAX");
        resource3.setAudience("ALL");
        resource3.setStatus("PUBLISHED");
        resource3.setViewCount(890);
        resource3.setDownloadCount(670);
        resource3.setUploadedAt(LocalDateTime.now());
        resourceRepository.save(resource3);
    }
}