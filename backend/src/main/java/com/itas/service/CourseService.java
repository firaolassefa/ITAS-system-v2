package com.itas.service;

import com.itas.model.Course;
import com.itas.model.Enrollment;
import com.itas.model.User;
import com.itas.repository.CourseRepository;
import com.itas.repository.EnrollmentRepository;
import com.itas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CertificateService certificateService;
    
    @Autowired
    private com.itas.repository.ModuleRepository moduleRepository;
    
    @Autowired
    private com.itas.repository.ModuleProgressRepository moduleProgressRepository;
    
    public List<Map<String, Object>> getAllCourses() {
        return courseRepository.findAll().stream().map(course -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", course.getId());
            item.put("title", course.getTitle());
            item.put("description", course.getDescription());
            item.put("category", course.getCategory());
            item.put("difficulty", course.getDifficulty());
            item.put("durationHours", course.getDurationHours());
            item.put("published", course.isPublished());
            item.put("createdAt", course.getCreatedAt());
            item.put("updatedAt", course.getUpdatedAt());
            item.put("moduleCount", moduleRepository.countByCourseId(course.getId()));
            return item;
        }).collect(Collectors.toList());
    }
    
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }
    
    @Transactional
    public Course createCourse(Course course) {
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }
    
    @Transactional
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = getCourseById(id);
        
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setCategory(courseDetails.getCategory());
        course.setDifficulty(courseDetails.getDifficulty());
        course.setDurationHours(courseDetails.getDurationHours());
        course.setPublished(courseDetails.isPublished());
        course.setUpdatedAt(LocalDateTime.now());
        
        return courseRepository.save(course);
    }
    
    @Transactional
    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        
        // Delete related records first to avoid foreign key constraint violations
        
        // 1. Delete all module progress records for modules in this course
        List<com.itas.model.Module> modules = moduleRepository.findByCourseIdOrderByModuleOrderAsc(id);
        for (com.itas.model.Module module : modules) {
            moduleProgressRepository.deleteByModuleId(module.getId());
        }
        
        // 2. Delete all enrollments for this course
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(id);
        enrollmentRepository.deleteAll(enrollments);
        
        // 3. Delete all modules for this course
        moduleRepository.deleteAll(modules);
        
        // 4. Delete certificates for this course (if any)
        // Note: CertificateRepository should have a method to delete by courseId
        // For now, we'll let the database handle this with ON DELETE CASCADE if configured
        
        // 5. Finally, delete the course
        courseRepository.delete(course);
    }
    
    @Transactional
    public Map<String, Object> enrollUser(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Course course = getCourseById(courseId);
        
        // Check if already enrolled
        Enrollment existing = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (existing != null) {
            throw new RuntimeException("Already enrolled in this course");
        }
        
        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(userId);
        enrollment.setCourseId(courseId);
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setProgress(0.0);
        enrollment.setStatus("ENROLLED");
        
        Enrollment saved = enrollmentRepository.save(enrollment);
        
        Map<String, Object> response = new HashMap<>();
        response.put("enrollmentId", saved.getId());
        response.put("courseId", courseId);
        response.put("userId", userId);
        response.put("status", saved.getStatus());
        
        return response;
    }
    
    @Transactional
    public void updateProgress(Long enrollmentId, double progress) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        boolean wasNotCompleted = enrollment.getProgress() < 100.0;
        
        enrollment.setProgress(progress);
        
        if (progress >= 100.0) {
            enrollment.setStatus("COMPLETED");
            enrollment.setCompletedAt(LocalDateTime.now());
            
            // Auto-generate certificate if course just completed
            if (wasNotCompleted) {
                try {
                    certificateService.generateCertificate(enrollment.getUserId(), enrollment.getCourseId());
                } catch (Exception e) {
                    // Certificate might already exist, log but don't fail
                    System.err.println("Could not generate certificate: " + e.getMessage());
                }
            }
        }
        
        enrollmentRepository.save(enrollment);
    }
    
    public List<Map<String, Object>> getUserEnrollments(Long userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        
        return enrollments.stream().map(enrollment -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", enrollment.getId());
            item.put("userId", enrollment.getUserId());
            item.put("courseId", enrollment.getCourseId());
            item.put("enrolledAt", enrollment.getEnrolledAt());
            item.put("progress", enrollment.getProgress());
            item.put("status", enrollment.getStatus());
            item.put("completedAt", enrollment.getCompletedAt());
            
            // Get course details
            courseRepository.findById(enrollment.getCourseId()).ifPresent(course -> {
                item.put("course", course);
            });
            
            return item;
        }).collect(Collectors.toList());
    }
    
    @Transactional
    public Map<String, Object> completeModule(Long userId, Long courseId, Long moduleId) {
        // Get or create enrollment
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (enrollment == null) {
            throw new RuntimeException("User not enrolled in this course");
        }
        
        // Get or create module progress
        com.itas.model.ModuleProgress moduleProgress = moduleProgressRepository
            .findByUserIdAndModuleId(userId, moduleId)
            .orElseGet(() -> {
                com.itas.model.ModuleProgress mp = new com.itas.model.ModuleProgress();
                mp.setUser(userRepository.findById(userId).orElseThrow());
                mp.setModule(moduleRepository.findById(moduleId).orElseThrow());
                mp.setEnrollment(enrollment);
                mp.setStartedAt(LocalDateTime.now());
                return mp;
            });
        
        // Mark module as completed
        moduleProgress.setCompleted(true);
        moduleProgress.setProgress(100.0);
        moduleProgress.setCompletedAt(LocalDateTime.now());
        moduleProgressRepository.save(moduleProgress);
        
        // Calculate overall course progress
        List<com.itas.model.Module> allModules = moduleRepository.findByCourseIdOrderByModuleOrderAsc(courseId);
        List<com.itas.model.ModuleProgress> completedModules = moduleProgressRepository
            .findByEnrollmentIdAndCompleted(enrollment.getId(), true);
        
        double courseProgress = allModules.isEmpty() ? 0 : 
            (completedModules.size() * 100.0) / allModules.size();
        
        // Update enrollment progress
        updateProgress(enrollment.getId(), courseProgress);
        
        Map<String, Object> result = new HashMap<>();
        result.put("moduleCompleted", true);
        result.put("courseProgress", courseProgress);
        result.put("totalModules", allModules.size());
        result.put("completedModules", completedModules.size());
        result.put("courseCompleted", courseProgress >= 100.0);
        
        return result;
    }
}

