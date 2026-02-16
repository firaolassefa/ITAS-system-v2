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
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
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
        course.setModules(courseDetails.getModules());
        course.setPublished(courseDetails.isPublished());
        course.setUpdatedAt(LocalDateTime.now());
        
        return courseRepository.save(course);
    }
    
    @Transactional
    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
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
        
        enrollment.setProgress(progress);
        
        if (progress >= 100.0) {
            enrollment.setStatus("COMPLETED");
            enrollment.setCompletedAt(LocalDateTime.now());
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
}
