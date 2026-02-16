package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Course;
import com.itas.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/courses")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping("")
    public ResponseEntity<?> getAllCourses() {
        return ResponseEntity.ok(new ApiResponse<>("Success", courseService.getAllCourses()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        try {
            Course course = courseService.getCourseById(id);
            return ResponseEntity.ok(new ApiResponse<>("Success", course));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @PostMapping("")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        Course created = courseService.createCourse(course);
        return ResponseEntity.ok(new ApiResponse<>("Course created successfully", created));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        try {
            Course updated = courseService.updateCourse(id, course);
            return ResponseEntity.ok(new ApiResponse<>("Course updated successfully", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(new ApiResponse<>("Course deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @PostMapping("/enroll")
    public ResponseEntity<?> enroll(@RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        Long courseId = request.get("courseId");
        
        try {
            Map<String, Object> enrollment = courseService.enrollUser(userId, courseId);
            return ResponseEntity.ok(new ApiResponse<>("Successfully enrolled in course", enrollment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @PutMapping("/progress")
    public ResponseEntity<?> updateProgress(@RequestBody Map<String, Object> request) {
        Long enrollmentId = ((Number) request.get("enrollmentId")).longValue();
        double progress = ((Number) request.get("progress")).doubleValue();
        
        try {
            courseService.updateProgress(enrollmentId, progress);
            return ResponseEntity.ok(new ApiResponse<>("Progress updated", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @GetMapping("/enrollments/{userId}")
    public ResponseEntity<?> getUserEnrollments(@PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>("Success", courseService.getUserEnrollments(userId)));
    }
}